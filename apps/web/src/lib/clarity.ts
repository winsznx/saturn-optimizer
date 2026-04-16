import { decodeClarityUint } from "./hooks/utils";

export interface ClarityResponse<T> {
  okay: boolean;
  result: string;
  value: T;
}

export function decodeResponseUint(payload: { result?: string }): number {
  if (!payload?.result) return 0;
  return decodeClarityUint(payload.result);
}

export function decodeResponseBool(payload: { result?: string }): boolean {
  if (!payload?.result) return false;
  return payload.result.startsWith("0x03");
}

export function decodeOptionalUint(payload: { result?: string }): number | null {
  if (!payload?.result) return null;
  const hex = payload.result.replace(/^0x/, "");
  if (hex.startsWith("09")) return null;
  if (hex.startsWith("0a")) {
    return decodeClarityUint(`0x${hex.slice(2)}`);
  }
  return null;
}
