export const MICROUNITS_PER_TOKEN = 1_000_000;

export function toMicroUnits(amount: number): number {
  return Math.floor(amount * MICROUNITS_PER_TOKEN);
}

export function fromMicroUnits(amount: number, decimals = 4): string {
  return (amount / MICROUNITS_PER_TOKEN).toFixed(decimals);
}

export function formatAssetAmount(amount: number, symbol: string, decimals = 4): string {
  return `${fromMicroUnits(amount, decimals)} ${symbol}`;
}

export function isValidAmount(value: string): boolean {
  const num = Number(value);
  return value !== "" && !isNaN(num) && num > 0;
}
