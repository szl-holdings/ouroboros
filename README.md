# @szl-holdings/ouroboros

  > Bounded loops with measurable convergence as a system primitive — now with v6 ecosystem layer and government readiness module.

  [![Tests](https://img.shields.io/badge/tests-133%2F133-2da44e?style=flat-square)](./packages/ouroboros)
  [![v6 contract](https://img.shields.io/badge/contract-v6.0.0-2b6cb0?style=flat-square)](https://github.com/szl-holdings/ouroboros-thesis/blob/main/a11oy-ultimate-replit-payload.v6.json)
  [![NYSTEC](https://img.shields.io/badge/NYSTEC%20audit-2026--04--30-805ad5?style=flat-square)](./docs/audit/szl-government-readiness.md)
  [![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)

  This package implements the **Ouroboros runtime** described in [`szl-holdings/ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis). It generalizes the loop-language work of *Ouro LoopLM* (arXiv:2510.25741) from the model layer to the **system layer** — agent control planes, data-sync engines, security response loops.

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

  ### Government readiness (NYSTEC pre-briefing — 2026-04-30)

  | Symbol | Responsibility |
  |---|---|
  | `PLATFORM_READINESS` | A11oy=72, Sentra=68, Amaru=65; per-platform strengths + gaps |
  | `NIST_RMF_ALIGNMENT` | 4-function × 3-platform coverage matrix |
  | `DOD_TENETS` | 5 Responsible AI tenets (Equitable flagged as gap) |
  | `GSAR_552_239_7001_READINESS` | 10 procurement requirements (5 covered, 5 documented gaps) |
  | `RECOMMENDED_NAICS_CODES` | 5 NAICS codes for SZL Consulting LTD |
  | `SAM_GOV_REGISTRATION_STEPS` | 5-step SAM.gov registration sequence |
  | `PRE_MEETING_ACTION_ITEMS` | 16 action items across 3 groups (critical / for-meeting / 30-day) |
  | `COMPETITIVE_POSITIONING_STATEMENT` | Pinned positioning text |
  | `GOV_READINESS_MANIFEST` | Top-level scorecard summary |

  Source of truth: [`docs/audit/szl-government-readiness.md`](./docs/audit/szl-government-readiness.md).

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

  `v6.0.0` — Used in production by all seven products in the [SZL Holdings](https://github.com/szl-holdings) portfolio: Amaru (`PRF_DATA_SYNC`), Sentra (`PRF_SECURITY_ACTIONS`), and A11oy / Counsel / Terra / Vessels / Carlota Jo (`PRF_SYSTEM_CLAIMS`).

  ## Tests

  ```bash
  pnpm install
  pnpm exec vitest run --no-coverage
  ```

  **133/133 passing** — covers proof-route resolver, risk-tier gate, almanac cycle advancer, v6 services/halts/routing, permission matrix (deny-by-default pinned), sandbox policy (`class` wire-format pinned), agent-registry validation, and 28 pinning tests for every cardinal fact in the government readiness audit.

  ---

  © 2026 SZL Holdings. See [LICENSE](./LICENSE).
  