export interface TokenDescriptor {
  symbol: string;
  name: string;
  decimals: number;
  contract?: string;
}

export const STACKS_TOKENS: Record<string, TokenDescriptor> = {
  STX: { symbol: "STX", name: "Stacks", decimals: 6 },
  SBTC: { symbol: "sBTC", name: "Synthetic BTC", decimals: 8 },
  USDA: { symbol: "USDA", name: "USDA Stablecoin", decimals: 6 },
};
