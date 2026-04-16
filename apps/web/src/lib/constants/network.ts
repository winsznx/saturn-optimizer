export const NETWORK = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
  DEVNET: "devnet",
} as const;

export type StacksNetwork = (typeof NETWORK)[keyof typeof NETWORK];

export const NETWORK_API_URL: Record<StacksNetwork, string> = {
  [NETWORK.MAINNET]: "https://api.hiro.so",
  [NETWORK.TESTNET]: "https://api.testnet.hiro.so",
  [NETWORK.DEVNET]: "http://localhost:3999",
};
