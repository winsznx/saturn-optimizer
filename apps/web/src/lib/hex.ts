export function stripHexPrefix(value: string): string {
  return value.startsWith("0x") ? value.slice(2) : value;
}

export function addHexPrefix(value: string): string {
  return value.startsWith("0x") ? value : `0x${value}`;
}

export function hexToUint(value: string): number {
  const cleaned = stripHexPrefix(value);
  if (cleaned.length === 0) return 0;
  return parseInt(cleaned, 16);
}

export function uintToHex(value: number, pad = 0): string {
  const hex = value.toString(16);
  return pad > 0 ? hex.padStart(pad, "0") : hex;
}
