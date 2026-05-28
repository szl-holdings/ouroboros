import { describe, it, expect } from "vitest";
import {
  transductionInvariant,
  encodeJsonReceipt,
  decodeJsonReceipt,
  jsonRoundTripPreservesId,
  type Receipt,
} from "./receipt-transduction.js";

describe("R2-G6 — receipt transduction invariant", () => {
  const samples: ReadonlyArray<Receipt<{ k: number }>> = [
    { contentId: "rcpt-001", body: { k: 1 } },
    { contentId: "rcpt-002", body: { k: 2 } },
    { contentId: "rcpt-empty", body: { k: 0 } },
  ];

  it("JSON encode/decode preserves contentId", () => {
    expect(jsonRoundTripPreservesId(samples)).toBe(true);
  });

  it("identity transduction trivially preserves contentId", () => {
    expect(transductionInvariant(samples, (r) => r, (e) => e)).toBe(true);
  });

  it("detects a faulty encoder that scrambles contentId", () => {
    const bad = transductionInvariant(
      samples,
      (r) => ({ ...r, contentId: r.contentId + "-tampered" }),
      (e) => e,
    );
    expect(bad).toBe(false);
  });

  it("decode throws on missing contentId", () => {
    expect(() => decodeJsonReceipt(JSON.stringify({ body: {} }))).toThrow(TypeError);
  });

  it("encode/decode preserve full body shape, not only id", () => {
    const r = samples[0];
    const round = decodeJsonReceipt<{ k: number }>(encodeJsonReceipt(r));
    expect(round.contentId).toBe(r.contentId);
    expect(round.body).toEqual(r.body);
  });

  it("empty sample set vacuously satisfies the invariant", () => {
    expect(jsonRoundTripPreservesId([])).toBe(true);
  });
});
