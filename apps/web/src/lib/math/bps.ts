export const BPS_SCALE = 10_000;

export function bpsToFraction(bps: number): number {
  return bps / BPS_SCALE;
}

export function fractionToBps(fraction: number): number {
  return Math.round(fraction * BPS_SCALE);
}

export function applyBps(amount: number, bps: number): number {
  return (amount * bps) / BPS_SCALE;
}
