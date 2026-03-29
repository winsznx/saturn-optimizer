export function decodeClarityUint(hex: string): number {
  if (!hex) return 0;
  const cleaned = hex.replace(/^0x/, "");
  if (cleaned.startsWith("01")) {
    return parseInt(cleaned.slice(2), 16);
  }
  return 0;
}

export function encodePrincipalArg(address: string): string {
  const bytes = Buffer.from(address, "ascii");
  const lenByte = bytes.length.toString(16).padStart(2, "0");
  return `0x06${lenByte}${bytes.toString("hex")}`;
}
