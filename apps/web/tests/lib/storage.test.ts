import { afterEach, describe, expect, it } from "vitest";
import { safeLocalStorage } from "../../src/lib/storage";

const KEY = "saturn.test.key";

afterEach(() => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
  }
});

describe("safeLocalStorage", () => {
  it("returns the fallback when window is undefined (node env)", () => {
    expect(safeLocalStorage.get(KEY, "fallback")).toBe("fallback");
  });

  it("set is a no-op without window", () => {
    expect(() => safeLocalStorage.set(KEY, { a: 1 })).not.toThrow();
  });

  it("remove is a no-op without window", () => {
    expect(() => safeLocalStorage.remove(KEY)).not.toThrow();
  });
});
