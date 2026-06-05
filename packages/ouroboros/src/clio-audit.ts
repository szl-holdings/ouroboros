/**
 * clio-audit.ts — CLIO projection-sufficiency audit for the Ouroboros loop.
 *
 * WHY THIS EXISTS (honest provenance)
 * -----------------------------------
 * An external review — Flyxion, "Convergence Without Ground: A Critical
 * Examination of the Ouroboros Thesis and Its Integration with RSVP, CLIO, and
 * MEM|8" (2026-06-05) — made a correct structural point: a convergence trace
 * MEASURES stabilization but does not EXPLAIN it. A loop can report `converged`
 * yet have paused on an INSUFFICIENT projection π : X → M, where convergence in
 * the operational space M does not imply convergence in the latent task space X
 * ("false arrest"). See critique §5, §7.
 *
 * The exact latent error E_π(x_t) = ‖x_t − x̂_t‖ (critique Eq. 9) is NOT
 * computable at runtime because X is inaccessible. The critique's operationally
 * tractable contribution is a SURROGATE audit bundle (Eq. 12) that probes E_π
 * from OBSERVABLE artifacts only. This module implements exactly that, plus the
 * enriched exit predicate (Eq. 13) and the extended trace tuple (Eq. 14).
 *
 * HONEST POSTURE
 * --------------
 *  • This produces EVIDENCE of projection sufficiency, NOT PROOF (critique
 *    Eq. 19 is a probabilistic claim, deliberately not a theorem). Nothing here
 *    is presented as a proved guarantee.
 *  • It is an OPTIONAL high-trust configuration, OFF by default: computing
 *    multiple independent representations per step can cost 5–10× the base loop
 *    (critique §9.3 cost caveat). Enable it for high-stakes runs.
 *  • The single hard correctness rule it enforces: the "consistent" exit path
 *    must NEVER be reachable via a self-comparison consistency(o,o) (critique
 *    §4.2 / falsifier F10). assertNotSelfComparison() makes that a runtime fault.
 *
 * No external deps. Lean-core-free TypeScript (Lean kernel numbers untouched;
 * Doctrine v11 749/14/163 unchanged; Λ remains Conjecture 1).
 */

// ---------------------------------------------------------------------------
// §1  Surrogate audit bundle  Ê_π(s_t) = αR + βU + γK + δG + λH   (Eq. 12)
// ---------------------------------------------------------------------------

/** Independent, simultaneous representations of the SAME operational state.
 *  Projection disagreement across these is the most informative surrogate
 *  (critique §7.3): if symbolic / NL / schema / embedding views agree on the
 *  decision-bearing structure, the projection is likely sufficient. */
export interface StateViews {
  /** Symbolic plan graph serialized to a canonical string (e.g. sorted edges). */
  symbolic?: string;
  /** Natural-language summary of the state. */
  summary?: string;
  /** Schema-validated structured form (canonical JSON). */
  schema?: string;
  /** Dense embedding of the state. */
  embedding?: number[];
}

/** Raw observable signals available at a step (all OPTIONAL — absent signals
 *  contribute 0 with their weight, never a fabricated value). */
export interface SurrogateSignals {
  /** R_t — residual uncertainty in [0,1] (confidence dispersion, weak retrieval).
   *  Higher = more uncertain. */
  residualUncertainty?: number;
  /** Independent views of the state, for projection-disagreement U_t. */
  views?: StateViews;
  /** K_t raw — count of constraint violations (policy fails, type errors,
   *  invariant breaks) observed at this step. */
  constraintViolations?: number;
  /** G_t — goal instability in [0,1]: did the objective drift as Δ shrank? */
  goalInstability?: number;
  /** H_t — trace-history anomaly in [0,1]: how unusual is this convergence
   *  profile vs prior runs on similar tasks? */
  historyAnomaly?: number;
}

