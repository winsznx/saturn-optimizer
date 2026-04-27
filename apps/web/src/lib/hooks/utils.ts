export function decodeClarityUint(hex: string): number {
  if (!hex) return 0;
  const cleaned = hex.trim().replace(/^0x/i, "").toLowerCase();
  if (cleaned.startsWith("01")) {
    return parseInt(cleaned.slice(2), 16);
  }
  return 0;
}

export function encodePrincipalArg(address: string): string {
  if (!address) {
    throw new Error("encodePrincipalArg: address must be non-empty");
  }
  const bytes = Buffer.from(address, "ascii");
  const lenByte = bytes.length.toString(16).padStart(2, "0");
  return `0x06${lenByte}${bytes.toString("hex")}`;
}
