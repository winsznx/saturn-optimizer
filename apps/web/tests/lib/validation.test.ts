import { describe, it, expect } from "vitest";
import { isString, isNumber, isRecord as isObject } from "../../src/lib/guards";
import { 
  isNonEmptyString,
  isHexString,
  isTxId
} from "../../src/lib/validation";

describe("validation guards", () => {
  it("isString", () => {
    expect(isString("hello")).toBe(true);
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
  });

  it("isNumber", () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(1.5)).toBe(true);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber("123")).toBe(false);
  });

  it("isObject", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(() => {})).toBe(false);
  });

  it("isNonEmptyString", () => {
    expect(isNonEmptyString("a")).toBe(true);
    expect(isNonEmptyString("  ")).toBe(false);
    expect(isNonEmptyString("")).toBe(false);
  });

  it("isHexString", () => {
    expect(isHexString("0x1234")).toBe(true);
    expect(isHexString("1234")).toBe(true);
    expect(isHexString("0x123")).toBe(false); // odd length
    expect(isHexString("0xZZ")).toBe(false);
  });

  it("isTxId", () => {
    const validTxId = "0x" + "a".repeat(64);
    expect(isTxId(validTxId)).toBe(true);
    expect(isTxId(validTxId.slice(2))).toBe(true);
    expect(isTxId("0x123")).toBe(false);
  });
});
