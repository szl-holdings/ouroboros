# AGENTS — ouroboros

## Cursor Cloud specific instructions

### Overview

This workspace contains five SZL Holdings repositories. Only **ouroboros** (the bounded-loop runtime library) is fully self-contained and can be built/tested standalone. The other repos (`vsp-otel`, `sentra`, `vessels`, `ouroboros-thesis`) depend on `workspace:*` and `catalog:` references from the [platform monorepo](https://github.com/szl-holdings/platform) and cannot install or build in isolation.

### ouroboros — development commands

All commands run from the repo root (`/agent/repos/ouroboros`):

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Lint | `pnpm run lint` (Biome) |
| Typecheck | `pnpm run typecheck` |
| Build | `pnpm run build` (tsc) |
| Test | `pnpm run test` (vitest, 218 tests) |
| Format | `pnpm run format` |

### ouroboros/runtime/types — standalone sub-package

This sub-package (`/agent/repos/ouroboros/runtime/types`) can also install and test independently since its only dependency is `zod`:

```
cd runtime/types && pnpm install && pnpm run test
```

### Non-obvious caveats

- **Node version:** Requires Node.js >=20. The `.nvmrc` pins `20` but Node 22 works fine.
- **pnpm version:** `packageManager` field pins `pnpm@10.26.1`; newer pnpm (e.g., 10.33) is compatible.
- **Runtime sub-packages (lambda-gate, bekenstein, closure, category, glr):** These use `workspace:*` to reference `@szl/ouroboros-types` and cannot `pnpm install` individually without a pnpm workspace config. They are tested only as part of the platform monorepo.
- **Source imports use `.js` extensions:** TypeScript sources import with `.js` file extensions (standard ESM convention). To run code directly, either build first (`pnpm run build`) then import from `./dist/`, or use vitest (which handles resolution).
- **No external services needed:** ouroboros is a pure TypeScript library with zero runtime dependencies. Tests are entirely in-memory.
- **DCO sign-off required:** All commits must include `Signed-off-by` trailer (`git commit -s`).

### Other repos in this workspace

| Repo | Status in isolation |
|------|-------------------|
| `vsp-otel` | Cannot install — depends on `@szl/ouroboros-types` and `@szl/ouroboros-lambda-gate` via `workspace:*` |
| `sentra` | Web app and runtime modules depend on platform monorepo workspace packages |
| `vessels` | Web app depends on platform monorepo workspace packages (`catalog:` + `workspace:*`) |
| `ouroboros-thesis` | Documentation only (papers, figures). Experiments sub-project needs workspace deps. |
