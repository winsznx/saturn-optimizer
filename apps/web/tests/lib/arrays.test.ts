import { describe, it, expect } from "vitest";
import { chunk, groupBy, partition, unique } from "../../src/lib/arrays";

describe("array helpers", () => {
  describe("chunk", () => {
    it("splits into equal-sized chunks", () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });
    it("leaves a remainder in the final chunk", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
    it("throws on a non-positive size", () => {
      expect(() => chunk([1, 2], 0)).toThrow();
    });
  });

  describe("unique", () => {
    it("preserves first occurrence and dedupes", () => {
      expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
    });
  });

  describe("groupBy", () => {
    it("buckets items by a derived key", () => {
      const grouped = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"));
      expect(grouped.even).toEqual([2, 4]);
      expect(grouped.odd).toEqual([1, 3]);
    });
  });

  describe("partition", () => {
    it("splits into pass/fail buckets", () => {
      const [evens, odds] = partition([1, 2, 3, 4], (n) => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3]);
    });
  });
});
