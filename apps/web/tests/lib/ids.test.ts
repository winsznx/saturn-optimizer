import { describe, it, expect } from "vitest";
import { randomId, shortId } from "../../src/lib/ids";

describe("ids", () => {
  describe("randomId", () => {
    it("uses the provided prefix", () => {
      expect(randomId("user")).toMatch(/^user-/);
    });
    it("returns unique values across calls", () => {
      expect(randomId()).not.toBe(randomId());
    });
  });

  describe("shortId", () => {
    it("returns the requested length", () => {
      expect(shortId(12)).toHaveLength(12);
    });
    it("uses the lowercase a-z and 0-9 alphabet", () => {
      expect(shortId(20)).toMatch(/^[a-z0-9]+$/);
    });
  });
});
