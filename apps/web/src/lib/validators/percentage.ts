export function isPercentage(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

export function isUnitInterval(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}
