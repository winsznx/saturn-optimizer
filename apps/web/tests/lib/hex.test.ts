import { describe, it, expect } from "vitest";
import {
  addHexPrefix,
  hexToUint,
  stripHexPrefix,
  uintToHex,
} from "../../src/lib/hex";

describe("hex helpers", () => {
  describe("stripHexPrefix", () => {
    it("removes 0x prefix when present", () => {
      expect(stripHexPrefix("0xabcd")).toBe("abcd");
    });
    it("returns input unchanged when prefix is missing", () => {
      expect(stripHexPrefix("abcd")).toBe("abcd");
    });
  });

  describe("addHexPrefix", () => {
    it("adds 0x prefix when missing", () => {
      expect(addHexPrefix("abcd")).toBe("0xabcd");
    });
    it("leaves prefix in place when already present", () => {
      expect(addHexPrefix("0xabcd")).toBe("0xabcd");
    });
  });

  describe("hexToUint", () => {
    it("decodes hex with prefix", () => {
      expect(hexToUint("0x10")).toBe(16);
    });
    it("decodes hex without prefix", () => {
      expect(hexToUint("ff")).toBe(255);
    });
    it("returns 0 for empty input", () => {
      expect(hexToUint("")).toBe(0);
    });
  });

  describe("uintToHex", () => {
    it("encodes uint to hex with no padding by default", () => {
      expect(uintToHex(255)).toBe("ff");
    });
    it("pads to requested width", () => {
      expect(uintToHex(15, 4)).toBe("000f");
    });
  });
});
