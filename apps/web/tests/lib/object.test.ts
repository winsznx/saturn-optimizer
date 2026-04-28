import { describe, it, expect } from "vitest";
import { isPlainObject, omit, pick } from "../../src/lib/object";

describe("object helpers", () => {
  describe("pick", () => {
    it("retains only the requested keys", () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });
    it("ignores keys missing from the source object", () => {
      const source: { a: number; b?: number } = { a: 1 };
      expect(pick(source, ["a", "b"])).toEqual({ a: 1 });
    });
  });

  describe("omit", () => {
    it("removes the listed keys", () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
    });
  });

  describe("isPlainObject", () => {
    it("returns true for object literals", () => {
      expect(isPlainObject({})).toBe(true);
    });
    it("returns false for arrays, null, and class instances", () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      class Foo {}
      expect(isPlainObject(new Foo())).toBe(false);
    });
  });
});
