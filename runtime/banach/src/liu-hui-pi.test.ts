import { describe, it, expect } from "vitest";
import { liuHuiPi, liuHui96Gon } from "./liu-hui-pi.js";

describe("R4-C2 — Liu Hui polygon-doubling π", () => {
  it("hexagon (k=0) gives π = 3 (perimeter 6 / diameter 2)", () => {
    const r = liuHuiPi(0);
    expect(r.sides).toBe(6);
    expect(Math.abs(r.pi - 3)).toBeLessThan(1e-12);
  });

  it("96-gon reproduces Liu Hui's classical bound 3.14159 to 1e-3", () => {
    const r = liuHui96Gon();
    expect(r.sides).toBe(96);
    expect(Math.abs(r.pi - Math.PI)).toBeLessThan(1e-3);
  });

  it("monotone improvement: each doubling shrinks π gap", () => {
    let prevGap = Math.PI - liuHuiPi(0).pi;
    for (let k = 1; k <= 10; k++) {
      const gap = Math.PI - liuHuiPi(k).pi;
      expect(gap).toBeLessThan(prevGap + 1e-15);
      expect(gap).toBeGreaterThanOrEqual(0);
      prevGap = gap;
    }
  });

  it("rejects non-integer or negative doublings", () => {
    expect(() => liuHuiPi(-1)).toThrow(RangeError);
    expect(() => liuHuiPi(1.5)).toThrow(RangeError);
  });
});
