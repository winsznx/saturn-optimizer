export function percentageChange(previous: number, current: number): number {
  if (previous === 0) return current === 0 ? 0 : Infinity;
  return (current - previous) / previous;
}

export function percentageChangeBps(previous: number, current: number): number {
  const change = percentageChange(previous, current);
  if (!Number.isFinite(change)) return 0;
  return Math.round(change * 10_000);
}
