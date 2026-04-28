import { describe, it, expect } from "vitest";
import {
  SBTC_DECIMALS,
  STX_DECIMALS,
  fromMicroAmount,
  toMicroAmount,
  formatAssetAmount,
  isValidAmount,
} from "../../src/lib/format";

describe("per-asset decimals helpers", () => {
  describe("toMicroAmount", () => {
    it("scales sBTC by 10^8", () => {
      expect(toMicroAmount(1, SBTC_DECIMALS)).toBe(100_000_000n);
    });
    it("scales STX by 10^6", () => {
      expect(toMicroAmount(1, STX_DECIMALS)).toBe(1_000_000n);
    });
    it("rejects negative inputs", () => {
      expect(toMicroAmount(-1, STX_DECIMALS)).toBe(0n);
    });
    it("passes bigint through unchanged", () => {
      expect(toMicroAmount(123n, 6)).toBe(123n);
    });
  });

  describe("fromMicroAmount", () => {
    it("formats sBTC with 8 fraction digits by default", () => {
      expect(fromMicroAmount(100_000_000n, SBTC_DECIMALS)).toBe("1.00000000");
    });
    it("respects fractionDigits override", () => {
      expect(fromMicroAmount(100_000_000n, SBTC_DECIMALS, 4)).toBe("1.0000");
    });
  });

  describe("formatAssetAmount", () => {
    it("uses sBTC decimals when symbol is sbtc-like", () => {
      expect(formatAssetAmount(100_000_000n, "sBTC", 4)).toBe("1.0000 sBTC");
    });
    it("uses STX decimals for STX symbol", () => {
      expect(formatAssetAmount(1_000_000n, "STX", 2)).toBe("1.00 STX");
    });
  });

  describe("isValidAmount", () => {
    it("accepts numeric strings with decimal points", () => {
      expect(isValidAmount("0.001")).toBe(true);
    });
    it("rejects empty, zero, and non-numeric input", () => {
      expect(isValidAmount("")).toBe(false);
      expect(isValidAmount("0")).toBe(false);
      expect(isValidAmount("foo")).toBe(false);
    });
  });
});
