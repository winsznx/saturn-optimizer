import { describe, it, expect } from "vitest";
import { copyToClipboard } from "../../src/lib/copy";

describe("copyToClipboard", () => {
  it("returns false when navigator is unavailable (node env)", async () => {
    expect(await copyToClipboard("hello")).toBe(false);
  });
});
