# @szl-holdings/ouroboros

  > Bounded loops with measurable convergence as a system primitive — now with v6 ecosystem layer and government readiness module.

  [![Tests](https://img.shields.io/badge/tests-150%2F150-2da44e?style=flat-square)](./packages/ouroboros)
  [![v6 contract](https://img.shields.io/badge/contract-v6.1.0-2b6cb0?style=flat-square)](https://github.com/szl-holdings/ouroboros-thesis/blob/main/a11oy-ultimate-replit-payload.v6.json)
  [![Paper v3](https://img.shields.io/badge/paper-v3.0.0%20Lutar%20Invariant-c4356b?style=flat-square)](https://github.com/szl-holdings/ouroboros-thesis/tree/main/papers/v3)
  [![Zenodo v3](https://zenodo.org/badge/DOI/10.5281/zenodo.19951520.svg)](https://doi.org/10.5281/zenodo.19951520)
  [![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)

  This package implements the **Ouroboros runtime** described in [`szl-holdings/ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis), including the **Lutar Invariant Λ** — a closed-form scalar in [0, 1] that aggregates nine independent runtime-trust axes (Cleanliness, Horizon, Resonance, Frustum, Geometry, Invariance, Moral, Being, Soul) into a single auditable number. See [v3 paper](https://doi.org/10.5281/zenodo.19951520) for the formal derivation. It generalizes the loop-language work of *Ouro LoopLM* (arXiv:2510.25741) from the model layer to the **system layer** — agent control planes, data-sync engines, security response loops.

  ## Modules

  ### Loop kernel (v1–v4 contracts)

  | Module | Responsibility |
  |---|---|
  | `loop-kernel` | `runLoop()` — the bounded reconciliation primitive |
  | `depth-allocator` | Entropy-aware adaptive depth allocation |
  | `consistency` | Cross-step consistency scoring (numeric, vector, set, string) |
  | `proof-route` | `resolveProofRoute()` — `PRF_SYSTEM_CLAIMS`, `PRF_SECURITY_ACTIONS`, `PRF_DATA_SYNC` |
  | `risk-tier` | `evaluateRiskTier()` — R1 → R4 escalation gate |
  | `almanac` | `advanceAlmanac()` / `rebuildAlmanac()` — bounded periodic coordination |
  | `react` | `<OuroborosTrace>`, `<LoopGlyph>` — trace visualizations |

  ### v6 ecosystem layer (`a11oy_ultimate_replit_payload` v6.0.0)

  | Module | Responsibility |
  |---|---|
  | `v6-payload/services` | `SHARED_RUNTIME_SERVICES_V6` — 16 shared runtime services |
  | `v6-payload/halts` | 10 halt conditions (3 new in v6: `primary_source_required_but_unavailable`, `permission_denied`, `sandbox_policy_violation`) |
  | `v6-payload/routing` | 11-rule extended task routing (adds `regulated_monitoring`, `record_reconciliation`, `filings`, `regulatory`, `government_data`) |
  | `v6-payload/permissions` | `TOOL_PERMISSION_MATRIX` + `checkToolPermission()` — R3-mutating-needs-approval, R4-read-only-until-approved, deny-by-default |
  | `v6-payload/sandbox` | 3 execution classes; emits `class` field per canonical contract |
  | `v6-payload/agent-registry` | 8-field required-field schema + `validateAgentRegistryEntry()` |
  | `v6-payload/secrets-broker` | 4 managed secrets specification |

  ### Government readiness module

  | Symbol | Responsibility |
  |---|---|
  | `PLATFORM_READINESS` | Per-platform strengths + gaps schema |
  | `NIST_RMF_ALIGNMENT` | NIST RMF function × platform coverage matrix schema |
  | `DOD_TENETS` | Responsible AI tenets schema |
  | `GSAR_552_239_7001_READINESS` | Procurement requirements coverage schema |
  | `RECOMMENDED_NAICS_CODES` | NAICS code list |
  | `SAM_GOV_REGISTRATION_STEPS` | SAM.gov registration step list |
  | `PRE_MEETING_ACTION_ITEMS` | Action item schema |
  | `GOV_READINESS_MANIFEST` | Top-level scorecard summary schema |

  ## Operational contract

  The package implements the **v6 operational contract** defined in the thesis repository — see [`a11oy-ultimate-replit-payload.v6.json`](https://github.com/szl-holdings/ouroboros-thesis/blob/main/a11oy-ultimate-replit-payload.v6.json) for the canonical JSON. The decision-receipts, validators, and replay-hash subsystems live in the companion package [`@workspace/codex-kernel`](https://github.com/szl-holdings/szl-holdings-platform/tree/master/packages/codex-kernel).

  ## Live API surfaces

  When mounted via `@workspace/api-server`, the runtime exposes auth-gated REST endpoints:

  ```
  /api/ouroboros/v6/{manifest,services,halts,routing,permissions,sandbox,agent-registry/schema}
  /api/ouroboros/v6/{permissions/check,agent-registry/check}    (POST)
  /api/ouroboros/gov-readiness/{manifest,platforms,platforms/:id,gaps,nist,dod,gsar,
                                sam-registration,action-items,positioning}
  ```

  All endpoints return `401` unauthenticated by default.

  ## Status

    `v6.1.0` — Adds the **EntropyDepthAllocator** (`packages/codex-kernel/src/depth-allocator.ts` in the platform monorepo, exported as `decideDepth()`) per Ouroboros Thesis v3 §3.2. Pure-function controller over Δ-magnitude and validator entropy with verdicts `continue` / `early_exit_converged` / `early_exit_entropy` / `extend`. Opt-in via `loop_policy.adaptive_depth.enabled = true`; with the flag off, runs are bit-identical to v6.0.0.

  ## Tests

  ```bash
  pnpm install
  pnpm exec vitest run --no-coverage
  ```

  **150/150 passing** (TypeScript / vitest) — covers the runtime contract, government readiness module, v6 services/halts/routing, permission matrix, sandbox policy, agent-registry validation, and the v4 runtime contract. The depth allocator is exercised inside the v4 runtime-contract suite; loop-kernel, types, consistency, and risk-tier ship as supporting modules referenced by the contract tests.

  ---

  © 2026 SZL Holdings. See [LICENSE](./LICENSE).
  