# AGENTS.md

## Cursor Cloud specific instructions

This workspace contains four independent repositories:

| Repo | Type | Dev commands |
|------|------|-------------|
| `ouroboros` | TypeScript runtime (pnpm, Vitest, Biome) | `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` |
| `agi-forecast` | TypeScript library (pnpm, Vitest) | `pnpm test`, `pnpm build` (in `runtime/` subdir) |
| `lutar-lean` | Lean 4 proofs (elan, Lake, Mathlib) | `lake exe cache get && lake build` |
| `ouroboros-thesis` | Documentation only (Markdown/PDF) | No build needed |

### PATH setup

The VM `/exec-daemon/node` provides Node 22, satisfying the `>=20.0.0` engine requirement. pnpm is at `/home/ubuntu/.nvm/versions/node/v22.22.2/bin/pnpm`. Ensure PATH includes it:

```sh
export PATH="/home/ubuntu/.nvm/versions/node/v22.22.2/bin:$PATH"
```

### ouroboros (root of this repo)

- Lint: `pnpm lint` (Biome)
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test` (218 tests via Vitest)
- Build: `pnpm build` (tsc)
- To import the built library: `import { runLoop } from "./dist/index.js"`

### Key caveats

- The `packages/ouroboros/` subdirectory also has source but shares the root `pnpm install` and test runner
- No external services (databases, APIs) are required; all tests are self-contained
- The `agentic/` directory contains an MCP server for Claude Code integration — not needed for basic dev
