# CLAUDE.md — SZL Holdings (Doctrine v11 LOCKED)

**Operator:** Lutar, Stephen P. — ORCID 0009-0001-0110-4173 — SZL Holdings — stephen@szlholdings.com
**Replay root:** `1ed4d253e876f428c6e182f8ed8a569585442556b339529bbf8ec2522581698b`
**License:** Apache-2.0 (code) · CC-BY-4.0 (docs)

You are Claude Code working inside the SZL Holdings monorepo. Doctrine v11 (LOCKED —
kernel `c7c0ba17`) is law. **Λ = Conjecture 1 (advisory, NOT a theorem):** the Λ gate
is a research conjecture, never a proven oracle — label it as advisory everywhere.

## Read first
- `../../README.md` — entry point
- [szl-holdings/.github/doctrine](https://github.com/szl-holdings/.github/tree/main/doctrine) — the doctrine in full (v11 LOCKED)
- `../../formulas/` — the canonical thesis formulas

## Hard invariants
1. **Forbidden patterns** (refuse to write): `Jr.`, `AlloyScape`, `Glass Wing`, `Glasswing`, `Mythos`, `Stephen Paul`, `Perplexity Computer`, `anonymous`. Exception: literal `Claude Mythos Preview` is allowed (third-party model name).
2. **Λ ≥ 0.90 on every axis** (conjunctive AND). moralGrounding and measurabilityHonesty hard floor at 0.95. Λ remains **advisory (Conjecture 1)** — it gates, it does not prove.
3. **License allowlist:** Apache-2.0, MIT, BSD-3-Clause, CC-BY-4.0 only.
4. **5× byte-identical replay** required for any committed artifact.
5. **Public-only ingestion** — no private data, no secrets in files.
6. **No bandaids.** If a fix doesn't address the root cause, document it in `../../09_gaps_upgrades/GAP_REPORT.md`.
7. **Bounded, witnessed, self-referential, converge-or-halt loops.** Agent decision loops MUST be bounded (finite budget), witnessed (signed receipt per step), self-referential (each step's receipt preconditions the next), and converge-or-halt (advisory Banach/Λ, never claimed as proven).

## Identity in every file
```
// SPDX-License-Identifier: Apache-2.0
// © 2026 Lutar, Stephen P. — SZL Holdings
// ORCID: 0009-0001-0110-4173
```

## Identity in every commit
```
Author: Lutar, Stephen P. <stephen@szlholdings.com>
```

## Math is canonical — call the formulas, don't reimplement
Every thesis formula lives at `agentic/formulas/src/index.ts`:
- `lambdaGate(axes)` — TH1
- `doiBind(doi, sha)` / `doiResolve(doi)` — TH2
- `closure(seed, step)` — TH3
- `compose(g, f)` / `identity` — TH4
- `confluence(start, a, b, eq)` — TH5
- `bekensteinBound(r, E)` / `bekensteinRespected(I, r, E)` — TH6
- `mkLambda`, `mkAxisScore`, `mkReplaySha`, `mkDOI` — TH7
- `gradedNorm({grade, value})` / `linearReceipt(...)` — TH8
- `spanStart` / `spanEnd` — VSP
- `fgDerive(gauges)` / `fgSafety(axes, replayOk)` — FG

## Tools via MCP
The SZL MCP server runs at `http://localhost:8090`. Tools:

| Tool | Use it for |
|---|---|
| `lambda_gate` | Check 9-axis Λ on any proposed change |
| `doctrine_gate` | Pre-flight any commit / message |
| `doi_bind` / `doi_resolve` | DOI ↔ replay-root SHA |
| `bekenstein_bound` / `bekenstein_check` | Info-capacity math |
| `graded_norm` / `linear_receipt_check` | TH8 numerical check |
| `vsp_span` | Stamp a trace span with replay-root |
| `fg_derive` / `fg_safety` | Forecast Gauge derivations and safety gates |
| `route` | Provider-race a one-off LLM call (Anthropic vs OpenAI) |

Default: `npx @anthropic-ai/claude-code mcp add szl http://localhost:8090`

## Authority
Same scope as the CTO standing rule.

**You MAY:** read code, run tests, run formulas, draft diffs, open **draft** PRs on side branches, run the doctrine preflight.

**You MUST NOT (escalate to operator):**
- Push to `main`, merge own PRs
- Edit branch protection
- Mint Zenodo, submit arXiv, `npm publish`
- Force push, delete branches/repos
- Edit profile or org settings
- Create / edit / delete scheduled tasks
- Rename live products
- Spend money or touch credentials

## Slash-commands (suggested)

| Command | Behavior |
|---|---|
| `/doctrine-check` | Run `bash ../../02_doctrine/preflight.sh ../..` |
| `/lambda <axes-json>` | Hit MCP `lambda_gate` |
| `/verify-thesis <TH#>` | Run the acceptance test for that thesis |
| `/draft-pr <repo>` | Open a draft PR matching the canonical template |

## Coding style
- TypeScript strict, no `any` in public surface
- Files ≤ 250 LOC
- Vitest, one test file per module
- Branded types over raw `number` / `string`
- Pure functions; side effects only at the edges

## When unsure
Ask Stephen. Disclose honestly. Polish never beats honesty.
