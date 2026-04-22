export const MICROUNITS_PER_TOKEN = 1_000_000;

export function toMicroUnits(amount: number | string | bigint): bigint {
  const value = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(value)) return 0n;
  return BigInt(Math.floor(value * MICROUNITS_PER_TOKEN));
}

export function fromMicroUnits(amount: number | bigint, decimals = 6): string {
  const value = typeof amount === "bigint" ? Number(amount) : amount;
  return (value / MICROUNITS_PER_TOKEN).toFixed(decimals);
}

export function formatNumber(value: number | bigint, decimals = 2): string {
  const num = typeof value === "bigint" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatAssetAmount(amount: number | bigint, symbol: string, decimals = 4): string {
  return `${fromMicroUnits(amount, decimals)} ${symbol}`;
}

export function isValidAmount(value: string | number | undefined): boolean {
  if (value === undefined || value === "") return false;
  const num = Number(value);
  return !isNaN(num) && num > 0;
}
