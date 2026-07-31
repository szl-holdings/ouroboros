// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Tests: ouroboros/lambda-gate HTTP request validation
// Doctrine V6 preflight: ✓

import { type AddressInfo } from "node:net";
import { beforeEach, describe, expect, it, vi } from "vitest";

const gateMocks = vi.hoisted(() => ({
  allReceipts: vi.fn(),
  gateTransit: vi.fn(),
  getReceipt: vi.fn(),
  verifyReceipt: vi.fn(),
}));

vi.mock("./gate.js", () => gateMocks);

import { createServer, parseVerifyHash } from "./server.js";

async function withServer<T>(run: (origin: string) => Promise<T>): Promise<T> {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;

  try {
    return await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

describe("parseVerifyHash", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("routes a valid verify request to receipt replay", async () => {
    const hash = "b".repeat(64);
    gateMocks.verifyReceipt.mockReturnValue({
      found: false,
      pass: false,
      lambda: 0,
      reasons: ["not found"],
    });

    const response = await withServer((origin) => fetch(`${origin}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash }),
    }));

    expect(response.status).toBe(200);
    expect(gateMocks.verifyReceipt).toHaveBeenCalledOnce();
    expect(gateMocks.verifyReceipt).toHaveBeenCalledWith(hash);
  });

  it("rejects malformed verify requests before receipt replay", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await withServer((origin) => fetch(`${origin}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: "../receipt" }),
      }));

      expect(response.status).toBe(400);
      expect(gateMocks.verifyReceipt).not.toHaveBeenCalled();
    } finally {
      errorLog.mockRestore();
    }
  });
});
