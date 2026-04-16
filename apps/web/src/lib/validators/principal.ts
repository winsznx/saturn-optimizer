import { isStacksAddress } from "./stacks-address";

const PRINCIPAL_CONTRACT = /^S[PMNT][0-9A-HJKMNP-TV-Z]{38,40}\.[a-z][a-z0-9-]{0,127}$/;

export function isStacksPrincipal(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return isStacksAddress(value) || PRINCIPAL_CONTRACT.test(value);
}
