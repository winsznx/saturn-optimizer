import { describe, it, expect } from "vitest";
import { normalizeAddress, truncateAddress } from "../../src/lib/address";

describe("address module", () => {
  describe("truncateAddress", () => {
    it("returns the input unchanged when it is short", () => {
      expect(truncateAddress("ABC")).toBe("ABC");
    });
    it("respects custom head/tail lengths", () => {
      expect(truncateAddress("SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV", 4, 4)).toBe("SP31...GWYV");
    });
    it("returns empty string on undefined input", () => {
      expect(truncateAddress(undefined)).toBe("");
    });
  });

  describe("normalizeAddress", () => {
    it("trims whitespace and uppercases", () => {
      expect(normalizeAddress("  sp31dp8f8  ")).toBe("SP31DP8F8");
    });
    it("returns empty string on undefined input", () => {
      expect(normalizeAddress(undefined)).toBe("");
    });
  });
});
