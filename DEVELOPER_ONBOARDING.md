# ouroboros — Developer Onboarding

> **Doctrine v11 LOCKED** · 749 declarations · 14 axioms · 163 sorries · Λ = Conjecture 1 · SLSA L1 honest

ouroboros is the bounded-loop runtime that enforces the Lutar Invariant Λ. It is the
engine that the `unified-kernel` in the platform repo depends on (via `@szl-holdings/ouroboros`).

---

## 1. What ouroboros actually is

ouroboros guarantees every agent decision loop:

1. **Terminates** — bounded by `maxSteps` (runtime contract v4: 12 steps).
2. **Converges** — delta drops ≤ `convergenceThreshold` (1e-3) before budget exhausted.
3. **Emits a receipt** — a COSE_Sign1-wrapped dual-witness receipt connecting governance policy to the execution trace.

Formal backing: `Lutar/Thesis/TH_V18_01_AgentLoopTerminates.lean` — `th_v18_01_terminates`
(∃ n, iterate agentStep n s₀ = .Done) — proven, NO sorry.

---

## 2. Architecture diagram

```
  ouroboros/src/
  ├── loop-kernel.ts       THE kernel — runLoop() (start here)
  ├── types.ts             LoopConfig, LoopTrace, StepFn, DeltaFn
  ├── consistency.ts       Online consistency scoring
  ├── depth-allocator.ts   Depth budget allocation
  ├── proof-route.ts       Receipt routing + proof path
  ├── risk-tier.ts         Risk tier classification
  ├── almanac.ts           Decision almanac (step history)
  └── index.ts             Public exports

  runtime/
  ├── lambda-gate/         Λ-gate enforcement
  ├── bekenstein/          Bekenstein capacity bound
  ├── closure/             Receipt-closed loop infrastructure
  ├── category/            Category-theoretic receipt structure
  ├── glr/                 GLR parse-based consistency
  └── types/               Shared runtime types

  packages/ouroboros/      @szl-holdings/ouroboros npm package (published)
  agentic/                 Agent harness + dual-witness emitters
```

---

## 3. The runLoop kernel (the core logic)

`src/loop-kernel.ts` exports `runLoop<S, O>(args)`. The four exit conditions:

| Condition | exitReason |
|---|---|
| `delta ≤ convergenceThreshold` | `'converged'` |
| `consistency ≥ earlyExitConsistency` | `'consistent'` |
| `step returns { abort: true }` | `'aborted'` |
| `steps ≥ maxSteps` | `'budgetExhausted'` |

**Key gotcha**: `earlyExitConsistency` defaults to 1.01 (i.e., disabled). The
sentinel >1 prevents online consistency from ever triggering early exit unless
you explicitly set it below 1.0. This is intentional.

---

## 4. Running locally

```bash
# FULL clone (never --depth 1)
git clone https://github.com/szl-holdings/ouroboros.git && cd ouroboros
pnpm install
pnpm test             # 218 reference vectors
pnpm -F @szl-holdings/ouroboros build
```

---

## 5. How the unified-kernel uses ouroboros

The `platform` repo's `packages/unified-kernel/src/loop/` vendors this
package byte-for-byte at tag `v6.3.0` (SHA `d64748cc`). This means:

- Changes to ouroboros do NOT automatically propagate to the kernel.
- To update the kernel, re-vendor `loop-kernel.ts` and bump the tag.
- The 218 tests in this repo are the proof of correctness for the vendored copy.

---

## 6. Λ uniqueness — Conjecture, NOT theorem

`src/index.ts` exports the `lambda()` function (geometric mean). The uniqueness
claim is **Conjecture 1** — it depends on the open `CAUCHY_ND` sorry in
`Lutar/Uniqueness.lean:120`. Do not describe it as "proven" anywhere.

---

## 7. Doctrine constants (LOCKED)

749/14/163 · kernel `c7c0ba17` · Λ = Conjecture 1.

---

## 8. Contribution model

ouroboros is source-available, proprietary. PRs not accepted without prior
agreement. Bug reports, security disclosures, and docs typo fixes are welcome.
See `CONTRIBUTING.md` for details.

---

*Authored by Perplexity Computer Agent on behalf of Yachay (CTO).*
*Doctrine v11 LOCKED · 749/14/163 · Λ = Conjecture 1.*
*Signed-off-by: stephenlutar2-hash <stephenlutar2@gmail.com>*
