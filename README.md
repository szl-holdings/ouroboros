# ouroboros

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-0B1F3A.svg?style=flat-square&logo=apache&logoColor=00D4FF)](https://www.apache.org/licenses/LICENSE-2.0)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20434276.svg)](https://doi.org/10.5281/zenodo.20434276)
[![CI](https://github.com/szl-holdings/ouroboros/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/szl-holdings/ouroboros/actions/workflows/ci.yml)
[![Tests](https://github.com/szl-holdings/ouroboros/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/szl-holdings/ouroboros/actions/workflows/tests.yml)
[![CodeQL](https://github.com/szl-holdings/ouroboros/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/szl-holdings/ouroboros/actions/workflows/codeql.yml)
[![SBOM](https://github.com/szl-holdings/ouroboros/actions/workflows/sbom.yml/badge.svg?branch=main)](https://github.com/szl-holdings/ouroboros/actions/workflows/sbom.yml)
[![SLSA 3](https://github.com/szl-holdings/ouroboros/actions/workflows/slsa.yml/badge.svg?branch=main)](https://github.com/szl-holdings/ouroboros/actions/workflows/slsa.yml)
[![DCO](https://github.com/szl-holdings/ouroboros/actions/workflows/dco.yml/badge.svg?branch=main)](https://github.com/szl-holdings/ouroboros/actions/workflows/dco.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/szl-holdings/ouroboros/badge)](https://securityscorecards.dev/viewer/?uri=github.com/szl-holdings/ouroboros)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0001--0110--4173-A6CE39.svg?style=flat-square&logo=orcid&logoColor=white)](https://orcid.org/0009-0001-0110-4173)

> Bounded-loop runtime implementing the Lutar Invariant Λ — reference implementation for the Ouroboros Thesis governance framework.



> **Frontier Capability** — first receipt-complete bounded-loop runtime with dual-witness closure.  
> Every agent decision produces a COSE_Sign1-wrapped dual-witness receipt closing the verifiability gap between governance policy and execution trace.

> **Thesis cross-reference:** The mathematical foundations for this repository are developed
> in the [Ouroboros Thesis v18.0](https://github.com/szl-holdings/ouroboros-thesis) (DOI [10.5281/zenodo.20434276](https://doi.org/10.5281/zenodo.20434276)).
> Source for the published thesis is in [`szl-holdings/ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis).
> Concept DOI (always-latest): [10.5281/zenodo.19944926](https://doi.org/10.5281/zenodo.19944926).

## On Hugging Face

This repository's live demos, dataset mirror, and org showcase live on the [SZLHOLDINGS Hugging Face org](https://huggingface.co/SZLHOLDINGS):

| Surface | Hugging Face artifact |
|---------|---------------------|
| **Live demo** | [szl-showcase](https://huggingface.co/spaces/SZLHOLDINGS/szl-showcase) · [szl-cookbook-runner](https://huggingface.co/spaces/SZLHOLDINGS/szl-cookbook-runner) |
| **Source mirror** | [ouroboros-source](https://huggingface.co/datasets/SZLHOLDINGS/ouroboros-source) |
| **Org showcase** | [SZLHOLDINGS on Hugging Face](https://huggingface.co/SZLHOLDINGS) — 24 datasets · 19+ Spaces · 2 models |

## Mathematical Foundation

The runtime enforces the Lutar Invariant: every agent decision loop terminates with a
Λ-score in \[0, 1\] satisfying the four-axiom characterisation (A1 monotone, A2 homogeneous,
A3 Egyptian-exact, A4 bounded). Λ uniqueness (TH10, `lutar_is_geomean`) is formally stated in Lean in
[szl-holdings/lutar-lean](https://github.com/szl-holdings/lutar-lean)
(DOI [10.5281/zenodo.20434308](https://doi.org/10.5281/zenodo.20434308)).

The Bekenstein bound constrains the maximum entropy of a decision receipt to
`S ≤ 2πkRE/(ℏc)`, preventing unbounded information accumulation in audit fibers.
[(Bekenstein, 1981)](https://doi.org/10.1103/PhysRevD.23.287)

## Table of Contents

- [Mathematical Foundation](#mathematical-foundation)
- [Repository Layout](#repository-layout)
- [Quick Start](#quick-start)
- [Governance Receipts](#governance-receipts)
- [How to Cite](#how-to-cite)
- [Companion Repositories](#companion-repositories)
- [License](#license)

## Repository Layout

| Path | Contents |
|------|----------|
| `src/` | Core runtime — loop scheduler, Λ-evaluator, receipt emitter |
| `runtime/` | Agentic loop infrastructure |
| `agentic/` | Agent harness and dual-witness emitters |
| `packages/` | Scoped npm packages (`@szl/ouroboros-*`) |
| `LUTAR_EVIDENCE.md` | Runtime parity evidence log (218 reference vectors) |

## Quick Start

```sh
git clone https://github.com/szl-holdings/ouroboros.git
cd ouroboros
pnpm install
pnpm test
```

> [!Note]
> Node.js ≥ 22 required. The `.nvmrc` file pins the exact version. See
> [szl-holdings/lutar-lean](https://github.com/szl-holdings/lutar-lean) for the
> Lean 4 formal proofs that verify the core invariant properties.

## Governance Receipts

Each decision loop emits a COSE_Sign1-wrapped receipt
([RFC 9052](https://www.rfc-editor.org/rfc/rfc9052)) carrying:
- Λ score at loop exit.
- Bekenstein-bound attestation.
- Dual-witness signatures.
- Shannon entropy measure of the decision code.

Receipts are anchored to SCITT transparency ledgers per
[draft-ietf-scitt-architecture-07](https://datatracker.ietf.org/doc/draft-ietf-scitt-architecture/).

## How to Cite

```bibtex
@software{ouroboros_runtime,
  author    = {Lutar, Stephen P.},
  title     = {{ouroboros --- Bounded-loop runtime implementing the Lutar Invariant}},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.19944926},
  url       = {https://doi.org/10.5281/zenodo.19944926}
}
```

The `CITATION.cff` in this repository root is the authoritative citation source.

## Companion Repositories

| Repository | Role |
|-----------|------|
| [szl-holdings/ouroboros-thesis](https://github.com/szl-holdings/ouroboros-thesis) | Formal thesis (v18.0, DOI [10.5281/zenodo.20434276](https://doi.org/10.5281/zenodo.20434276)) |
| [szl-holdings/lutar-lean](https://github.com/szl-holdings/lutar-lean) | Lean 4 proofs of Λ uniqueness and bounds |
| [szl-holdings/amaru](https://github.com/szl-holdings/amaru) | Cardano-anchored receipt minting |
| [szl-holdings/vsp-otel](https://github.com/szl-holdings/vsp-otel) | OpenTelemetry exporter for audit fibers |

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE).

Copyright 2026 SZL Holdings. ORCID: [0009-0001-0110-4173](https://orcid.org/0009-0001-0110-4173).

---

## Related repositories in the SZL substrate

The 13 substrate repos cross-link reciprocally. This footer is maintained by GH Admin #1 (org-wide).

- [`a11oy`](https://github.com/szl-holdings/a11oy) — vertical alignment substrate (policy · measurement · knowledge · QEC-integrity)
- [`amaru`](https://github.com/szl-holdings/amaru) — Shor-encoded receipt minting (Cardano-anchored)
- [`rosie`](https://github.com/szl-holdings/rosie) — CSS-ingress receipt orchestration
- [`sentra`](https://github.com/szl-holdings/sentra) — Kitaev-surface drift detection on audit fibers
- [`uds-mesh`](https://github.com/szl-holdings/uds-mesh) — UDS span schemas + governance receipts
- [`lutar-lean`](https://github.com/szl-holdings/lutar-lean) — Lean 4 + Mathlib v4.13.0 kernel proofs (32 GREEN modules)
- [`ouroboros`](https://github.com/szl-holdings/ouroboros) — bounded-recursion runtime
- [`ouroboros-thesis`](https://github.com/szl-holdings/ouroboros-thesis) — DOI-pinned thesis substrate (v3 → v18)
- [`platform`](https://github.com/szl-holdings/platform) — composing monorepo (76 packages, 1,220 tests)
- [`szl-brand`](https://github.com/szl-holdings/szl-brand) — anatomy + visual doctrine (PDFs hosted in-repo)
- [`szl-cookbook`](https://github.com/szl-holdings/szl-cookbook) — governed-AI recipes
- [`agi-forecast`](https://github.com/szl-holdings/agi-forecast) — PAC-Bayes + Bekenstein governance-trajectory forecasts
- [`vsp-otel`](https://github.com/szl-holdings/vsp-otel) — OpenTelemetry exporter for Λ-axis spans

Org page: [github.com/szl-holdings](https://github.com/szl-holdings) · Doctrine v6 · 11 axioms · 32 GREEN modules · v18.0 DOI [`10.5281/zenodo.20434276`](https://doi.org/10.5281/zenodo.20434276)


---

## What ouroboros Is NOT

Doctrine v6 honest scoping:

- **Not a general-purpose task scheduler.** ouroboros implements bounded-recursion governance for SZL domain verticals only.
- **Not a replacement for the Lean proofs.** Runtime termination is enforced operationally; formal proof lives in `lutar-lean`.
- **Not an autonomous decision-maker.** Every cycle requires human-in-the-loop confirmation via the Covenant Policy Engine.
- **Not stable API.** v6.x is the current semver; breaking changes follow SemVer with CHANGELOG entries.
