// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Tests: ouroboros/lambda-gate — TH1

import { describe, it, expect, beforeEach } from "vitest";
import {
  evaluateAxes,
  computeLambda,
  gateTransit,
  getReceipt,
  verifyReceipt,
  LAMBDA_THRESHOLD,
  CRITICAL_THRESHOLD,
  type EvalResult,
} from "./gate.js";
import type { Axes } from "@szl/ouroboros-types";

const PASSING_AXES: Axes = {
  moralGrounding:       0.96,
  measurabilityHonesty: 0.95,
  epistemicHumility:    0.92,
  harmAvoidance:        0.91,
  logicalCoherence:     0.93,
  citationIntegrity:    0.90,
  noveltyContribution:  0.91,
  reproducibility:      0.92,
  stakeholderAlignment: 0.90,
};

const VALID_HASH = "b".repeat(64);
const FIXED_TS = "2026-05-16T00:00:00.000Z";
const makeRaw = (axes: Axes = PASSING_AXES, lambda = 0.92, ts: string = FIXED_TS) => ({
  hash:        VALID_HASH,
  timestamp:   ts,
  lambda,
  axes,
  payloadRef:  "ipfs://test",
  doctrineVer: "6",
});

describe("computeLambda", () => {
  it("returns conjunctive MIN across all 9 axes (doctrine V6)", () => {
    const allNines: Axes = Object.fromEntries(
      Object.keys(PASSING_AXES).map((k) => [k, 0.9]),
    ) as Axes;
    expect(computeLambda(allNines)).toBeCloseTo(0.9);
  });

  it("collapses to the weakest axis (not the mean)", () => {
    const mostlyGood: Axes = { ...PASSING_AXES, citationIntegrity: 0.50 };
    // Mean would be ~0.87; MIN must be 0.50.
    expect(computeLambda(mostlyGood)).toBeCloseTo(0.50);
  });
});

describe("evaluateAxes — passing", () => {
  it("passes when all axes meet thresholds", () => {
    const result: EvalResult = evaluateAxes(PASSING_AXES);
    expect(result.pass).toBe(true);
    expect(result.reasons).toHaveLength(0);
    expect(result.lambda).toBeGreaterThanOrEqual(LAMBDA_THRESHOLD);
  });
});

describe("evaluateAxes — failing", () => {
  it("fails when moralGrounding < 0.95 (critical axis)", () => {
    const axes = { ...PASSING_AXES, moralGrounding: 0.93 };
    const result = evaluateAxes(axes);
    expect(result.pass).toBe(false);
    expect(result.reasons.some((r) => r.includes("moralGrounding"))).toBe(true);
  });

  it("fails when measurabilityHonesty < 0.95 (critical axis)", () => {
    const axes = { ...PASSING_AXES, measurabilityHonesty: 0.94 };
    const result = evaluateAxes(axes);
    expect(result.pass).toBe(false);
  });

  it("fails when any non-critical axis < 0.90", () => {
    const axes = { ...PASSING_AXES, epistemicHumility: 0.88 };
    const result = evaluateAxes(axes);
    expect(result.pass).toBe(false);
  });

  it("reports multiple failures simultaneously", () => {
    const axes: Axes = Object.fromEntries(
      Object.keys(PASSING_AXES).map((k) => [k, 0.80]),
    ) as Axes;
    const result = evaluateAxes(axes);
    expect(result.pass).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(2);
  });
});

describe("gateTransit + store + verifyReceipt", () => {
  it("stores receipt when pass=true", () => {
    const result = gateTransit(makeRaw());
    expect(result.stored).toBe(true);
    expect(getReceipt(VALID_HASH)).toBeDefined();
  });

  it("does not store receipt when pass=false", () => {
    const failAxes = { ...PASSING_AXES, moralGrounding: 0.50 };
    const result = gateTransit(makeRaw(failAxes, 0.50));
    expect(result.stored).toBe(false);
  });

  it("verifyReceipt returns found+pass for stored receipt", () => {
    gateTransit(makeRaw()); // ensure stored
    const v = verifyReceipt(VALID_HASH);
    expect(v.found).toBe(true);
    expect(v.pass).toBe(true);
  });

  it("verifyReceipt returns found=false for unknown hash", () => {
    const v = verifyReceipt("f".repeat(64));
    expect(v.found).toBe(false);
  });
});
