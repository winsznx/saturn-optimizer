export const STACKS_NETWORK = "mainnet";
export const STACKS_API_URL = "https://api.hiro.so";

export const DEPLOYER_ADDRESS: string = "SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV";

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
};


export const APP_NAME = "Saturn Optimizer";
export const APP_ICON = "/icon.svg";
