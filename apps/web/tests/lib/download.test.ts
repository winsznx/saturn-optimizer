import { describe, it, expect } from "vitest";
import { downloadJson, downloadText } from "../../src/lib/download";

describe("download helpers", () => {
  it("downloadJson is a no-op outside the browser", () => {
    expect(() => downloadJson({ ok: true }, "data.json")).not.toThrow();
  });

  it("downloadText is a no-op outside the browser", () => {
    expect(() => downloadText("hello", "msg.txt")).not.toThrow();
  });
});
