# @szl-holdings/ouroboros

  > Bounded loops with measurable convergence as a system primitive.

  This package implements the **Ouroboros runtime** described in [`szl-holdings/ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis). It generalizes the loop-language work of *Ouro LoopLM* (arXiv:2510.25741) from the model layer to the **system layer** — agent control planes, data-sync engines, security response loops.

  ## Modules

  | Module | Responsibility |
  | --- | --- |
  | `loop-kernel` | `runLoop()` — the bounded reconciliation primitive |
  | `depth-allocator` | Entropy-aware adaptive depth allocation |
  | `consistency` | Cross-step consistency scoring (numeric, vector, set, string) |
  | `proof-route` | `resolveProofRoute()` — `PRF_SYSTEM_CLAIMS`, `PRF_SECURITY_ACTIONS`, `PRF_DATA_SYNC` |
  | `risk-tier` | `evaluateRiskTier()` — R1 → R4 escalation gate |
  | `almanac` | `advanceAlmanac()` / `rebuildAlmanac()` — bounded periodic coordination |
  | `react` | `<OuroborosTrace>`, `<LoopGlyph>` — trace visualizations |

  ## Operational contract

  The package implements the v2 operational contract defined in the thesis repository — see [`ouroboros-runtime-contract.v2.json`](https://github.com/szl-holdings/ouroboros-thesis/blob/main/ouroboros-runtime-contract.v2.json). The decision-receipts, validators, and replay-hash subsystems live in the companion package [`@workspace/codex-kernel`](https://github.com/szl-holdings/szl-holdings-platform/tree/main/packages/codex-kernel) inside the platform monorepo.

  ## Status

  `v1.0.0` — Series-A. Used in production by all seven products in the [SZL Holdings](https://github.com/szl-holdings) portfolio: Amaru (`PRF_DATA_SYNC`), Sentra (`PRF_SECURITY_ACTIONS`), and A11oy / Counsel / Terra / Vessels / Carlota Jo (`PRF_SYSTEM_CLAIMS`).

  ## Tests

  ```bash
  pnpm install
  pnpm test
  ```

  Includes unit coverage for the proof-route resolver, the risk-tier gate, and the almanac cycle advancer (the three pieces called out as `needs_code` in the v2 contract; all now `implemented`).

  ---

  © 2026 SZL Holdings. See [LICENSE](./LICENSE).
  