/** Mixing weights for the surrogate bundle. Defaults weight projection
 *  disagreement (β) and constraint violation (γ) highest — the two surrogates
 *  the critique calls most informative and least gameable. */
export interface SurrogateWeights {
  alpha: number; // R — residual uncertainty
  beta: number;  // U — projection disagreement
  gamma: number; // K — constraint violation
  delta: number; // G — goal instability
  lambda: number; // H — history anomaly
}

export const DEFAULT_SURROGATE_WEIGHTS: SurrogateWeights = {
  alpha: 0.2,
  beta: 0.35,
  gamma: 0.25,
  delta: 0.1,
  lambda: 0.1,
};

/** A computed surrogate audit bundle for one step. Every component is in [0,1];
 *  `value` is the weighted sum normalized by the active weight mass so it stays
 *  in [0,1] even when some signals are absent. */
export interface SurrogateAudit {
  R: number; // residual uncertainty
  U: number; // projection disagreement (1 − mean pairwise view agreement)
  K: number; // constraint violation (saturating)
  G: number; // goal instability
  H: number; // history anomaly
  /** Ê_π — bounded surrogate projection-error estimate in [0,1]. Higher = more
   *  likely the projection is hiding task-relevant structure. */
  value: number;
  /** Which signals were actually present (the rest contributed 0 honestly). */
  present: Array<'R' | 'U' | 'K' | 'G' | 'H'>;
}

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

/** Cosine→[0,1] for two embeddings (matches vectorConsistency in
 *  consistency.ts). Exported for callers that supply per-view embeddings and
 *  want to fold embedding agreement into projection disagreement U_t. */
export function embeddingAgreement(a?: number[], b?: number[]): number | undefined {
  if (!a || !b || a.length === 0 || a.length !== b.length) return undefined;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!; na += a[i]! * a[i]!; nb += b[i]! * b[i]!;
  }
  if (na === 0 || nb === 0) return undefined;
  const cos = dot / (Math.sqrt(na) * Math.sqrt(nb));
  return clamp01((cos + 1) / 2);
}

/** Jaccard token agreement for two strings, [0,1]. */
function tokenAgreement(a?: string, b?: string): number | undefined {
  if (a === undefined || b === undefined) return undefined;
  const ta = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const tb = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  if (ta.size === 0 && tb.size === 0) return 1;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const uni = ta.size + tb.size - inter;
  return uni === 0 ? 0 : inter / uni;
}

/** Projection disagreement U_t = 1 − mean pairwise agreement across the
 *  independent views. Returns undefined when fewer than 2 views are present
 *  (cannot disagree with a single view — honest absence, not a fabricated 0). */
export function projectionDisagreement(views?: StateViews): number | undefined {
  if (!views) return undefined;
  const agreements: number[] = [];
  const push = (x: number | undefined) => { if (x !== undefined) agreements.push(x); };
  // textual views compared by token overlap
  push(tokenAgreement(views.symbolic, views.summary));
  push(tokenAgreement(views.symbolic, views.schema));
  push(tokenAgreement(views.summary, views.schema));
  // embedding compared to the textual views by re-embedding? We only have the
  // embedding vector here, so compare embedding↔embedding only when two exist.
  // (A real deployment supplies one embedding per view; here we treat the single
  //  embedding as agreeing with itself = no signal, so it is NOT counted.)
  if (agreements.length === 0) return undefined;
  const mean = agreements.reduce((s, x) => s + x, 0) / agreements.length;
  return clamp01(1 - mean);
}

/** Compute the surrogate audit bundle Ê_π for one step (Eq. 12). Absent signals
 *  are excluded from BOTH the numerator and the weight mass, so a partial bundle
 *  is honest rather than silently treating missing signals as 0-error. */
