import { describe, it, expect } from "vitest";
import { buildSearchParams, joinPath, parseSearchParams } from "../../src/lib/url";

describe("url helpers", () => {
  describe("buildSearchParams", () => {
    it("skips null, undefined, and empty values", () => {
      const out = buildSearchParams({ a: 1, b: null, c: undefined, d: "" });
      expect(out).toBe("a=1");
    });
    it("stringifies booleans and numbers", () => {
      const out = buildSearchParams({ x: true, y: 42 });
      expect(out).toBe("x=true&y=42");
    });
  });

  describe("parseSearchParams", () => {
    it("parses a query string with or without leading '?'", () => {
      expect(parseSearchParams("?a=1&b=2")).toEqual({ a: "1", b: "2" });
      expect(parseSearchParams("a=1&b=2")).toEqual({ a: "1", b: "2" });
    });
  });

  describe("joinPath", () => {
    it("collapses adjacent slashes between base and path", () => {
      expect(joinPath("https://api.hiro.so/", "/v1/foo")).toBe("https://api.hiro.so/v1/foo");
    });
  });
});
