# @szl-holdings/ouroboros

  > Bounded loops with measurable convergence as a system primitive — the v6 ecosystem layer (services, halts, routing, permissions, sandbox, agent registry) plus a structured government-procurement readiness module.

  [![Tests](https://img.shields.io/badge/tests-172%2F172-2da44e?style=flat-square)](./packages/ouroboros)
  [![Release](https://img.shields.io/badge/release-v6.2.0-2b6cb0?style=flat-square)](https://github.com/szl-holdings/ouroboros/releases/tag/v6.2.0)
  [![DOI v3 (current)](https://img.shields.io/badge/DOI%20v3-10.5281%2Fzenodo.19983066-1f78b4?style=flat-square)](https://doi.org/10.5281/zenodo.19983066)
  [![DOI v2](https://img.shields.io/badge/DOI%20v2-10.5281%2Fzenodo.19934129-1f78b4?style=flat-square)](https://doi.org/10.5281/zenodo.19934129)
  [![DOI v1](https://img.shields.io/badge/DOI%20v1-10.5281%2Fzenodo.19867281-1f78b4?style=flat-square)](https://doi.org/10.5281/zenodo.19867281)
  [![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
  [![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/szl-holdings/ouroboros/badge)](https://securityscorecards.dev/viewer/?uri=github.com/szl-holdings/ouroboros)

  This package implements the **Ouroboros runtime** described in [`szl-holdings/ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis). It draws on, and generalizes to the system layer, prior work on adaptive computation in the language-model literature (Universal Transformers; PonderNet; Adaptive Computation Time).

  ## Runtime architecture

  ```mermaid
  flowchart TD
      classDef api fill:#01696F,stroke:#C8B26A,color:#F7F6F2;
      classDef core fill:#1B474D,stroke:#01696F,color:#F7F6F2;
      classDef gov fill:#28251D,stroke:#C8B26A,color:#F7F6F2;
      classDef io fill:#F7F6F2,stroke:#01696F,color:#1B474D;

      I["Caller / Platform API"]:::io
      H["Halt Service<br/>bounded-iteration policy"]:::core
      R["Routing Service<br/>policy-gated provider routing"]:::core
      P["Permissions<br/>scope + tenant + role"]:::gov
      S["Sandbox<br/>capability + egress policy"]:::gov
      A["Agent Registry<br/>signed agent manifests"]:::core
      L["Lambda Engine<br/>9-axis Lutar Invariant"]:::core
      PR["Proof Chain<br/>append-only receipts"]:::api

      I --> H --> R --> P --> S --> A --> L --> PR --> I
  ```

  ## Citable record

  | Version | Status | DOI | Title |
  |---|---|---|---|
  | **v3** (current) | Published 2026-05-02 | [10.5281/zenodo.19983066](https://doi.org/10.5281/zenodo.19983066) (concept [10.5281/zenodo.19944926](https://doi.org/10.5281/zenodo.19944926)) | The Loop Is the Product: Measuring Bounded Recursion as a System Primitive for Auditable AI |
  | v2 | Published 2026-04-30 | [10.5281/zenodo.19934129](https://doi.org/10.5281/zenodo.19934129) | Empirical companion |
  | v1 | Published 2026-04-28 | [10.5281/zenodo.19867281](https://doi.org/10.5281/zenodo.19867281) | Position paper |

  A Zenodo deposit reserved at `10.5281/zenodo.19951520` during a release-deletion sequence on 2026-05-02 was withdrawn (the record returns HTTP 410). The canonical v3 record is **19983066**.

  ## Modules

  ### Loop kernel (v1–v4 contracts)

  | Module | Responsibility |
  |---|---|
  | `loop-kernel` | `runLoop()` — the bounded reconciliation primitive |
  | `depth-allocator` | `allocateDepth()` — depth allocation over Δ-magnitude and validator entropy |
  | `consistency` | Cross-step consistency scoring (numeric, vector, set, string) |
  | `proof-route` | `resolveProofRoute()` — `PRF_SYSTEM_CLAIMS`, `PRF_SECURITY_ACTIONS`, `PRF_DATA_SYNC` |
  | `risk-tier` | `evaluateRiskTier()` — R1 → R4 escalation gate |
  | `almanac` | `advanceAlmanac()` / `rebuildAlmanac()` — bounded periodic coordination |

  ### v6 ecosystem layer

  | Module | Responsibility |
  |---|---|
  | `v6-payload/services` | `SHARED_RUNTIME_SERVICES_V6` — shared runtime services manifest |
  | `v6-payload/halts` | Halt conditions including `primary_source_required_but_unavailable`, `permission_denied`, `sandbox_policy_violation` |
  | `v6-payload/routing` | Extended task-routing rules including `regulated_monitoring`, `record_reconciliation`, `filings`, `regulatory`, `government_data` |
  | `v6-payload/permissions` | `TOOL_PERMISSION_MATRIX` + `checkToolPermission()` — R3-mutating-needs-approval, R4-read-only-until-approved, deny-by-default |
  | `v6-payload/sandbox` | Three execution classes; emits `class` field per canonical contract |
  | `v6-payload/agent-registry` | Required-field schema + `validateAgentRegistryEntry()` |
  | `v6-payload/secrets-broker` | Managed-secrets specification |

  ### Government-procurement readiness (`gov-readiness`)

  A structured, machine-readable representation of the materials prepared for SZL's procurement counseling engagements. It is **not** a third-party audit; it is the founder's own readiness data published as input material for a buyer's evaluator to read directly.

  | Symbol | What it is |
  |---|---|
  | `PLATFORM_READINESS` | Per-platform self-assessment scorecards with strengths and gaps |
  | `NIST_RMF_ALIGNMENT` | NIST AI RMF function × platform coverage mapping (intent + current state) |
  | `DOD_TENETS` | The five DoD Responsible AI tenets with per-tenet status |
  | `GSAR_552_239_7001_READINESS` | The ten GSAR 552.239-7001 procurement requirements with per-requirement status and documented gaps |
  | `RECOMMENDED_NAICS_CODES` | NAICS codes relevant to SZL Holdings |
  | `SAM_GOV_REGISTRATION_STEPS` / `NEW_YORK_STATE_REGISTRATION_STEPS` | Registration sequences |
  | `COMPETITIVE_POSITIONING_STATEMENT` | Pinned positioning text |
  | `GOV_READINESS_MANIFEST` | Top-level summary view |

  > The platform scorecards and the NIST/DoD/GSAR coverage matrices are **founder self-assessments** prepared as input material for procurement counseling sessions with the **Empire APEX Accelerator** (administered by NYSTEC). Empire APEX is a counseling program, not an audit body; this material has not been certified by a third party.

  Source of truth: [`docs/audit/szl-government-readiness.md`](./docs/audit/szl-government-readiness.md).

  ## Operational contract

  The package implements the **v6 operational contract** defined in the thesis repository — see [`a11oy-ultimate-replit-payload.v6.json`](https://github.com/szl-holdings/ouroboros-thesis/blob/main/a11oy-ultimate-replit-payload.v6.json) for the canonical JSON.

  ## Tests

  ```bash
  pnpm install
  pnpm exec vitest run --no-coverage
  ```

  **172/172 passing** at v6.2.0 in the single `@szl-holdings/ouroboros` package, covering the proof-route resolver, the risk-tier escalation gate, the almanac cycle advancer, the v6 services / halts / routing / permission matrix (deny-by-default pinned) / sandbox policy (`class` wire-format pinned) / agent-registry validation, the `allocateDepth()` controller, and pinning tests for every cardinal fact in the government-readiness module.

  ## Status

  `v6.2.0` is the current release. `v6.1.0` introduced the `allocateDepth()` controller — a pure-function depth allocator over Δ-magnitude and validator entropy with verdicts `continue` / `early_exit_converged` / `early_exit_entropy` / `extend`. Opt-in via `loop_policy.adaptive_depth.enabled = true`; with the flag off, runs are bit-identical to v6.0.0.

  The seven product surfaces (A11oy, Sentra, Amaru, Counsel, Terra, Vessels, Carlota Jo) live as a working multi-artifact monorepo in [`szl-holdings/szl-holdings-platform`](https://github.com/szl-holdings/szl-holdings-platform). The runtime is the open-source primitive that powers them.

  ---

  © 2026 SZL Holdings. See [LICENSE](./LICENSE).
  