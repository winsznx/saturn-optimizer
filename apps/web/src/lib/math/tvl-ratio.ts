export function utilizationRatio(borrowed: number, supplied: number): number {
  if (supplied <= 0) return 0;
  return Math.min(borrowed / supplied, 1);
}

export function collateralRatio(collateralValue: number, debtValue: number): number {
  if (debtValue <= 0) return Infinity;
  return collateralValue / debtValue;
}
