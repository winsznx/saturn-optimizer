const STACKS_ADDR_RE = /^(SP|ST|SM|SN)[0-9A-HJ-NP-Z]{28,41}$/;
const HEX_RE = /^(0x)?[0-9a-fA-F]+$/;
const TX_ID_RE = /^(0x)?[0-9a-fA-F]{64}$/;

export function isStacksAddress(value: string): boolean {
  return STACKS_ADDR_RE.test(value);
}

export function isHexString(value: string): boolean {
  return HEX_RE.test(value) && value.replace(/^0x/, "").length % 2 === 0;
}

export function isTxId(value: string): boolean {
  return TX_ID_RE.test(value);
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
