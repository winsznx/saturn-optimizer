import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { bootstrapVault, deployer, readTokenBalance, wallet1 } from "./helpers";

describe("vault invariants", () => {
  it("keeps sBTC share supply aligned with outstanding user shares", () => {
    bootstrapVault();

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-sbtc",
      [Cl.uint(700n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(700n));

    const totalShares = simnet.callReadOnlyFn("saturn-vault", "get-total-shares", [], wallet1);
    expect(totalShares.result).toBeOk(
      Cl.tuple({
        sbtc: Cl.uint(700n),
        stx: Cl.uint(0n),
      }),
    );

    const shareSupply = simnet.callReadOnlyFn(
      "vault-shares-sbtc",
      "get-total-supply",
      [],
      wallet1,
    );
    expect(shareSupply.result).toBeOk(Cl.uint(700n));
  });

  it("does not leak between sBTC and STX accounting domains", () => {
    bootstrapVault();

    expect(
      simnet.callPublicFn("saturn-vault", "deposit-sbtc", [Cl.uint(300n)], wallet1).result,
    ).toBeOk(Cl.uint(300n));
    expect(
      simnet.callPublicFn("saturn-vault", "deposit-stx", [Cl.uint(900n)], wallet1).result,
    ).toBeOk(Cl.uint(900n));

    const vaultBalances = simnet.callReadOnlyFn("saturn-vault", "get-vault-balances", [], wallet1);
    expect(vaultBalances.result).toBeOk(
      Cl.tuple({
        "idle-sbtc": Cl.uint(300n),
        "idle-stx": Cl.uint(900n),
        "managed-sbtc": Cl.uint(0n),
        "managed-ststx": Cl.uint(0n),
        "managed-stx": Cl.uint(0n),
      }),
    );

    const vaultTokenBalance = readTokenBalance(
      "mock-sbtc",
      `${deployer}.saturn-vault`,
    );
    expect(vaultTokenBalance.result).toBeOk(Cl.uint(300n));
  });

  it("keeps admin-only controls protected from non-admin callers", () => {
    bootstrapVault();

    const unauthorized = simnet.callPublicFn(
      "saturn-vault",
      "set-keeper",
      [Cl.principal(wallet1)],
      wallet1,
    );
    expect(unauthorized.result).toBeErr(Cl.uint(400n));
  });
});
