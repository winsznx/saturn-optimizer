import { describe, it, expect, vi } from "vitest";
import { debounce, throttle } from "../../src/lib/debounce";

describe("debounce", () => {
  it("only fires after the wait period elapses without further calls", async () => {
    const fn = vi.fn();
    const d = debounce(fn, 20);
    d();
    d();
    d();
    expect(fn).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 35));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancel suppresses a pending call", async () => {
    const fn = vi.fn();
    const d = debounce(fn, 20);
    d();
    d.cancel();
    await new Promise((r) => setTimeout(r, 35));
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("throttle", () => {
  it("fires immediately on the leading edge", async () => {
    const fn = vi.fn();
    const t = throttle(fn, 20);
    t();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
