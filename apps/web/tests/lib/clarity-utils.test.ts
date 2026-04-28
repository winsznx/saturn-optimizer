import { describe, it, expect } from "vitest";
import { decodeClarityUint, encodePrincipalArg } from "../../src/lib/hooks/utils";

describe("clarity hook utils", () => {
  describe("decodeClarityUint", () => {
    it("decodes a uint clarity hex value", () => {
      expect(decodeClarityUint("0x0100000000000000000000000000000064")).toBe(100);
    });
    it("returns 0 for empty input", () => {
      expect(decodeClarityUint("")).toBe(0);
    });
    it("tolerates leading/trailing whitespace and uppercase hex", () => {
      expect(decodeClarityUint("  0X010000000000000000000000000000000A  ")).toBe(10);
    });
    it("returns 0 when prefix is not a uint marker", () => {
      expect(decodeClarityUint("0x09")).toBe(0);
    });
  });

  describe("encodePrincipalArg", () => {
    it("encodes a standard principal as a length-prefixed clarity arg", () => {
      const encoded = encodePrincipalArg("SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV");
      expect(encoded).toMatch(/^0x06[0-9a-f]+$/);
      // length byte should match address byte length (41 chars = 0x29)
      expect(encoded.slice(2, 4)).toBe("29");
    });
    it("throws on empty input rather than producing a malformed arg", () => {
      expect(() => encodePrincipalArg("")).toThrow();
    });
  });
});
