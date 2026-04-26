export type Asset = "sbtc" | "stx";

export type TabMode = "deposit" | "withdraw";

export interface TxStatus {
  readonly type: "success" | "error";
  readonly message: string;
  readonly txId?: string;
}

export interface UserPosition {
  readonly sbtcShares: number;
  readonly stxShares: number;
}

export interface VaultBalances {
  readonly idleSbtc: number;
  readonly idleStx: number;
  readonly managedSbtc: number;
  readonly managedStx: number;
  readonly managedStstx: number;
}

export interface TotalShares {
  readonly sbtc: number;
  readonly stx: number;
}
