// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Module: ouroboros/propagation   Thesis: TH16 relay-bounded latency
// Doctrine V6 preflight: OK (no forbidden patterns)
//
// R2-G5 — Qhapaq Ñan chasqui relay chain. The Inka highway system carried
// messages by way-stations (tampu) approximately 2.5 km apart, each
// occupied by a runner (chasqui). End-to-end latency is *additive in hop
// count* with a bounded per-hop cost. We mirror this as the latency budget
// for receipt propagation across the Ouroboros gateway, with the Lean
// obligation `relay_chain_bounded_latency` proving the linear bound by list
// induction.
//
// Citations:
//   - Hyslop, J. (1984). The Inka Road System. Academic Press.
//     ISBN 978-0-12-363460-3. Chapters on tampu spacing and chasqui relay
//     organisation.

/** A single relay hop with a per-hop latency budget (any non-negative unit). */
export interface RelayHop {
  readonly id: string;
  readonly latency: number;
}

/** A list-shaped relay chain, ordered source → destination. */
export type RelayChain = ReadonlyArray<RelayHop>;

/**
 * Total chain latency = sum of hop latencies.
 *
 * The Lean lemma `relay_chain_bounded_latency` shows that if every hop
 * satisfies `hop.latency ≤ cap`, then totalLatency(chain) ≤ chain.length * cap.
 */
export function totalLatency(chain: RelayChain): number {
  let acc = 0;
  for (const hop of chain) acc += hop.latency;
  return acc;
}

/**
 * Verifies the linear latency bound used by lutar-lean
 * `relay_chain_bounded_latency`.
 *
 *   ∀ chain. (∀ h ∈ chain. h.latency ≤ cap) → totalLatency(chain) ≤ |chain| · cap
 *
 * Returns true iff the bound holds for the supplied (chain, cap).
 */
export function relayChainBoundedLatency(chain: RelayChain, cap: number): boolean {
  if (!Number.isFinite(cap) || cap < 0) return false;
  for (const hop of chain) {
    if (!Number.isFinite(hop.latency) || hop.latency < 0) return false;
    if (hop.latency > cap) return false;
  }
  return totalLatency(chain) <= chain.length * cap + 1e-12;
}

/**
 * Construct an N-hop chain with per-hop latency `perHop`. Convenience for
 * building synthetic relay test fixtures matching Qhapaq Ñan's regular
 * tampu spacing (Hyslop 1984 reports ~2.5 km hops).
 */
export function uniformRelayChain(hops: number, perHop: number): RelayChain {
  if (!Number.isInteger(hops) || hops < 0) {
    throw new RangeError(`uniformRelayChain: hops must be non-negative integer, got ${hops}`);
  }
  if (!Number.isFinite(perHop) || perHop < 0) {
    throw new RangeError(`uniformRelayChain: perHop must be non-negative finite, got ${perHop}`);
  }
  const chain: RelayHop[] = [];
  for (let i = 0; i < hops; i++) chain.push({ id: `tampu-${i}`, latency: perHop });
  return chain;
}
