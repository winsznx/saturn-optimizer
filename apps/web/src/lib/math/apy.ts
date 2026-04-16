export function apyFromDailyRate(dailyRate: number): number {
  return Math.pow(1 + dailyRate, 365) - 1;
}

export function apyFromPeriodRate(periodRate: number, periodsPerYear: number): number {
  return Math.pow(1 + periodRate, periodsPerYear) - 1;
}

export function aprToApy(apr: number, compoundsPerYear: number): number {
  return Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1;
}