export function computeSurrogateAudit(
  signals: SurrogateSignals,
  weights: SurrogateWeights = DEFAULT_SURROGATE_WEIGHTS,
): SurrogateAudit {
  const present: SurrogateAudit['present'] = [];

  // R is present only when the caller actually supplied a finite value — an
  // absent R must NOT be silently scored as 0 error (honest absence).
  const rRaw = signals.residualUncertainty;
  const R = rRaw === undefined || !Number.isFinite(rRaw) ? undefined : clamp01(rRaw);
  const U = projectionDisagreement(signals.views);
  // K saturates: 1 − exp(−v) maps any non-negative violation count into [0,1).
  const kRaw = signals.constraintViolations;
  const K = kRaw === undefined || !Number.isFinite(kRaw)
    ? undefined
    : clamp01(1 - Math.exp(-Math.max(0, kRaw)));
  const G = signals.goalInstability === undefined ? undefined : clamp01(signals.goalInstability);
  const H = signals.historyAnomaly === undefined ? undefined : clamp01(signals.historyAnomaly);

  let num = 0, mass = 0;
  const add = (label: SurrogateAudit['present'][number], v: number | undefined, w: number) => {
    if (v === undefined || Number.isNaN(v)) return;
    num += w * v; mass += w; present.push(label);
  };
  add('R', R, weights.alpha);
  add('U', U, weights.beta);
  add('K', K, weights.gamma);
  add('G', G, weights.delta);
  add('H', H, weights.lambda);

  const value = mass > 0 ? clamp01(num / mass) : 0;
  return {
    R: R ?? 0,
    U: U ?? 0,
    K: K ?? 0,
    G: G ?? 0,
    H: H ?? 0,
    value,
    present,
  };
}

// ---------------------------------------------------------------------------
// §2  Enriched exit predicate   Δ ≤ ε ∧ C_fixed ≥ τ ∧ Ê_π ≤ η   (Eq. 13)
// ---------------------------------------------------------------------------

export interface EnrichedExitInput {
  delta: number;          // Δ_t
  convergenceThreshold: number; // ε
  /** C_fixed — corrected cross-step consistency (current vs PRIOR/PROSPECTIVE
   *  candidate, NEVER self). Must be produced by a non-self comparison. */
  fixedConsistency: number;
  consistencyThreshold: number; // τ
  surrogate: number;      // Ê_π value in [0,1]
  surrogateCeiling: number; // η
}

export interface EnrichedExitResult {
  exit: boolean;
  /** Which conjuncts held — for the audit trail. */
  metricConverged: boolean;
  consistencyHeld: boolean;
  projectionSufficient: boolean;
}

/** Enriched exit (Eq. 13): exit ONLY when the loop has stabilized AND the
 *  corrected consistency holds AND the surrogate projection error is bounded.
 *  "Do not exit merely because the loop has stabilized; exit only when
 *   stabilization is not hiding important structure." (critique §7.3) */
export function enrichedExit(inp: EnrichedExitInput): EnrichedExitResult {
  const metricConverged = inp.delta <= inp.convergenceThreshold;
  const consistencyHeld = inp.fixedConsistency >= inp.consistencyThreshold;
  const projectionSufficient = inp.surrogate <= inp.surrogateCeiling;
  return {
    exit: metricConverged && consistencyHeld && projectionSufficient,
    metricConverged,
    consistencyHeld,
    projectionSufficient,
  };
}

// ---------------------------------------------------------------------------
// §3  Extended trace tuple  τ⁺ = {(t, s_t, Δ_t, y_t, C_t, m_t, Ê_π,t, C^active, C^elim)}  (Eq. 14)
// ---------------------------------------------------------------------------

export interface ExtendedTraceEntry<S, O> {
  t: number;
  state: S;
  delta: number;
  output: O | undefined;
  /** C_t — corrected cross-step consistency at this step (non-self). */
  consistency: number | undefined;
  /** m_t — free-form per-step metadata. */
  meta?: Record<string, unknown>;
  /** Ê_π,t — surrogate audit bundle at this step. */
  surrogate?: SurrogateAudit;
  /** Constraints ACTIVE at this step (enables counterfactual audit, §7.4). */
  constraintsActive?: string[];
  /** Constraints ELIMINATED at this step. */
  constraintsEliminated?: string[];
}

