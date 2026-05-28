# ouroboros-propagation

Relay-bounded propagation primitive in the Ouroboros runtime.

- **`chasqui-relay.ts`** — `RelayChain`, `totalLatency`, `relayChainBoundedLatency` (R2-G5).

Models Qhapaq Ñan chasqui relay chains (Inka road system, ~2.5 km/hop)
as a linear-additive latency bound used by the Ouroboros gateway for
receipt propagation budgets.

## Citations

- Hyslop, J. (1984). *The Inka Road System.* Academic Press.
  ISBN 978-0-12-363460-3.

## Lean obligation

- `lutar-lean/Lutar/Propagation/RelayChain.lean :: relay_chain_bounded_latency`

License: Apache-2.0.
