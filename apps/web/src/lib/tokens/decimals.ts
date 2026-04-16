import type { TokenDescriptor } from "./registry";

export function toBaseUnits(amount: number, token: TokenDescriptor): bigint {
  const scale = 10n ** BigInt(token.decimals);
  return BigInt(Math.floor(amount * Number(scale)));
}

export function fromBaseUnits(amount: bigint, token: TokenDescriptor): number {
  const scale = 10n ** BigInt(token.decimals);
  return Number(amount) / Number(scale);
}
