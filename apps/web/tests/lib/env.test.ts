import { afterEach, describe, expect, it, vi } from "vitest";
import { readBooleanEnv, readEnv, requireEnv } from "../../src/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("env helpers", () => {
  describe("readEnv", () => {
    it("returns the env var when set", () => {
      vi.stubEnv("X_FOO", "bar");
      expect(readEnv("X_FOO")).toBe("bar");
    });
    it("falls back when missing", () => {
      expect(readEnv("X_DEFINITELY_MISSING", "fallback")).toBe("fallback");
    });
  });

  describe("requireEnv", () => {
    it("returns the value when set", () => {
      vi.stubEnv("X_REQ", "ok");
      expect(requireEnv("X_REQ")).toBe("ok");
    });
    it("throws when missing", () => {
      expect(() => requireEnv("X_REQ_MISSING")).toThrow();
    });
  });

  describe("readBooleanEnv", () => {
    it("treats '1' and 'true' as true", () => {
      vi.stubEnv("X_BOOL", "1");
      expect(readBooleanEnv("X_BOOL")).toBe(true);
      vi.stubEnv("X_BOOL", "TRUE");
      expect(readBooleanEnv("X_BOOL")).toBe(true);
    });
    it("everything else is false", () => {
      vi.stubEnv("X_BOOL", "0");
      expect(readBooleanEnv("X_BOOL")).toBe(false);
    });
  });
});
