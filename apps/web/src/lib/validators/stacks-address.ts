const STACKS_ADDRESS = /^S[PMNT][0-9A-HJKMNP-TV-Z]{38,40}$/;

export function isStacksAddress(value: unknown): value is string {
  return typeof value === "string" && STACKS_ADDRESS.test(value);
}
