export function priceImpact(expectedPrice: number, executionPrice: number): number {
  if (expectedPrice <= 0) return 0;
  return Math.abs(executionPrice - expectedPrice) / expectedPrice;
}

export function priceImpactBps(expectedPrice: number, executionPrice: number): number {
  return Math.round(priceImpact(expectedPrice, executionPrice) * 10_000);
}
