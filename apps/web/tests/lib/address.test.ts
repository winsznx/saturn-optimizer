import { describe, it, expect } from "vitest";
import { truncateAddress } from "../../src/lib/utils";
import { isStacksAddress } from "../../src/lib/validation";

describe("address utilities", () => {
  describe("truncateAddress", () => {
    it("truncates a standard Stacks address", () => {
      const addr = "SP3GW782J56S2AQMZYDFS5624S98V9BD958M6C2Y";
      expect(truncateAddress(addr)).toBe("SP3GW7...6C2Y");
    });

    it("handles custom lengths", () => {
      const addr = "SP3GW782J56S2AQMZYDFS5624S98V9BD958M6C2Y";
      expect(truncateAddress(addr, 4, 2)).toBe("SP3G...2Y");
    });

    it("returns empty string for undefined", () => {
      expect(truncateAddress(undefined)).toBe("");
    });

    it("returns original address if shorter than truncation limit", () => {
      const short = "SP3GW";
      expect(truncateAddress(short)).toBe("SP3GW");
    });
  });

  describe("isStacksAddress", () => {
    it("validates mainnet addresses", () => {
      expect(isStacksAddress("SP3GW782J56S2AQMZYDFS5624S98V9BD958M6C2Y")).toBe(true);
    });

    it("validates testnet addresses", () => {
      expect(isStacksAddress("ST3GW782J56S2AQMZYDFS5624S98V9BD958M6C2Y")).toBe(true);
    });

    it("rejects invalid addresses", () => {
      expect(isStacksAddress("invalid")).toBe(false);
      expect(isStacksAddress("SP123")).toBe(false);
    });
  });
});
