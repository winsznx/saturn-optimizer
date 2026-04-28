import { describe, it, expect } from "vitest";
import {
  assertNever,
  isBoolean,
  isDefined,
  isNumber,
  isRecord,
  isString,
} from "../../src/lib/guards";

describe("type guards", () => {
  describe("isDefined", () => {
    it("filters out null and undefined", () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined("")).toBe(true);
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe("isString / isNumber / isBoolean", () => {
    it("recognises primitives", () => {
      expect(isString("a")).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });
    it("rejects mismatched types", () => {
      expect(isString(1)).toBe(false);
      expect(isNumber("1")).toBe(false);
      expect(isBoolean(1)).toBe(false);
    });
    it("isNumber rejects NaN", () => {
      expect(isNumber(Number.NaN)).toBe(false);
    });
  });

  describe("isRecord", () => {
    it("accepts plain objects and rejects arrays", () => {
      expect(isRecord({ a: 1 })).toBe(true);
      expect(isRecord([])).toBe(false);
      expect(isRecord(null)).toBe(false);
    });
  });

  describe("assertNever", () => {
    it("throws when reached", () => {
      expect(() => assertNever("x" as never)).toThrow(/Unreachable/);
    });
  });
});
