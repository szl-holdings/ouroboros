# KNOWN_GOTCHAS.md — ouroboros

> Doctrine v11 LOCKED · 749/14/163.

---

## 1. earlyExitConsistency default of 1.01 disables online consistency exit

The default `earlyExitConsistency = 1.01` in `loop-kernel.ts` is a sentinel
that effectively disables online consistency-based early exit. A consistency
score is always ≤ 1.0, so `score ≥ 1.01` is never true.

**Why**: the online consistency scorer is an optional optimization path. Most
callers don't need it. Setting it to >1 disables it without adding a branch.

**Footgun**: if you set `earlyExitConsistency: 0.9` expecting it to also fire
on steps with consistency < 0.9, note that the check is `consistency >= threshold`
(UPPER bound exit), not `< threshold`. Consistency is a similarity score; higher
= more consistent = safer to exit early.

---

## 2. Λ uniqueness is a Conjecture

Same as platform/unified-kernel: the `lambda()` geometric mean satisfies
A1–A4, but UNIQUENESS is not machine-checked. Do not describe as "proven".

---

## 3. Vendored copy in unified-kernel — must be manually updated

The `platform` monorepo vendors `loop-kernel.ts` at tag `v6.3.0`. If you
publish a new ouroboros version, the kernel vendor copy does NOT update
automatically. Update process:
1. Tag the new release.
2. Copy the new `loop-kernel.ts` + types to `packages/unified-kernel/src/loop/vendor_ouroboros/`.
3. Update `OUROBOROS_PROVENANCE` in `loop/index.ts`.
4. Run the 218 reference vector tests to confirm parity.

---

## 4. `budgetExhausted` is NOT an error — it is a valid exit

If a loop exhausts its step budget without converging, `exitReason` is
`'budgetExhausted'`. The receipt is still emitted. Callers must handle this
case — it does NOT mean the loop failed, it means governance terminated it.

---

## 5. Shallow clone risk

`git ls-files | wc -l` should be ~184 for ouroboros. If < 50, partial checkout.

---

*Signed-off-by: stephenlutar2-hash <stephenlutar2@gmail.com>*
*Doctrine v11 LOCKED · 749/14/163.*
