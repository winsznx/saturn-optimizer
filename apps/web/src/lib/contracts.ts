export const STACKS_NETWORK = "mainnet";
export const STACKS_API_URL = "https://api.hiro.so";

export const DEPLOYER = "SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV";

export const CONTRACTS = {
  GOVERNANCE: {
    address: DEPLOYER,
    name: "saturn-governance",
  },
  TOKEN: {
    address: DEPLOYER,
    name: "saturn-token-v2",
  },
  VAULT: {
    address: DEPLOYER,
    name: "saturn-vault",
  },
  METRICS: {
    address: DEPLOYER,
    name: "saturn-metrics",
  },
  SIP010_TRAIT: {
    address: DEPLOYER,
    name: "ip010-ft-trait",
  },
};

export const VAULT_ADDRESS = `${DEPLOYER}.saturn-vault`;

export const APP_NAME = "Saturn Optimizer";
export const APP_ICON = "/icon.svg";
