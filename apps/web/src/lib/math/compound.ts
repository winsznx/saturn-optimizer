export function compoundInterest(principal: number, rate: number, periods: number): number {
  return principal * Math.pow(1 + rate, periods);
}

export function continuousCompound(principal: number, rate: number, timeYears: number): number {
  return principal * Math.exp(rate * timeYears);
}
