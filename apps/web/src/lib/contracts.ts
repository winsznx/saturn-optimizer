type StacksNetwork = "mainnet" | "testnet";

function readNetwork(): StacksNetwork {
  const raw = process.env.NEXT_PUBLIC_STACKS_NETWORK?.toLowerCase();
  return raw === "testnet" ? "testnet" : "mainnet";
}

export const STACKS_NETWORK: StacksNetwork = readNetwork();
export const STACKS_API_URL =
  STACKS_NETWORK === "testnet"
    ? "https://api.testnet.hiro.so"
    : "https://api.hiro.so";

export const DEPLOYER_ADDRESS: string =
  process.env.NEXT_PUBLIC_SATURN_DEPLOYER ??
  "SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV";

export const CONTRACTS = {
  GOVERNANCE: {
    address: DEPLOYER_ADDRESS,
    name: "saturn-governance",
  },
  TOKEN: {
    address: DEPLOYER_ADDRESS,
    name: "saturn-token-v2",
  },
  VAULT: {
    address: DEPLOYER_ADDRESS,
    name: "saturn-vault",
  },
  METRICS: {
    address: DEPLOYER_ADDRESS,
    name: "saturn-metrics",
  },
  SIP010_TRAIT: {
    address: DEPLOYER_ADDRESS,
    name: "sip010-ft-trait",
  },
} as const;

export const APP_NAME = "Saturn Optimizer";
export const APP_ICON = "/icon.svg";
