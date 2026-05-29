# AGENTS.md

## Cursor Cloud specific instructions

This workspace contains three interrelated repositories under `/agent/repos/`:

| Repository | Type | Key Commands |
|---|---|---|
| `ouroboros` | TypeScript runtime (primary dev target) | `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` |
| `lutar-lean` | Lean 4 formal proofs | `lake exe cache get`, `lake build` |
| `ouroboros-thesis` | Documentation (Markdown/LaTeX papers) | N/A (no build required for core content) |

### ouroboros (TypeScript)

- **Package manager:** pnpm (pinned to 10.26.1 via `packageManager` field). Node.js ≥20.
- **Linter:** Biome (`pnpm lint`). Not ESLint.
- **Type checker:** `pnpm typecheck` (TypeScript 6.0.3, strict mode, `verbatimModuleSyntax`).
- **Tests:** Vitest (`pnpm test`). 218 tests across 7 test files. All should pass.
- **Build:** `pnpm build` emits to `dist/`.
- **Runtime sub-packages** under `runtime/` and `packages/` use `workspace:*` protocol — they are designed for a larger monorepo (`platform`) and are NOT independently installable from this repo alone.
- **The root `src/` is the primary development surface** — loop kernel, consistency functions, depth allocator, proof-route, risk-tier, almanac.

### lutar-lean (Lean 4)

- **Toolchain:** Lean 4 v4.13.0 (pinned in `lean-toolchain`). Requires `elan` (Lean toolchain manager).
- **PATH:** Add `$HOME/.elan/bin` to PATH before running `lake` or `lean`.
- **Cache:** Always run `lake exe cache get` before building — this downloads ~3 GB of pre-built Mathlib oleans and avoids a 4+ hour recompilation.
- **Build:** `lake build` compiles all modules. Some experimental modules (marked in the README) have `sorry` statements or compilation errors — this is the expected state of the repo, not an environment issue.
- **Stable modules:** `Lutar.Bound`, `RefVectors`, `Lutar.Axioms`, `Lutar.Invariant` build successfully.
- **Memory:** Compilation can be RAM-intensive (~16 GB recommended for full rebuild).

### ouroboros-thesis

- Primarily Markdown + LaTeX academic papers. No build step for core content.
- `v2/experiments/` has a TypeScript sub-project but requires workspace-linked deps from the larger `platform` monorepo — not independently installable in this repo layout.
- Python scripts under `docs/anatomy/scripts/` generate figures (require `matplotlib`, `numpy`, `networkx`) but are not part of the standard dev workflow.
