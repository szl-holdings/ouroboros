import { describe, it, expect } from "vitest";
import {
  babylonianSqrt,
  babylonianLipschitzBound,
  inInvariantInterval,
} from "./babylonian-iteration.js";

describe("R3-G1 — Babylonian (Heron) sqrt iteration", () => {
  it("recovers sqrt(2) to 1e-10 within 30 iterations [YBC 7289 invariant]", () => {
    const r = babylonianSqrt(2);
    expect(r.converged).toBe(true);
    expect(r.iterations).toBeLessThanOrEqual(30);
    expect(Math.abs(r.value - Math.SQRT2)).toBeLessThan(1e-10);
  });

  it("converges for random S in [0.01, 1e6] in ≤30 iterations at 1e-10", () => {
    const rng = mulberry32(0xC0FFEE);
    for (let i = 0; i < 200; i++) {
      const S = 0.01 + rng() * (1e6 - 0.01);
      const r = babylonianSqrt(S, { tol: 1e-10, maxIter: 64 });
      expect(r.converged).toBe(true);
      expect(r.iterations).toBeLessThanOrEqual(30);
      expect(Math.abs(r.value - Math.sqrt(S))).toBeLessThan(1e-7);
    }
  });

  it("handles S=0 correctly (no iteration needed)", () => {
    const r = babylonianSqrt(0);
    expect(r.value).toBe(0);
    expect(r.iterations).toBe(0);
  });

  it("Lipschitz constant claim 1/2 holds on post-step invariant half-line", () => {
    const S = 2;
    const sqrtS = Math.sqrt(S);
    const L = babylonianLipschitzBound();
    expect(L).toBe(0.5);
    // sample 50 points in I = [sqrt(S), 10*sqrt(S)] and verify |T'(x)| <= L
    for (let k = 0; k < 50; k++) {
      const t = k / 49;
      const x = sqrtS + t * (10 * sqrtS - sqrtS);
      const Tprime = Math.abs((1 - S / (x * x)) / 2);
      expect(Tprime).toBeLessThanOrEqual(L + 1e-12);
    }
  });

  it("inInvariantInterval recognises the post-step half-line [sqrt(S), ∞)", () => {
    const S = 2;
    const r = babylonianSqrt(S);
    expect(inInvariantInterval(r.value, S)).toBe(true);
    expect(inInvariantInterval(0.001, S)).toBe(false);
    expect(inInvariantInterval(100, S)).toBe(true); // 100 > sqrt(2)
  });

  it("rejects negative S", () => {
    expect(() => babylonianSqrt(-1)).toThrow(RangeError);
  });
});

// Deterministic PRNG for reproducible random tests.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
