const HIRO_EXPLORER = "https://explorer.hiro.so";

export type HiroResource = "txid" | "address" | "block";

export function hiroExplorerUrl(
  resource: HiroResource,
  value: string,
  network: "mainnet" | "testnet" = "mainnet",
): string {
  const query = network === "testnet" ? "?chain=testnet" : "";
  return `${HIRO_EXPLORER}/${resource}/${value}${query}`;
}
