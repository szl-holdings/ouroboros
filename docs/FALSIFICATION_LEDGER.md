<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SZL Holdings — Ouroboros runtime falsification ledger addendum -->

# Ouroboros Falsification Ledger — F10 & F11 (runnable addendum)

> **Scope.** The original nine-item falsification ledger (F1–F9) is defined in the
> empirical companion paper *The Loop Is the Product* (Lutar 2026b §3.7) and is
> the canonical list. This file is an **additive, runnable addendum** that adds
> two falsifiers — **F10** and **F11** — proposed by an external review and wired
> to real code checks in this repo. It does not restate or alter F1–F9.

> **Provenance.** Both falsifiers are taken from Flyxion, *"Convergence Without
> Ground: A Critical Examination of the Ouroboros Thesis and Its Integration with
> RSVP, CLIO, and MEM|8"* (2026-06-05), §10 (F10/F11) and §4.2 / §6.3. We treat
> the critique as a good-faith, technically correct contribution and adopt its two
> highest-priority falsifiers verbatim in intent.

---

## F10 — Consistency tautology (self-comparison)

**Claim under test.** The `consistent` exit path is a meaningful governance signal
*distinct* from `converged`.

**Falsifier (critique §10 F10).** Any run that exits via the `consistent` path
with the default scorer and a finite `earlyExitConsistency` threshold reports
`safeExitConsistencyScore = 1.0` **regardless of the relationship between
consecutive outputs** — because the online check was implemented as
`consistency(output, output)` (a self-comparison that is 1.0 by the law of
identity). If observed, the `consistent` signal is vacuous.

**Status in this repo: CLOSED / guarded.**
- The live kernel (`packages/ouroboros/src/loop-kernel.ts`) compares the current
  output against the **previous** step's output online
  (`consistency(prevOutput, output)`, guarded by `prevOutput !== undefined && i > 0`)
  and retroactively against the **final** output (`consistency(s.output, finalOutput)`).
  Neither is a self-comparison.
- **Runnable check:** `detectConsistencyTautology(run)` in
  `packages/ouroboros/src/clio-audit.ts` returns `true` (FALSIFIED) for any
  recorded run with `exitReason='consistent'`, `safeExitConsistencyScore≥1`, and
  `comparedAgainstDistinctReference=false`.
- **Runtime guard:** `assertNotSelfComparison(current, reference)` throws `[F10]`
  if a `consistent` exit is ever computed from a self-comparison (by `Object.is`
  or deep value-equality). Covered by 6 passing tests.

## F11 — False arrest (convergence is not correctness)

**Claim under test.** `exitReason = converged` indicates the output is at a
genuine, robust attractor of the task — not merely a point where the operational
delta fell below threshold on an insufficient projection.

**Falsifier (critique §6.3 / §10 F11).** Among `converged` runs, the rate of
outputs that are **fragile under small input perturbations** varies systematically
across domains; fragile-but-`converged` outputs are *false arrests* — the loop
paused on a projection that hid task-relevant structure. Output-space delta
metrics alone cannot predict this.

**Status in this repo: DETECTOR SHIPPED (evidence, not proof).**
- **Runnable check:** `falseArrestProbe(convergedOutput, probe, {epsilons, threshold})`
  in `clio-audit.ts` re-runs from perturbed inputs and returns a `fragility` rate
  in [0,1]; `flagged=true` when fragility exceeds the threshold. Covered by tests.
- This is a **detector**, not a guarantee. Per the critique's Eq. 19, a clean exit
  plus a bounded surrogate audit `Ê_π` provides *evidence* of admissible
  stabilization, never *proof*. `converged` remains a measurement, not a theorem.

---

## Supporting repair: CLIO surrogate projection-error audit (optional, off by default)

`clio-audit.ts` also implements the critique's surrogate audit bundle
`Ê_π = αR + βU + γK + δG + λH` (Eq. 12), the enriched exit predicate
`Δ ≤ ε ∧ C_fixed ≥ τ ∧ Ê_π ≤ η` (Eq. 13), and the extended trace tuple (Eq. 14).
Projection-disagreement `U` (agreement across independent symbolic / NL / schema
/ embedding views of the same state) is the most informative, least-gameable
surrogate and is computable from observable artifacts without latent-space access.

**Honest cost caveat (critique §9.3).** Computing multiple independent state
representations per step can cost 5–10× the base loop. The surrogate audit is an
**optional high-trust configuration, OFF by default**; whether it shifts the
(avg-steps, avg-quality) Pareto frontier favorably is an open empirical question
to be measured by adding an audit-enabled arm to the loop-budget experiment.

## Honest naming repair (critique §4.1)

The depth allocator was renamed from "EntropyDepthAllocator" to a
**trajectory-phase depth heuristic**: it computes no probability distribution and
no log-space sum (`H = −Σ pᵢ log pᵢ` is never evaluated). Its Markov-window
assumption and high-stakes saturation are now disclosed as known limitations in
`packages/ouroboros/src/depth-allocator.ts`.

---

*All checks here are real code in `packages/ouroboros/src/clio-audit.ts`,
strict-`tsc` clean, 18/18 vitest tests green. Doctrine v11 LOCKED (749/14/163)
unchanged. Λ remains Conjecture 1.*
