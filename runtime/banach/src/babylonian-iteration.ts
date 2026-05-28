// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Module: ouroboros/banach   Thesis: TH16 (Banach lineage), ties TH12 ΛGateLID
// Doctrine V6 preflight: OK (no forbidden patterns)
//
// R3-G1 — YBC 7289 / Babylonian (Heron) iteration as a Banach contraction.
// The recurrence  x_{n+1} = (x_n + S/x_n) / 2  converges to sqrt(S). By AM-GM,
// after one step from any x_0 > 0 we have x_1 ≥ sqrt(S), and on the half-line
// I = [sqrt(S), ∞)  the map T(x) = (x + S/x)/2  is a Banach contraction with
// Lipschitz constant ≤ 1/2 (since T'(x) = (1 - S/x^2)/2 ∈ [0, 1/2) there).
// This is the same mathematical shape as the rollback step in the Λ-gate
// fixed-point loop (lutar-lean/Lutar/DPOFeasibility.lean TH12). The cuneiform
// tablet YBC 7289 (Yale Babylonian Collection) gives sqrt(2) to 5 sexagesimal
// digits via this exact recurrence.
//
// Citations:
//   - Neugebauer, O. (1957). The Exact Sciences in Antiquity (2nd ed.). Dover.
//     Ch.II §13–14 (YBC 7289 reading).
//   - Friberg, J. (2007). A Remarkable Collection of Babylonian Mathematical
//     Texts. Springer. ISBN 978-0-387-48977-3.
//   - Hoyrup, J. (2002). Lengths, Widths, Surfaces. Springer.
//   - YBC 7289 catalog entry: Yale Peabody Museum, Babylonian Collection.

export interface BabylonianResult {
  readonly value: number;       // approximation of sqrt(S)
  readonly iterations: number;  // count of recurrence steps used
  readonly residual: number;    // | x^2 - S |
  readonly converged: boolean;  // residual < tol
}

export interface BabylonianOptions {
  readonly tol?: number;        // default 1e-10
  readonly maxIter?: number;    // default 64
  readonly initial?: number;    // default S/2 if S>=1 else (1+S)/2
}

/**
 * Babylonian iteration for sqrt(S).
 *
 *   x_{n+1} = (x_n + S / x_n) / 2
 *
 * For S > 0 the map T(x) = (x + S/x)/2 has fixed point sqrt(S). After one
 * step from any x_0 > 0, AM-GM gives x_1 ≥ sqrt(S); on the half-line
 * I = [sqrt(S), ∞) the derivative T'(x) = (1 - S/x^2)/2 lies in [0, 1/2),
 * so T is a Banach contraction with constant ≤ 1/2 there.
 *
 * Returns { value, iterations, residual, converged }.
 *
 * Throws if S < 0 (sqrt of negative is not a real number) or if initial < 0.
 */
export function babylonianSqrt(S: number, opts: BabylonianOptions = {}): BabylonianResult {
  if (!Number.isFinite(S) || S < 0) {
    throw new RangeError(`babylonianSqrt: S must be a finite non-negative real, got ${S}`);
  }
  if (S === 0) {
    return { value: 0, iterations: 0, residual: 0, converged: true };
  }

  const tol = opts.tol ?? 1e-10;
  const maxIter = opts.maxIter ?? 64;
  // Default initial: a power-of-two upper bound on sqrt(S). This puts x_0
  // within a factor 2 of sqrt(S), so the iteration enters the invariant
  // interval [sqrt(S), ∞) after one step and converges in O(log log(1/tol)).
  let x = opts.initial ?? defaultInitial(S);
  if (!Number.isFinite(x) || x <= 0) {
    throw new RangeError(`babylonianSqrt: initial must be positive finite, got ${x}`);
  }

  let iterations = 0;
  // Relative residual: |x^2 - S| / max(1, S). Stable across orders of magnitude.
  const denom = Math.max(1, S);
  let residual = Math.abs(x * x - S) / denom;

  while (residual > tol && iterations < maxIter) {
    x = (x + S / x) / 2;
    iterations += 1;
    residual = Math.abs(x * x - S) / denom;
  }

  return {
    value: x,
    iterations,
    residual,
    converged: residual <= tol,
  };
}

/**
 * Per-step Lipschitz bound for the Babylonian map on the post-step invariant
 * half-line I = [sqrt(S), ∞). Returns the analytic upper bound 1/2; the
 * lutar-lean obligation `babylonian_lipschitz_le_half` proves
 * |T'(x)| < 1/2 for x ∈ I.
 */
export function babylonianLipschitzBound(): number {
  return 0.5;
}

/**
 * Witness that a given x lies in the post-step invariant half-line
 * I = [sqrt(S), ∞). AM-GM guarantees every Babylonian iterate after step 1
 * lands in I.
 */
export function inInvariantInterval(x: number, S: number): boolean {
  if (S <= 0 || x <= 0 || !Number.isFinite(x) || !Number.isFinite(S)) return false;
  const r = Math.sqrt(S);
  return x >= r - 1e-12;
}

/** Power-of-two upper bound on sqrt(S), giving x_0 within a factor 2. */
function defaultInitial(S: number): number {
  if (S <= 0) return 1;
  // 2^ceil(log2(S)/2) bounds sqrt(S) above by < factor 2.
  const k = Math.ceil(Math.log2(S) / 2);
  return Math.pow(2, k);
}
