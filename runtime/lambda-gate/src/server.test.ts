// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Tests: ouroboros/lambda-gate HTTP request validation
// Doctrine V6 preflight: ✓

import { describe, expect, it, vi } from "vitest";

vi.mock("./gate.js", () => ({
  allReceipts: vi.fn(),
  gateTransit: vi.fn(),
  getReceipt: vi.fn(),
  verifyReceipt: vi.fn(),
}));

import { parseVerifyHash } from "./server.js";

describe("parseVerifyHash", () => {
  it("accepts a canonical SHA-256 receipt hash", () => {
    const hash = "a".repeat(64);

    expect(parseVerifyHash({ hash })).toBe(hash);
  });

  it.each([
    undefined,
    null,
    {},
    { hash: "" },
    { hash: "a".repeat(63) },
    { hash: "A".repeat(64) },
    { hash: "../receipt" },
    { hash: "a".repeat(64), unexpected: true },
  ])("rejects malformed request payload %#", (payload) => {
    expect(() => parseVerifyHash(payload)).toThrow();
  });
});
