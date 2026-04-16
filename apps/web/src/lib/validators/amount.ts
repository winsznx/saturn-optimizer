export function isPositiveAmount(value: string | number): boolean {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) && num > 0;
}

export function isNonNegativeAmount(value: string | number): boolean {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) && num >= 0;
}
