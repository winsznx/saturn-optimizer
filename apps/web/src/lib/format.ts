export const STX_DECIMALS = 6;
export const SBTC_DECIMALS = 8;
export const VAULT_SHARE_DECIMALS = 6;

export const STX_MICROUNITS = 10 ** STX_DECIMALS;
export const SBTC_MICROUNITS = 10 ** SBTC_DECIMALS;
export const SHARE_MICROUNITS = 10 ** VAULT_SHARE_DECIMALS;

export const MICROUNITS_PER_TOKEN = STX_MICROUNITS;

export function toMicroAmount(amount: number | string | bigint, decimals: number): bigint {
  if (typeof amount === "bigint") return amount;
  const value = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (!Number.isFinite(value) || value < 0) return BigInt(0);
  return BigInt(Math.floor(value * 10 ** decimals));
}

export function fromMicroAmount(
  amount: number | bigint,
  decimals: number,
  fractionDigits = decimals
): string {
  const value = typeof amount === "bigint" ? Number(amount) : amount;
  return (value / 10 ** decimals).toFixed(fractionDigits);
}

export function toMicroUnits(amount: number | string | bigint): bigint {
  return toMicroAmount(amount, STX_DECIMALS);
}

export function fromMicroUnits(amount: number | bigint, fractionDigits = STX_DECIMALS): string {
  return fromMicroAmount(amount, STX_DECIMALS, fractionDigits);
}

export function formatNumber(value: number | bigint, fractionDigits = 2): string {
  const num = typeof value === "bigint" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(num);
}

export function formatAssetAmount(
  amount: number | bigint,
  symbol: string,
  fractionDigits = 4
): string {
  const lower = symbol.toLowerCase();
  const decimals =
    lower === "sbtc"
      ? SBTC_DECIMALS
      : lower === "stx"
        ? STX_DECIMALS
        : VAULT_SHARE_DECIMALS;
  return `${fromMicroAmount(amount, decimals, fractionDigits)} ${symbol}`;
}

export function isValidAmount(value: string | number | undefined): boolean {
  if (value === undefined || value === "") return false;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(num) && num > 0;
}
