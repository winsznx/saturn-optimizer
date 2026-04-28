import { describe, it, expect } from "vitest";
import { capitalize, pluralize, slugify, truncate } from "../../src/lib/strings";

describe("string helpers", () => {
  describe("capitalize", () => {
    it("uppercases the first character", () => {
      expect(capitalize("hello")).toBe("Hello");
    });
    it("returns empty input unchanged", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("slugify", () => {
    it("lowercases, strips punctuation, and collapses whitespace", () => {
      expect(slugify("Hello, World!  Saturn")).toBe("hello-world-saturn");
    });
  });

  describe("pluralize", () => {
    it("returns singular for count of 1", () => {
      expect(pluralize(1, "vault")).toBe("vault");
    });
    it("appends s by default for non-1 counts", () => {
      expect(pluralize(3, "vault")).toBe("vaults");
    });
    it("uses an explicit plural when provided", () => {
      expect(pluralize(2, "child", "children")).toBe("children");
    });
  });

  describe("truncate", () => {
    it("returns input unchanged when within max", () => {
      expect(truncate("abcd", 10)).toBe("abcd");
    });
    it("trims and appends ellipsis when over max", () => {
      expect(truncate("abcdefghij", 6)).toBe("abcde…");
    });
  });
});
