import { describe, it, expect } from "vitest";
import {
  ApiError,
  ValidationError,
  isApiError,
  isValidationError,
  toErrorMessage,
} from "../../src/lib/errors";

describe("error helpers", () => {
  describe("ApiError", () => {
    it("captures status and body", () => {
      const err = new ApiError("boom", 502, { detail: "x" });
      expect(err.status).toBe(502);
      expect(err.body).toEqual({ detail: "x" });
      expect(isApiError(err)).toBe(true);
    });
  });

  describe("ValidationError", () => {
    it("captures field name", () => {
      const err = new ValidationError("required", "amount");
      expect(err.field).toBe("amount");
      expect(isValidationError(err)).toBe(true);
    });
  });

  describe("toErrorMessage", () => {
    it("returns the message when given an Error", () => {
      expect(toErrorMessage(new Error("hi"))).toBe("hi");
    });
    it("returns the input when given a string", () => {
      expect(toErrorMessage("oops")).toBe("oops");
    });
    it("falls back to the provided default", () => {
      expect(toErrorMessage({}, "fallback")).toBe("fallback");
    });
  });
});
