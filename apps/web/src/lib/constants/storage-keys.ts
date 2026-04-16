export const STORAGE_KEYS = {
  WALLET_SESSION: "saturn.wallet.session",
  UI_THEME: "saturn.ui.theme",
  LAST_ROUTE: "saturn.ui.lastRoute",
  TX_HISTORY: "saturn.tx.history",
  DISMISSED_BANNERS: "saturn.ui.dismissedBanners",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
