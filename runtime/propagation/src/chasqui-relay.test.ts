import { describe, it, expect } from "vitest";
import {
  totalLatency,
  relayChainBoundedLatency,
  uniformRelayChain,
} from "./chasqui-relay.js";

describe("R2-G5 — Qhapaq Ñan chasqui relay chain", () => {
  it("empty chain has zero latency and trivially satisfies the bound", () => {
    expect(totalLatency([])).toBe(0);
    expect(relayChainBoundedLatency([], 0)).toBe(true);
    expect(relayChainBoundedLatency([], 5)).toBe(true);
  });

  it("uniform 10-hop chain at 2.5 km/hop sums to 25 km", () => {
    const chain = uniformRelayChain(10, 2.5);
    expect(totalLatency(chain)).toBeCloseTo(25, 12);
    expect(relayChainBoundedLatency(chain, 2.5)).toBe(true);
  });

  it("bound fails when some hop exceeds cap", () => {
    const chain = [
      { id: "a", latency: 1 },
      { id: "b", latency: 7 }, // exceeds cap 2.5
      { id: "c", latency: 1 },
    ];
    expect(relayChainBoundedLatency(chain, 2.5)).toBe(false);
  });

  it("bound holds for non-uniform chain where each hop ≤ cap", () => {
    const chain = [
      { id: "a", latency: 1 },
      { id: "b", latency: 2.5 },
      { id: "c", latency: 0.7 },
    ];
    // sum 4.2; 3 hops · 2.5 = 7.5; 4.2 ≤ 7.5
    expect(relayChainBoundedLatency(chain, 2.5)).toBe(true);
  });

  it("rejects negative or non-finite cap and negative latencies", () => {
    const chain = [{ id: "a", latency: 1 }];
    expect(relayChainBoundedLatency(chain, -1)).toBe(false);
    expect(relayChainBoundedLatency(chain, Number.NaN)).toBe(false);
    const bad = [{ id: "a", latency: -2 }];
    expect(relayChainBoundedLatency(bad, 5)).toBe(false);
  });

  it("uniformRelayChain rejects non-integer or negative hops", () => {
    expect(() => uniformRelayChain(-1, 1)).toThrow(RangeError);
    expect(() => uniformRelayChain(2.5, 1)).toThrow(RangeError);
    expect(() => uniformRelayChain(2, -1)).toThrow(RangeError);
  });

  it("induction-style spot check: bound holds for chains length 0..50", () => {
    for (let n = 0; n <= 50; n++) {
      const chain = uniformRelayChain(n, 2.5);
      expect(relayChainBoundedLatency(chain, 2.5)).toBe(true);
      expect(totalLatency(chain)).toBeCloseTo(n * 2.5, 9);
    }
  });
});
