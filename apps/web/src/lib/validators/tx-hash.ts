const EVM_TX_HASH = /^0x[a-fA-F0-9]{64}$/;
const STACKS_TX_ID = /^0x[a-fA-F0-9]{64}$/;

export function isEvmTxHash(value: unknown): value is string {
  return typeof value === "string" && EVM_TX_HASH.test(value);
}

export function isStacksTxId(value: unknown): value is string {
  return typeof value === "string" && STACKS_TX_ID.test(value);
}
