const API_ROOTS = {
  mainnet: "https://api.hiro.so",
  testnet: "https://api.testnet.hiro.so",
} as const;

export type StacksNetwork = keyof typeof API_ROOTS;

export function stacksApiUrl(path: string, network: StacksNetwork = "mainnet"): string {
  const root = API_ROOTS[network];
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${root}${normalized}`;
}
