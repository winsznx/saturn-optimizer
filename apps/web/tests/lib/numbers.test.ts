import { describe, it, expect } from "vitest";
import { clamp, formatPercent, round } from "../../src/lib/numbers";

describe("numbers helpers", () => {
  describe("clamp", () => {
    it("returns the value when within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
    it("clamps to lower bound when below", () => {
      expect(clamp(-1, 0, 10)).toBe(0);
    });
    it("clamps to upper bound when above", () => {
      expect(clamp(11, 0, 10)).toBe(10);
    });
    it("throws when min exceeds max", () => {
      expect(() => clamp(0, 5, 1)).toThrow();
    });
  });

  describe("round", () => {
    it("rounds to the requested decimals", () => {
      expect(round(1.2345, 2)).toBe(1.23);
    });
  });

  describe("formatPercent", () => {
    it("formats a 0..1 fraction as a percent string", () => {
      expect(formatPercent(0.1234)).toBe("12.34%");
    });
  });
});