export type ExtendedTrace<S, O> = ExtendedTraceEntry<S, O>[];

// ---------------------------------------------------------------------------
// §4  Falsifiers F10 (consistency tautology) and F11 (false arrest)
// ---------------------------------------------------------------------------

/** F10 — the consistency-tautology guard (critique §4.2 / falsifier F10).
 *  A `consistent` exit MUST come from comparing the current output against a
 *  DIFFERENT reference (a prior step or a prospective candidate), never itself.
 *  This throws if a self-comparison is detected, turning the silent tautology
 *  into a hard, test-catchable fault. Reference identity by value or by ===. */
export function assertNotSelfComparison<O>(
  current: O,
  reference: O,
  ctx = 'consistent exit',
): void {
  const sameRef = Object.is(current, reference);
  let sameVal = false;
  try {
    sameVal = JSON.stringify(current) === JSON.stringify(reference) && current !== undefined;
  } catch {
    sameVal = false;
  }
  if (sameRef || sameVal) {
    throw new Error(
      `[F10] Consistency self-comparison detected for ${ctx}: the current output ` +
      `was compared against itself, so the score is 1.0 by the law of identity ` +
      `and carries no governance weight. Compare against a prior step or a ` +
      `prospective final candidate instead (critique §4.2).`,
    );
  }
}

/** F10 ledger check over a recorded run: returns true (FALSIFIED) if a
 *  `consistent` exit reports a perfect score with no distinct reference — the
 *  signature of the self-comparison tautology. */
export function detectConsistencyTautology(run: {
  exitReason?: string;
  safeExitConsistencyScore?: number;
  comparedAgainstDistinctReference?: boolean;
}): boolean {
  if (run.exitReason !== 'consistent') return false;
  const perfect = (run.safeExitConsistencyScore ?? 0) >= 1;
  const distinct = run.comparedAgainstDistinctReference === true;
  return perfect && !distinct;
}

/** F11 — false-arrest perturbation test (critique §6.3 / §10 F11). Given a
 *  converged output and a perturbation harness, re-run from perturbed inputs and
 *  measure output STABILITY. A converged run whose output is fragile under small
 *  perturbations is a candidate false arrest (stabilized on an insufficient
 *  projection). Returns the fragility rate in [0,1]; high = likely false arrest. */
export interface PerturbationProbe<O> {
  /** Produce the output after perturbing the input by magnitude `eps`. */
  rerunPerturbed: (eps: number) => Promise<O> | O;
  /** Agreement scorer in [0,1] between two outputs (1 = identical decision). */
  agreement: (a: O, b: O) => number;
}

export interface FalseArrestResult {
  /** Mean disagreement across perturbation samples in [0,1]. Higher = fragile. */
  fragility: number;
  /** True if fragility exceeds the threshold ⇒ flagged as candidate false arrest. */
  flagged: boolean;
  samples: number;
}

export async function falseArrestProbe<O>(
  convergedOutput: O,
  probe: PerturbationProbe<O>,
  opts: { epsilons?: number[]; threshold?: number } = {},
): Promise<FalseArrestResult> {
  const epsilons = opts.epsilons ?? [0.01, 0.02, 0.05];
  const threshold = opts.threshold ?? 0.2;
  let disagreementSum = 0;
  let n = 0;
  for (const eps of epsilons) {
    const perturbed = await probe.rerunPerturbed(eps);
    const agree = clamp01(probe.agreement(convergedOutput, perturbed));
    disagreementSum += 1 - agree;
    n++;
  }
  const fragility = n > 0 ? clamp01(disagreementSum / n) : 0;
  return { fragility, flagged: fragility > threshold, samples: n };
}
