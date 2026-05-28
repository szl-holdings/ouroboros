// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Module: ouroboros/precision   Thesis: TH16 sexagesimal exactness lemma
// Doctrine V6 preflight: OK (no forbidden patterns)
//
// R3-G2 — Babylonian sexagesimal regular-number criterion. An integer n is
// "regular base 60" iff its only prime factors lie in {2, 3, 5}; equivalently,
// 1/n has a finite sexagesimal representation. Old-Babylonian scribes used
// reciprocal tables built from exactly this set. We use the criterion as the
// arithmetic gate for nine-axis weight selection so that axis-product
// reciprocals are representable without rounding.
//
// Citations:
//   - Robson, E. (2008). Mathematics in Ancient Iraq: A Social History.
//     Princeton University Press. ISBN 978-0-691-09182-2. Ch.3 (reciprocal
//     tables, regular sexagesimal numbers).

/**
 * Returns true iff n is a positive integer whose only prime factors are
 * in {2, 3, 5} (i.e. 5-smooth). These are the numbers with finite
 * sexagesimal reciprocals.
 *
 * Special cases:
 *   - n = 1 returns true (empty factor set).
 *   - n <= 0, non-integer, NaN, or non-finite returns false.
 */
export function isRegularBase60(n: number): boolean {
  if (!Number.isInteger(n) || n <= 0 || !Number.isFinite(n)) return false;
  let m = n;
  for (const p of [2, 3, 5]) {
    while (m % p === 0) m = m / p;
  }
  return m === 1;
}

/**
 * Returns the prime-factor signature (a, b, c) such that n = 2^a · 3^b · 5^c
 * for a regular base-60 number, or null if n is not regular.
 */
export function sexagesimalSignature(
  n: number,
): { two: number; three: number; five: number } | null {
  if (!isRegularBase60(n)) return null;
  let m = n;
  let two = 0,
    three = 0,
    five = 0;
  while (m % 2 === 0) {
    m /= 2;
    two += 1;
  }
  while (m % 3 === 0) {
    m /= 3;
    three += 1;
  }
  while (m % 5 === 0) {
    m /= 5;
    five += 1;
  }
  return { two, three, five };
}

/**
 * Nine-axis weight tables in the Ouroboros runtime use base-60-regular
 * denominators so that reciprocal multiplications round-trip exactly under
 * IEEE-754 when the denominator divides a power of 60. This predicate
 * checks the weight-table-row precondition expected by lutar-lean
 * `nine_axis_weight_is_sex_regular`.
 */
export function isNineAxisWeightAdmissible(denominator: number): boolean {
  // The nine-axis weight design requires denominator ∈ {1,2,3,4,5,6,8,9,10,
  // 12,15,16,18,20,24,25,27,30,...}; equivalently, 5-smooth positive integers.
  return isRegularBase60(denominator);
}
