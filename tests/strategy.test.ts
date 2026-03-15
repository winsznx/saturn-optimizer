import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  bootstrapVault,
  contractPrincipal,
  deployer,
  readTokenBalance,
  readVaultBalances,
  wallet1,
} from "./helpers";

describe("strategy wiring", () => {
  it("rebalances through the conservative strategy and records managed STX", () => {
    bootstrapVault();

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-stx",
      [Cl.uint(1_000n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(1_000n));

    const rebalance = simnet.callPublicFn("saturn-vault", "rebalance", [], deployer);
    expect(rebalance.result).toBeOk(
      Cl.tuple({
        "sbtc-used": Cl.uint(0n),
        "stx-used": Cl.uint(1_000n),
      }),
    );

    const managed = simnet.callReadOnlyFn("saturn-vault", "get-managed-balances", [], wallet1);
    expect(managed.result).toBeOk(
      Cl.tuple({
        sbtc: Cl.uint(0n),
        stx: Cl.uint(0n),
        ststx: Cl.uint(1_000n),
      }),
    );
  });

  it("keeps sBTC idle when the conservative strategy is active", () => {
    bootstrapVault();

    expect(
      simnet.callPublicFn("saturn-vault", "deposit-sbtc", [Cl.uint(300n)], wallet1).result,
    ).toBeOk(Cl.uint(300n));
    expect(
      simnet.callPublicFn("saturn-vault", "deposit-stx", [Cl.uint(700n)], wallet1).result,
    ).toBeOk(Cl.uint(700n));

    const rebalance = simnet.callPublicFn("saturn-vault", "rebalance", [], deployer);
    expect(rebalance.result).toBeOk(
      Cl.tuple({
        "sbtc-used": Cl.uint(0n),
        "stx-used": Cl.uint(700n),
      }),
    );

    const vaultBalances = readVaultBalances();
    expect(vaultBalances.result).toBeOk(
      Cl.tuple({
        "idle-sbtc": Cl.uint(300n),
        "idle-stx": Cl.uint(0n),
        "managed-sbtc": Cl.uint(0n),
        "managed-ststx": Cl.uint(700n),
        "managed-stx": Cl.uint(0n),
      }),
    );

    const vaultTokenBalance = readTokenBalance("mock-sbtc", `${deployer}.saturn-vault`);
    expect(vaultTokenBalance.result).toBeOk(Cl.uint(300n));
  });

  it("requires required adapters before switching to the balanced strategy", () => {
    bootstrapVault();

    const disableBitflow = simnet.callPublicFn(
      "saturn-vault",
      "set-adapter-approved",
      [contractPrincipal("bitflow-adapter"), Cl.bool(false)],
      deployer,
    );
    expect(disableBitflow.result).toBeOk(Cl.bool(false));

    const switchStrategy = simnet.callPublicFn(
      "saturn-vault",
      "set-active-strategy",
      [contractPrincipal("balanced-strategy")],
      deployer,
    );
    expect(switchStrategy.result).toBeErr(Cl.uint(404n));
  });

  it("allows balanced routing once the required adapters are approved", () => {
    bootstrapVault();

    const switchStrategy = simnet.callPublicFn(
      "saturn-vault",
      "set-active-strategy",
      [contractPrincipal("balanced-strategy")],
      deployer,
    );
    expect(switchStrategy.result).toBeOk(contractPrincipal("balanced-strategy"));

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-sbtc",
      [Cl.uint(1_000n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(1_000n));

    const rebalance = simnet.callPublicFn("saturn-vault", "rebalance", [], deployer);
    expect(rebalance.result).toBeOk(
      Cl.tuple({
        "sbtc-used": Cl.uint(1_000n),
        "stx-used": Cl.uint(0n),
      }),
    );
  });

  it("rejects direct public calls into strategy execution entrypoints", () => {
    bootstrapVault();

    const directDeploy = simnet.callPublicFn(
      "conservative-strategy",
      "deploy-idle",
      [Cl.uint(0n), Cl.uint(100n)],
      wallet1,
    );
    expect(directDeploy.result).toBeErr(Cl.uint(500n));

    const directFree = simnet.callPublicFn(
      "balanced-strategy",
      "free-assets",
      [Cl.uint(10n), Cl.uint(0n)],
      wallet1,
    );
    expect(directFree.result).toBeErr(Cl.uint(501n));

    const directHarvest = simnet.callPublicFn("balanced-strategy", "harvest", [], wallet1);
    expect(directHarvest.result).toBeErr(Cl.uint(501n));
  });
});
