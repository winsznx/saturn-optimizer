import { STACKS_NETWORK } from "@/lib/contracts";

const BASE = "https://explorer.hiro.so";

export function buildTxLink(txId: string, network: "mainnet" | "testnet" = "mainnet", chain: string = STACKS_NETWORK): string {
  return `${BASE}/txid/${txId}?chain=${chain}`;
}

export function buildAddressLink(
  address: string,
  chain: string = STACKS_NETWORK
): string {
  return `${BASE}/address/${address}?chain=${chain}`;
}

export function buildContractLink(
  address: string,
  name: string,
  chain: string = STACKS_NETWORK
): string {
  return `${BASE}/txid/${address}.${name}?chain=${chain}`;
}
