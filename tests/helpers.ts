import { expect } from "vitest";
import { Cl } from "@stacks/transactions";

export const accounts = simnet.getAccounts();
export const deployer = accounts.get("deployer")!;
export const wallet1 = accounts.get("wallet_1")!;
export const wallet2 = accounts.get("wallet_2")!;

export const contractPrincipal = (name: string) => Cl.contractPrincipal(deployer, name);
export const standardPrincipal = (address: string) => Cl.principal(address);

export function bootstrapVault() {
  const initializeToken = (
    contractName: string,
    name: string,
    symbol: string,
  ) => {
    const initResult = simnet.callPublicFn(
      contractName,
      "initialize-metadata",
      [Cl.stringAscii(name), Cl.stringAscii(symbol), Cl.uint(6n)],
      deployer,
    );
    expect(initResult.result).toBeOk(Cl.bool(true));
  };

  initializeToken("mock-sbtc", "Mock sBTC", "sBTC");
  initializeToken("vault-shares-sbtc", "Saturn sBTC", "satBTC");
  initializeToken("vault-shares-stx", "Saturn STX", "satSTX");

  const setMockVault = simnet.callPublicFn(
    "mock-sbtc",
    "set-vault",
    [standardPrincipal(deployer)],
    deployer,
  );
  expect(setMockVault.result).toBeOk(standardPrincipal(deployer));

  const setSbtcVault = simnet.callPublicFn(
    "vault-shares-sbtc",
    "set-vault",
    [contractPrincipal("saturn-vault")],
    deployer,
  );
  expect(setSbtcVault.result).toBeOk(contractPrincipal("saturn-vault"));

  const setStxVault = simnet.callPublicFn(
    "vault-shares-stx",
    "set-vault",
    [contractPrincipal("saturn-vault")],
    deployer,
  );
  expect(setStxVault.result).toBeOk(contractPrincipal("saturn-vault"));

  for (const recipient of [wallet1, wallet2]) {
    const mintResult = simnet.callPublicFn(
      "mock-sbtc",
      "mint",
      [Cl.uint(1_000_000n), standardPrincipal(recipient)],
      deployer,
    );
    expect(mintResult.result).toBeOk(Cl.uint(1_000_000n));
  }

  const setKeeper = simnet.callPublicFn(
    "saturn-vault",
    "set-keeper",
    [standardPrincipal(deployer)],
    deployer,
  );
  expect(setKeeper.result).toBeOk(standardPrincipal(deployer));

  const approvedStrategies = ["conservative-strategy", "balanced-strategy"];
  for (const strategy of approvedStrategies) {
    const response = simnet.callPublicFn(
      "saturn-vault",
      "set-strategy-approved",
      [contractPrincipal(strategy), Cl.bool(true)],
      deployer,
    );
    expect(response.result).toBeOk(Cl.bool(true));
  }

  const approvedAdapters = ["stackingdao-adapter", "zest-adapter", "bitflow-adapter"];
  for (const adapter of approvedAdapters) {
    const response = simnet.callPublicFn(
      "saturn-vault",
      "set-adapter-approved",
      [contractPrincipal(adapter), Cl.bool(true)],
      deployer,
    );
    expect(response.result).toBeOk(Cl.bool(true));
  }

  const activeStrategy = simnet.callPublicFn(
    "saturn-vault",
    "set-active-strategy",
    [contractPrincipal("conservative-strategy")],
    deployer,
  );
  expect(activeStrategy.result).toBeOk(contractPrincipal("conservative-strategy"));
}

export function readTokenBalance(contractName: string, owner: string, caller = wallet1) {
  return simnet.callReadOnlyFn(
    contractName,
    "get-balance",
    [standardPrincipal(owner)],
    caller,
  );
}

export function readVaultBalances(caller = wallet1) {
  return simnet.callReadOnlyFn("saturn-vault", "get-vault-balances", [], caller);
}
