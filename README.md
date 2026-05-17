# @szl-holdings/ouroboros

  > Bounded loops with measurable convergence as a system primitive — the v6 ecosystem layer (services, halts, routing, permissions, sandbox, agent registry) plus a structured government-procurement readiness module.

  [![Tests](https://img.shields.io/badge/tests-218%2F218-2da44e?style=flat-square)](./packages/ouroboros)
  [![Release](https://img.shields.io/badge/release-v6.3.0-2b6cb0?style=flat-square)](https://github.com/szl-holdings/ouroboros/releases/tag/v6.3.0)
  [![Thesis](https://img.shields.io/badge/thesis-v1%E2%86%92v11%20published%20%C2%B7%20v12%20in%20review-805AD5?style=flat-square)](https://github.com/szl-holdings/ouroboros-thesis)
  [![DOI v11](https://img.shields.io/badge/DOI%20v11-10.5281%2Fzenodo.20119582-1f78b4?style=flat-square)](https://doi.org/10.5281/zenodo.20119582)
  [![Concept DOI](https://img.shields.io/badge/Concept%20DOI-10.5281%2Fzenodo.19944926-1f78b4?style=flat-square)](https://doi.org/10.5281/zenodo.19944926)
  [![Lean](https://img.shields.io/badge/Lean%204-kernel--verified-2D5BB9?style=flat-square&logo=lean&logoColor=white)](https://github.com/szl-holdings/lutar-lean)
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

  The Ouroboros Thesis is a versioned series. The canonical paper line lives in [`szl-holdings/ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis); each Zenodo deposit is DOI-pinned.

  | Version | Status | DOI | Notes |
  |---|---|---|---|
  | **v11** (current published) | Published 2026-05-09 | [10.5281/zenodo.20119582](https://doi.org/10.5281/zenodo.20119582) | The Λ-Ouroboros Substrate (consolidated) |
  | v10 | Published 2026-05-07 | [10.5281/zenodo.20053163](https://doi.org/10.5281/zenodo.20053163) | — |
  | v9 | Published 2026-05-07 | [10.5281/zenodo.20053148](https://doi.org/10.5281/zenodo.20053148) | — |
  | v8 | Published 2026-05-05 | [10.5281/zenodo.20020849](https://doi.org/10.5281/zenodo.20020849) | — |
  | v3 | Published 2026-05-02 | [10.5281/zenodo.19983066](https://doi.org/10.5281/zenodo.19983066) | The Loop Is the Product |
  | v2 | Published 2026-04-30 | [10.5281/zenodo.19934129](https://doi.org/10.5281/zenodo.19934129) | Empirical companion |
  | v1 | Published 2026-04-28 | [10.5281/zenodo.19867281](https://doi.org/10.5281/zenodo.19867281) | Position paper |

  Concept DOI (always resolves to latest): [10.5281/zenodo.19944926](https://doi.org/10.5281/zenodo.19944926).
  v12 — *The Λ-Ouroboros Substrate — Four Machine-Verified Mechanisms* — is in review ([thesis PR #25](https://github.com/szl-holdings/ouroboros-thesis/pull/25)); v13 — *The Unified Ouroboros Spine* — is in writing on `paper-v13-thesis`.

  ## Mechanisms (I–VI)

  | # | Mechanism | Paper section | Lean | TypeScript |
  |---|---|---|---|---|
  | I | Λ-gate (9-axis Lutar Invariant) | v11 §3.1 | [`Lutar/Invariant.lean`](https://github.com/szl-holdings/lutar-lean/blob/main/Lutar/Invariant.lean) · [`Lutar/Bound.lean`](https://github.com/szl-holdings/lutar-lean/blob/main/Lutar/Bound.lean) | `packages/ouroboros-invariant` (platform) |
  | II | Receipt chain (signed bounded recursion) | v11 §3.2 | — | `packages/ouroboros-guardrails` (platform) |
  | III | Bekenstein gate (information-bounded admit) | v11 §3.3 | — | `packages/ouroboros-newton` (platform) |
  | IV | Dual-witness verdict (MATCH/DIVERGE) | v11 §3.4 | — | `packages/ouroboros-loop` (platform) |
  | V | Witness diversity (Gauss class-number gating) | v12 §4 | (statement) | `packages/ouroboros-gauss` + `ouroboros-loop` (platform) |
  | VI | Reference-vector parity (bit-exact cross-runtime) | v13 (in writing) | [`RefVectors.lean`](https://github.com/szl-holdings/lutar-lean/blob/main/RefVectors.lean) | `packages/{a11oy,amaru,sentra}-runtime` (platform) |

  Empirical benchmarks for mechanisms I–IV are reproduced by [`packages/ouroboros-integrations/bench/the-four.bench.ts`](https://github.com/szl-holdings/ouroboros/tree/main/packages/ouroboros-integrations/bench) in this repository's full v6.2 substrate. Measured at commit `6c5c28366` (Node 24.0.0, N = 10,000 reps, mulberry32-seeded): Λ₉ p50 = **3.12 µs** (258k ops/sec); receipt build p50 = **11.5 µs** (62.8k ops/sec); receipt verify p50 = **10.4 µs** (74.1k ops/sec); receipt chain of 10k entries = **114.6 ms** at p50; Bekenstein indicator fires **49.5%** under uniform seed; dual-witness clean-channel agreement **100%** / noisy-channel agreement **43.6%** at τ = 0.40; V composed-effect at τ = 0.65 reduces error from **21.9% → 7.8%** (64.3% reduction, 70.4% admitted). Source artefact: [`packages/ouroboros-integrations/bench-data.json`](https://github.com/szl-holdings/ouroboros/tree/main/packages/ouroboros-integrations/bench-data.json).

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

  **218/218 passing** in the `@szl-holdings/ouroboros` package (verified 2026-05-12), across 7 test files: proof-route resolver, risk-tier escalation gate, almanac cycle advancer, v6 services / halts / routing / permission matrix (deny-by-default pinned) / sandbox policy (`class` wire-format pinned) / agent-registry validation, `allocateDepth()` controller, `lutar-invariant-proof` Λ-bound and Λ-Egyptian-weight pins, and pinning tests for every cardinal fact in the government-readiness module.

  ## Status

  `v6.3.0` is the current release — the Series A presentation-layer hardening pass (Apache-2.0 LICENSE, CITATION.cff, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, CODEOWNERS + branch protection, OpenSSF Scorecard, CodeQL, Dependabot, TruffleHog, SHA-pinned reusable workflows, pnpm 10). No behavioral substrate change vs. `v6.2.0`. `v6.1.0` introduced the `allocateDepth()` controller — a pure-function depth allocator over Δ-magnitude and validator entropy with verdicts `continue` / `early_exit_converged` / `early_exit_entropy` / `extend`. Opt-in via `loop_policy.adaptive_depth.enabled = true`; with the flag off, runs are bit-identical to v6.0.0.

  The seven product surfaces (A11oy, Sentra, Amaru, Counsel, Terra, Vessels, Carlota Jo) live as a working multi-artifact monorepo in [`szl-holdings/platform`](https://github.com/szl-holdings/platform) (private; 1,220 tests across 76 packages, including the v6.2 substrate, the MCP gateway 27/27 e2e, dual-witness diversity, reference-vector parity, and per-runtime Λ-engine bit-exact assertions). The runtime is the open-source primitive that powers them.

  **Companion proofs.** The Lean 4 machine-checked uniqueness proof of Λ_k lives in [`szl-holdings/lutar-lean`](https://github.com/szl-holdings/lutar-lean) — the kernel is the referee.

  ---

  © 2026 SZL Holdings. See [LICENSE](./LICENSE).
  