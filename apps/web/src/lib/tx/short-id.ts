export function shortTxId(txId: string, prefix = 8, suffix = 6): string {
  if (!txId) return "";
  if (txId.length <= prefix + suffix) return txId;
  return `${txId.slice(0, prefix)}...${txId.slice(-suffix)}`;
}
