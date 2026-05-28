# ouroboros

> Bounded-loop runtime implementing the Lutar Invariant Λ — reference implementation for the Ouroboros Thesis governance framework.

[![CI](https://github.com/szl-holdings/ouroboros/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/szl-holdings/ouroboros/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/szl-holdings/ouroboros/badge)](https://scorecard.dev/viewer/?uri=github.com/szl-holdings/ouroboros)
[![DOI v18.0](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.20434276-blue?style=flat-square&logo=doi&logoColor=white)](https://doi.org/10.5281/zenodo.20434276)
[![Concept DOI](https://img.shields.io/badge/concept%20DOI-10.5281%2Fzenodo.19944926-805AD5?style=flat-square&logo=doi&logoColor=white)](https://doi.org/10.5281/zenodo.19944926)
[![License](https://img.shields.io/badge/license-Apache%202.0-2DA44E?style=flat-square)](./LICENSE)
[![Doctrine v6](https://img.shields.io/badge/doctrine-v6-01696F?style=flat-square)](https://github.com/szl-holdings/ouroboros-thesis)

## Mathematical Foundation

The runtime enforces the Lutar Invariant: every agent decision loop terminates with a
Λ-score in \[0, 1\] satisfying the four-axiom characterisation (A1 monotone, A2 homogeneous,
A3 Egyptian-exact, A4 bounded). Machine-checked uniqueness is established in
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
