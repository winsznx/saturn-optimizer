export const QUERY_KEYS = {
  governance: () => ["governance"] as const,
  governancePaused: () => ["governance", "paused"] as const,
  token: (address: string) => ["token", address] as const,
  vaultBalances: () => ["vault", "balances"] as const,
  vaultShares: (owner: string) => ["vault", "shares", owner] as const,
  metrics: () => ["metrics"] as const,
};
