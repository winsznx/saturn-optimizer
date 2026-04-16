import { hiroExplorerUrl } from "./hiro-explorer";

export function stacksAddressLink(address: string, testnet = false): string {
  return hiroExplorerUrl("address", address, testnet ? "testnet" : "mainnet");
}

export function stacksTxLink(txid: string, testnet = false): string {
  return hiroExplorerUrl("txid", txid, testnet ? "testnet" : "mainnet");
}
