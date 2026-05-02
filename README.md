# @szl-holdings/ouroboros

> Bounded loops with measurable convergence as a system primitive — the v6 ecosystem layer (services, halts, routing, permissions, sandbox, agent registry) plus a structured government-procurement readiness module.

[![Tests](https://img.shields.io/badge/tests-150%2F150-2da44e?style=flat-square)](./packages/ouroboros)
[![v6 contract](https://img.shields.io/badge/contract-v6.1.0-2b6cb0?style=flat-square)](https://github.com/szl-holdings/ouroboros-thesis/blob/main/a11oy-ultimate-replit-payload.v6.json)
[![DOI v2](https://img.shields.io/badge/DOI%20v2-10.5281%2Fzenodo.19934129-1f78b4?style=flat-square)](https://doi.org/10.5281/zenodo.19934129)
[![DOI v1](https://img.shields.io/badge/DOI%20v1-10.5281%2Fzenodo.19867281-1f78b4?style=flat-square)](https://doi.org/10.5281/zenodo.19867281)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)

This package implements the **Ouroboros runtime** described in [`szl-holdings/ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis). It draws on, and generalizes to the system layer, prior work on adaptive computation in the language-model literature (Universal Transformers; PonderNet; Adaptive Computation Time).

> **Notice.** v3 of the thesis (Zenodo 19951520) was retracted by the author on 2026-05-02 after a self-audit found overstated implementation and commercial claims. A rewritten v3 containing only verifiable claims is in preparation. This README has been brought in line with the actual surface that ships at v6.1.0.

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

A structured, machine-readable representation of the materials prepared for SZL's procurement counseling engagements. It is **not** a third-party audit; it is the founder's own readiness data.

| Symbol | What it is |
|---|---|
| `PLATFORM_READINESS` | Per-platform self-assessment scorecards (A11oy, Sentra, Amaru) with strengths and gaps |
| `NIST_RMF_ALIGNMENT` | NIST AI RMF function × platform coverage mapping (intent + current state) |
| `DOD_TENETS` | The five DoD Responsible AI tenets with per-tenet status |
| `GSAR_552_239_7001_READINESS` | The ten GSAR 552.239-7001 procurement requirements with per-requirement status and documented gaps |
| `RECOMMENDED_NAICS_CODES` | NAICS codes relevant to SZL Consulting LTD |
| `SAM_GOV_REGISTRATION_STEPS` / `NEW_YORK_STATE_REGISTRATION_STEPS` | Registration sequences |
| `PRE_MEETING_ACTION_ITEMS` | Action items grouped critical / for-meeting / 30-day |
| `COMPETITIVE_POSITIONING_STATEMENT` | Pinned positioning text |
| `GOV_READINESS_MANIFEST` | Top-level summary view |

> **Status framing.** The platform scorecards (A11oy 72/100, Sentra 68/100, Amaru 65/100) and the NIST/DoD/GSAR coverage matrices are **founder self-assessments** prepared as input material for procurement counseling sessions with the **Empire APEX Accelerator** (administered by NYSTEC). Empire APEX is a counseling program, not an audit body, and this material has not been certified by a third party. The data is published here as machine-readable structured content so a buyer's own evaluator can read it directly.

Source of truth: [`docs/audit/szl-government-readiness.md`](./docs/audit/szl-government-readiness.md).

## Operational contract

The package implements the **v6 operational contract** defined in the thesis repository — see [`a11oy-ultimate-replit-payload.v6.json`](https://github.com/szl-holdings/ouroboros-thesis/blob/main/a11oy-ultimate-replit-payload.v6.json) for the canonical JSON.

## Status

`v6.1.0` adds the `allocateDepth()` controller — a pure-function depth allocator over Δ-magnitude and validator entropy, with verdicts `continue` / `early_exit_converged` / `early_exit_entropy` / `extend`. Opt-in via `loop_policy.adaptive_depth.enabled = true`; with the flag off, runs are bit-identical to v6.0.0.

The seven product surfaces (A11oy, Sentra, Amaru, Counsel, Terra, Vessels, Carlota Jo) under the [SZL Holdings](https://github.com/szl-holdings) organization are **public README-stage repositories** — design drafts, not shipped products. The runtime is the only artifact in the portfolio at GA.

## Tests

```bash
pnpm install
pnpm exec vitest run --no-coverage
```

**150/150 passing** in the single `@szl-holdings/ouroboros` package, across five test files:

| Test file | Tests |
|---|---|
| `runtime-contract.test.ts` | 41 |
| `runtime-contract.v4.test.ts` | 29 |
| `v6-payload.test.ts` | 35 |
| `gov-readiness.test.ts` | 28 |
| `src/runtime-contract.test.ts` (legacy mirror) | 17 |
| **Total** | **150** |

These cover the proof-route resolver, the risk-tier escalation gate, the almanac cycle advancer, the v6 services / halts / routing / permission matrix (deny-by-default pinned) / sandbox policy (`class` wire-format pinned) / agent-registry validation, the `allocateDepth()` controller, and pinning tests for every cardinal fact in the government-readiness module.

---

© 2026 SZL Holdings. See [LICENSE](./LICENSE).
