/**
 * clio-audit.test.ts — real tests for the CLIO projection-sufficiency audit.
 * Every test asserts a substantive property of the critique's repairs:
 * F10 self-comparison guard, F11 false-arrest probe, surrogate bundle bounds,
 * projection disagreement, and the enriched exit predicate.
 */
import { describe, it, expect } from 'vitest';
import {
  computeSurrogateAudit,
  projectionDisagreement,
  enrichedExit,
  assertNotSelfComparison,
  detectConsistencyTautology,
  falseArrestProbe,
  DEFAULT_SURROGATE_WEIGHTS,
} from './clio-audit.js';

describe('F10 — consistency self-comparison guard', () => {
  it('throws when current output is compared to itself (same reference)', () => {
    const o = { plan: ['a', 'b'] };
    expect(() => assertNotSelfComparison(o, o)).toThrow(/F10/);
  });

  it('throws when current is value-equal to the reference (deep clone)', () => {
    const a = { plan: ['a', 'b'] };
    const b = { plan: ['a', 'b'] };
    expect(() => assertNotSelfComparison(a, b)).toThrow(/self-comparison/);
  });

  it('does NOT throw when comparing genuinely different outputs', () => {
    const a = { plan: ['a', 'b'] };
    const b = { plan: ['a', 'c'] };
    expect(() => assertNotSelfComparison(a, b)).not.toThrow();
  });

  it('detectConsistencyTautology flags a perfect-score consistent exit with no distinct reference', () => {
    expect(detectConsistencyTautology({
      exitReason: 'consistent',
      safeExitConsistencyScore: 1.0,
      comparedAgainstDistinctReference: false,
    })).toBe(true);
  });

  it('detectConsistencyTautology does NOT flag a consistent exit with a distinct reference', () => {
    expect(detectConsistencyTautology({
      exitReason: 'consistent',
      safeExitConsistencyScore: 0.97,
      comparedAgainstDistinctReference: true,
    })).toBe(false);
  });

  it('detectConsistencyTautology ignores non-consistent exits', () => {
    expect(detectConsistencyTautology({
      exitReason: 'converged',
      safeExitConsistencyScore: 1.0,
      comparedAgainstDistinctReference: false,
    })).toBe(false);
  });
});

describe('§1 — surrogate audit bundle Ê_π (Eq. 12)', () => {
  it('returns 0 with no signals (honest absence, not fabricated error)', () => {
    const a = computeSurrogateAudit({});
    expect(a.value).toBe(0);
    expect(a.present).toEqual([]);
  });

  it('stays within [0,1] for arbitrary inputs', () => {
    const a = computeSurrogateAudit({
      residualUncertainty: 5, // out of range — must clamp
      constraintViolations: 100,
      goalInstability: -3,
      historyAnomaly: 0.4,
      views: { symbolic: 'x y z', summary: 'p q r' }, // total disagreement
    });
    expect(a.value).toBeGreaterThanOrEqual(0);
    expect(a.value).toBeLessThanOrEqual(1);
    expect(a.R).toBeLessThanOrEqual(1);
    expect(a.G).toBeGreaterThanOrEqual(0);
  });

  it('high disagreement + violations drives Ê_π up; agreement drives it down', () => {
    const bad = computeSurrogateAudit({
      views: { symbolic: 'alpha beta', summary: 'gamma delta' }, // disjoint
      constraintViolations: 4,
    });
    const good = computeSurrogateAudit({
      views: { symbolic: 'alpha beta gamma', summary: 'alpha beta gamma' }, // identical
      constraintViolations: 0,
    });
    expect(bad.value).toBeGreaterThan(good.value);
  });

  it('only present signals contribute to the weight mass', () => {
    const a = computeSurrogateAudit({ constraintViolations: 2 });
    expect(a.present).toEqual(['K']);
  });
});

describe('projection disagreement U_t', () => {
  it('is undefined with fewer than two comparable views', () => {
    expect(projectionDisagreement({ symbolic: 'only one view' })).toBeUndefined();
    expect(projectionDisagreement(undefined)).toBeUndefined();
  });
  it('is ~0 when views agree and ~1 when fully disjoint', () => {
    const agree = projectionDisagreement({ symbolic: 'a b c', summary: 'a b c' })!;
    const disjoint = projectionDisagreement({ symbolic: 'a b c', summary: 'x y z' })!;
    expect(agree).toBeLessThan(0.05);
    expect(disjoint).toBeGreaterThan(0.95);
  });
});

describe('§2 — enriched exit predicate (Eq. 13)', () => {
  const base = {
    delta: 0.0005, convergenceThreshold: 1e-3,
    fixedConsistency: 0.98, consistencyThreshold: 0.95,
    surrogate: 0.1, surrogateCeiling: 0.3,
  };
  it('exits only when all three conjuncts hold', () => {
    expect(enrichedExit(base).exit).toBe(true);
  });
  it('does NOT exit when surrogate projection error is too high (hidden structure)', () => {
    const r = enrichedExit({ ...base, surrogate: 0.5 });
    expect(r.exit).toBe(false);
    expect(r.projectionSufficient).toBe(false);
    expect(r.metricConverged).toBe(true); // stabilized, but not trustworthy
  });
  it('does NOT exit on stabilization alone when consistency fails', () => {
    expect(enrichedExit({ ...base, fixedConsistency: 0.5 }).exit).toBe(false);
  });
});

describe('F11 — false-arrest perturbation probe', () => {
  it('flags a fragile (false-arrest) output as high fragility', async () => {
    // converged output is "yes"; under perturbation it flips — fragile.
    const r = await falseArrestProbe('yes', {
      rerunPerturbed: (eps) => (eps >= 0.01 ? 'no' : 'yes'),
      agreement: (a, b) => (a === b ? 1 : 0),
    });
    expect(r.fragility).toBeGreaterThan(0.2);
    expect(r.flagged).toBe(true);
  });
  it('does NOT flag a stable output (genuine convergence)', async () => {
    const r = await falseArrestProbe('yes', {
      rerunPerturbed: () => 'yes',
      agreement: (a, b) => (a === b ? 1 : 0),
    });
    expect(r.fragility).toBe(0);
    expect(r.flagged).toBe(false);
  });
});

describe('weights', () => {
  it('default weights sum to 1', () => {
    const w = DEFAULT_SURROGATE_WEIGHTS;
    const sum = w.alpha + w.beta + w.gamma + w.delta + w.lambda;
    expect(Math.abs(sum - 1)).toBeLessThan(1e-9);
  });
});
