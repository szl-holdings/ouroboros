import { describe, it, expect } from "vitest";
import {
  isRegularBase60,
  sexagesimalSignature,
  isNineAxisWeightAdmissible,
} from "./sexagesimal-regular.js";

describe("R3-G2 — sexagesimal regular-number criterion", () => {
  it("classical reciprocal-table values are regular", () => {
    // From Robson 2008: 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25,
    // 27, 30, 32, 36, 40, 45, 48, 50, 54, 60, ...
    for (const n of [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25,
      27, 30, 32, 36, 40, 45, 48, 50, 54, 60, 64, 72, 75, 80, 81, 90, 96, 100]) {
      expect(isRegularBase60(n)).toBe(true);
    }
  });

  it("7, 11, 13 and their multiples are NOT regular (irregular reciprocals)", () => {
    for (const n of [7, 11, 13, 14, 17, 19, 21, 22, 23, 26, 28, 33, 35, 49, 77]) {
      expect(isRegularBase60(n)).toBe(false);
    }
  });

  it("rejects non-positive, non-integer, or non-finite inputs", () => {
    expect(isRegularBase60(0)).toBe(false);
    expect(isRegularBase60(-2)).toBe(false);
    expect(isRegularBase60(1.5)).toBe(false);
    expect(isRegularBase60(NaN)).toBe(false);
    expect(isRegularBase60(Infinity)).toBe(false);
  });

  it("signature factors check out: 60 = 2^2 · 3 · 5", () => {
    expect(sexagesimalSignature(60)).toEqual({ two: 2, three: 1, five: 1 });
    expect(sexagesimalSignature(1)).toEqual({ two: 0, three: 0, five: 0 });
    expect(sexagesimalSignature(3600)).toEqual({ two: 4, three: 2, five: 2 });
    expect(sexagesimalSignature(7)).toBeNull();
  });

  it("nine-axis admissibility matches regular base-60", () => {
    expect(isNineAxisWeightAdmissible(60)).toBe(true);
    expect(isNineAxisWeightAdmissible(9)).toBe(true);
    expect(isNineAxisWeightAdmissible(7)).toBe(false);
  });
});
