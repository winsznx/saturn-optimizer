export const TX_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  ABORTED: "aborted",
} as const;

export type TxStatus = (typeof TX_STATUS)[keyof typeof TX_STATUS];

export function isTerminalTxStatus(status: TxStatus): boolean {
  return status === TX_STATUS.CONFIRMED || status === TX_STATUS.FAILED || status === TX_STATUS.ABORTED;
}
