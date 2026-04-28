import { describe, it, expect } from "vitest";
import { retry } from "../../src/lib/retry";

describe("retry", () => {
  it("returns the first successful result", async () => {
    let calls = 0;
    const result = await retry(async () => {
      calls += 1;
      if (calls < 2) throw new Error("temp");
      return "ok";
    }, { initialDelayMs: 1, attempts: 3 });
    expect(result).toBe("ok");
    expect(calls).toBe(2);
  });

  it("rethrows after exhausting attempts", async () => {
    await expect(
      retry(async () => {
        throw new Error("nope");
      }, { initialDelayMs: 1, attempts: 2 })
    ).rejects.toThrow(/nope/);
  });

  it("respects shouldRetry by short-circuiting", async () => {
    let calls = 0;
    await expect(
      retry(async () => {
        calls += 1;
        throw new Error("fatal");
      }, { initialDelayMs: 1, attempts: 5, shouldRetry: () => false })
    ).rejects.toThrow();
    expect(calls).toBe(1);
  });
});
