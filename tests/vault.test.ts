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

describe("saturn vault", () => {
  it("deposits and withdraws sBTC while moving balances through the vault principal", () => {
    bootstrapVault();

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-sbtc",
      [Cl.uint(500n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(500n));

    const vaultTokenBalance = readTokenBalance(
      "mock-sbtc",
      `${deployer}.saturn-vault`,
    );
    expect(vaultTokenBalance.result).toBeOk(Cl.uint(500n));

    const shareBalance = readTokenBalance("vault-shares-sbtc", wallet1);
    expect(shareBalance.result).toBeOk(Cl.uint(500n));

    const withdraw = simnet.callPublicFn(
      "saturn-vault",
      "withdraw-sbtc",
      [Cl.uint(200n)],
      wallet1,
    );
    expect(withdraw.result).toBeOk(Cl.uint(200n));

    const postWithdrawVaultBalance = readTokenBalance(
      "mock-sbtc",
      `${deployer}.saturn-vault`,
    );
    expect(postWithdrawVaultBalance.result).toBeOk(Cl.uint(300n));
  });

  it("deposits and withdraws STX with domain-specific shares", () => {
    bootstrapVault();

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-stx",
      [Cl.uint(900n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(900n));

    const balances = readVaultBalances();
    expect(balances.result).toBeOk(
      Cl.tuple({
        "idle-sbtc": Cl.uint(0n),
        "idle-stx": Cl.uint(900n),
        "managed-sbtc": Cl.uint(0n),
        "managed-ststx": Cl.uint(0n),
        "managed-stx": Cl.uint(0n),
      }),
    );

    const withdraw = simnet.callPublicFn(
      "saturn-vault",
      "withdraw-stx",
      [Cl.uint(400n)],
      wallet1,
    );
    expect(withdraw.result).toBeOk(Cl.uint(400n));
  });

  it("blocks standard flows while paused but allows safe idle withdrawal", () => {
    bootstrapVault();

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-sbtc",
      [Cl.uint(250n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(250n));

    const pause = simnet.callPublicFn("emergency-pause", "pause", [], deployer);
    expect(pause.result).toBeOk(Cl.bool(true));

    const blockedDeposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-sbtc",
      [Cl.uint(10n)],
      wallet1,
    );
    expect(blockedDeposit.result).toBeErr(Cl.uint(401n));

    const blockedWithdraw = simnet.callPublicFn(
      "saturn-vault",
      "withdraw-sbtc",
      [Cl.uint(10n)],
      wallet1,
    );
    expect(blockedWithdraw.result).toBeErr(Cl.uint(401n));

    const safeWithdraw = simnet.callPublicFn(
      "saturn-vault",
      "safe-withdraw-sbtc",
      [Cl.uint(50n)],
      wallet1,
    );
    expect(safeWithdraw.result).toBeOk(Cl.uint(50n));
  });

  it("prevents safe withdrawal above idle liquidity", () => {
    bootstrapVault();

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-stx",
      [Cl.uint(600n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(600n));

    const rebalance = simnet.callPublicFn("saturn-vault", "rebalance", [], deployer);
    expect(rebalance.result).toBeOk(
      Cl.tuple({
        "sbtc-used": Cl.uint(0n),
        "stx-used": Cl.uint(600n),
      }),
    );

    const safeWithdraw = simnet.callPublicFn(
      "saturn-vault",
      "safe-withdraw-stx",
      [Cl.uint(1n)],
      wallet1,
    );
    expect(safeWithdraw.result).toBeErr(Cl.uint(407n));
  });
});
