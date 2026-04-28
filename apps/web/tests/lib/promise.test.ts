import { describe, it, expect } from "vitest";
import { settled, sleep, withTimeout } from "../../src/lib/promise";

describe("promise helpers", () => {
  describe("sleep", () => {
    it("resolves after the requested delay", async () => {
      const start = Date.now();
      await sleep(20);
      expect(Date.now() - start).toBeGreaterThanOrEqual(15);
    });
  });

  describe("withTimeout", () => {
    it("forwards a fast resolution", async () => {
      const result = await withTimeout(Promise.resolve("ok"), 50);
      expect(result).toBe("ok");
    });
    it("rejects when the promise exceeds the timeout", async () => {
      await expect(
        withTimeout(new Promise((r) => setTimeout(r, 80)), 20)
      ).rejects.toThrow(/timed out/);
    });
  });

  describe("settled", () => {
    it("partitions fulfilled and rejected outcomes", async () => {
      const { fulfilled, rejected } = await settled([
        Promise.resolve(1),
        Promise.reject(new Error("nope")),
        Promise.resolve(2),
      ]);
      expect(fulfilled).toEqual([1, 2]);
      expect(rejected).toHaveLength(1);
    });
  });
});
