import { STACKS_TOKENS } from "./registry";
import type { TokenDescriptor } from "./registry";

export function findTokenBySymbol(symbol: string): TokenDescriptor | undefined {
  const upper = symbol.toUpperCase();
  return Object.values(STACKS_TOKENS).find((token) => token.symbol.toUpperCase() === upper);
}
