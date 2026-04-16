export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DEPOSIT: "/dashboard/deposit",
  SAFE_WITHDRAW: "/dashboard/safe-withdraw",
  SWAP: "/dashboard/swap",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
