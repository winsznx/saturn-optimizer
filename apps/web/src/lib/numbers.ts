export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new Error("clamp: min cannot exceed max");
  return Math.max(min, Math.min(value, max));
}

export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatCompact(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${round(value * 100, decimals).toFixed(decimals)}%`;
}
