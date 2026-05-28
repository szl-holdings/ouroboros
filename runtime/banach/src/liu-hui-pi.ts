// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Module: ouroboros/banach   Thesis: TH16 (Banach lineage twin to R3-G1)
// Doctrine V6 preflight: OK (no forbidden patterns)
//
// R4-C2 — Liu Hui (3rd c. CE) π by polygon-side doubling. Inscribed regular
// 2k-gon side length s_{2k} = sqrt(2 - sqrt(4 - s_k^2)), with the 96-gon
// (Liu Hui's documented count) giving the classical bound 3.141024 < π <
// 3.142704. We use this as a *second* Banach-style fixed-point lineage,
// twin to the Babylonian sqrt iteration (R3-G1). Different domain, same
// theoretical role.
//
// Citations:
//   - Cullen, C. (1996). Astronomy and Mathematics in Ancient China:
//     the Zhou Bi Suan Jing. Cambridge University Press.
//   - Martzloff, J.-C. (1997). A History of Chinese Mathematics. Springer.
//     ISBN 978-3-540-33782-9. Section 6 (Liu Hui's polygon method).

export interface LiuHuiResult {
  readonly pi: number;        // 2-sided estimate of π
  readonly sides: number;     // number of polygon sides (n)
  readonly halfSide: number;  // s_n / 2 from the recurrence
}

/**
 * Liu Hui polygon recurrence (inscribed regular 2k-gon side length).
 * Starts at the regular hexagon (k=0): s_6 = 1, half-side 1/2 on the unit
 * circle. Each step doubles the number of sides.
 *
 *   s_{2k}^2 = 2 - sqrt(4 - s_k^2)
 *
 * Returns π ≈ n · s_n / 2 (perimeter / diameter approximation).
 */
export function liuHuiPi(doublings: number): LiuHuiResult {
  if (!Number.isInteger(doublings) || doublings < 0) {
    throw new RangeError(`liuHuiPi: doublings must be a non-negative integer, got ${doublings}`);
  }
  // Start with the inscribed regular hexagon: 6 sides, s_6 = 1.
  let sides = 6;
  let sSquared = 1; // s_6^2 = 1
  for (let i = 0; i < doublings; i++) {
    // s_{2n}^2 = 2 - sqrt(4 - s_n^2)
    const inner = Math.max(0, 4 - sSquared);
    sSquared = 2 - Math.sqrt(inner);
    sides *= 2;
  }
  const s = Math.sqrt(Math.max(0, sSquared));
  return {
    pi: (sides * s) / 2,
    sides,
    halfSide: s / 2,
  };
}

/**
 * Convenience: Liu Hui's classical 96-gon result.
 * 96 = 6 * 2^4, so doublings = 4. The historical record gives the bound
 * 3.141024 (lower) on the inscribed side.
 */
export function liuHui96Gon(): LiuHuiResult {
  return liuHuiPi(4);
}
