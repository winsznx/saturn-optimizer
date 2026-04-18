export function bigintToString(value: bigint): string {
  return value.toString(10);
}

export function parseBigint(value: string): bigint {
  return BigInt(value.replace(/_/g, ""));
}

export function divBigintToNumber(value: bigint, divisor: bigint, decimals = 6): number {
  const scale = BigInt(10) ** BigInt(decimals);
  const scaled = (value * scale) / divisor;
  return Number(scaled) / Number(scale);
}
