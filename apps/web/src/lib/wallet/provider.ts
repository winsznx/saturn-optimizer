export const WALLET_PROVIDER = {
  LEATHER: "leather",
  XVERSE: "xverse",
  HIRO: "hiro",
  UNKNOWN: "unknown",
} as const;

export type WalletProvider = (typeof WALLET_PROVIDER)[keyof typeof WALLET_PROVIDER];
