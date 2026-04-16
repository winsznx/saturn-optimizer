export const ASSET_SYMBOL = {
  SBTC: "sBTC",
  STX: "STX",
  STSTX: "stSTX",
} as const;

export type AssetSymbol = (typeof ASSET_SYMBOL)[keyof typeof ASSET_SYMBOL];

export const ASSET_DECIMALS = {
  [ASSET_SYMBOL.SBTC]: 8,
  [ASSET_SYMBOL.STX]: 6,
  [ASSET_SYMBOL.STSTX]: 6,
} as const;
