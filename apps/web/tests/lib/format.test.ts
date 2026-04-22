import { describe, it, expect } from "vitest";
import { toMicroUnits, fromMicroUnits, formatNumber, isValidAmount } from "../../src/lib/format";

describe("formatting utilities", () => {
  describe("toMicroUnits", () => {
    it("converts number to microunits", () => {
      expect(toMicroUnits(1.5)).toBe(1500000n);
    });

    it("converts string to microunits", () => {
      expect(toMicroUnits("2.75")).toBe(2750000n);
    });

    it("handles zero and invalid inputs", () => {
      expect(toMicroUnits(0)).toBe(0n);
      expect(toMicroUnits("abc")).toBe(0n);
    });
  });

  describe("fromMicroUnits", () => {
    it("converts microunits to string", () => {
      expect(fromMicroUnits(1500000n)).toBe("1.500000");
    });

    it("handles custom decimals", () => {
      expect(fromMicroUnits(1500000, 2)).toBe("1.50");
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with commas", () => {
      expect(formatNumber(1234567.89)).toBe("1,234,567.89");
    });

    it("handles bigints", () => {
      expect(formatNumber(1000000n, 0)).toBe("1,000,000");
    });
  });

  describe("isValidAmount", () => {
    it("validates positive numbers", () => {
      expect(isValidAmount("10.5")).toBe(true);
      expect(isValidAmount(100)).toBe(true);
    });

    it("rejects invalid amounts", () => {
      expect(isValidAmount("0")).toBe(false);
      expect(isValidAmount("-5")).toBe(false);
      expect(isValidAmount("abc")).toBe(false);
      expect(isValidAmount(undefined)).toBe(false);
    });
  });
});
