export type Asset = "sbtc" | "stx";

export type TabMode = "deposit" | "withdraw";

export interface TxStatus {
  type: "success" | "error";
  message: string;
  txId?: string;
}

export interface UserPosition {
  sbtcShares: number;
  stxShares: number;
}

export interface VaultBalances {
  idleSbtc: number;
  idleStx: number;
  managedSbtc: number;
  managedStx: number;
  managedStstx: number;
}

export interface TotalShares {
  sbtc: number;
  stx: number;
}
