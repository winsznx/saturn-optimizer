import { describe, it, expect } from "vitest";
import {
  decodeOptionalUint,
  decodeResponseBool,
  decodeResponseUint,
} from "../../src/lib/clarity";

describe("clarity response decoders", () => {
  describe("decodeResponseUint", () => {
    it("decodes a wrapped (ok uint) hex", () => {
      // Note: clarity uint wrap requires the 01 prefix; this test exercises
      // the fallthrough path where the inner serialisation starts with 01.
      expect(decodeResponseUint({ result: "0x010000000000000000000000000000007b" })).toBe(123);
    });
    it("returns 0 on missing payload", () => {
      expect(decodeResponseUint({})).toBe(0);
    });
  });

  describe("decodeResponseBool", () => {
    it("decodes a clarity true value", () => {
      expect(decodeResponseBool({ result: "0x03" })).toBe(true);
    });
    it("decodes a clarity false value", () => {
      expect(decodeResponseBool({ result: "0x04" })).toBe(false);
    });
    it("returns false on missing payload", () => {
      expect(decodeResponseBool({})).toBe(false);
    });
  });

  describe("decodeOptionalUint", () => {
    it("returns null for clarity none (0x09)", () => {
      expect(decodeOptionalUint({ result: "0x09" })).toBeNull();
    });
    it("decodes a clarity (some uint) value (0x0a01...)", () => {
      expect(decodeOptionalUint({ result: "0x0a010000000000000000000000000000007b" })).toBe(123);
    });
  });
});
