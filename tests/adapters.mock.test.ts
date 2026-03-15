import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { bootstrapVault, contractPrincipal, deployer, wallet1 } from "./helpers";

describe("adapter and allowlist guardrails", () => {
  it("rejects unsupported lookalike adapters even if they implement the trait surface", () => {
    bootstrapVault();

    const approveLookalike = simnet.callPublicFn(
      "saturn-vault",
      "set-adapter-approved",
      [contractPrincipal("lookalike-adapter"), Cl.bool(true)],
      deployer,
    );
    expect(approveLookalike.result).toBeErr(Cl.uint(406n));
  });

  it("allows adapter harvest and position calls through approved strategies", () => {
    bootstrapVault();

    const deposit = simnet.callPublicFn(
      "saturn-vault",
      "deposit-stx",
      [Cl.uint(500n)],
      wallet1,
    );
    expect(deposit.result).toBeOk(Cl.uint(500n));

    const rebalance = simnet.callPublicFn("saturn-vault", "rebalance", [], deployer);
    expect(rebalance.result).toBeOk(
      Cl.tuple({
        "sbtc-used": Cl.uint(0n),
        "stx-used": Cl.uint(500n),
      }),
    );

    const harvest = simnet.callPublicFn("saturn-vault", "harvest", [], deployer);
    expect(harvest.result).toBeOk(Cl.bool(true));

    const position = simnet.callReadOnlyFn("stackingdao-adapter", "position", [], wallet1);
    expect(position.result).toBeOk(
      Cl.tuple({
        sbtc: Cl.uint(0n),
        stx: Cl.uint(0n),
        ststx: Cl.uint(500n),
      }),
    );
  });

  it("rejects direct public calls into adapter execution entrypoints", () => {
    bootstrapVault();

    const directStacking = simnet.callPublicFn(
      "stackingdao-adapter",
      "deposit-stx",
      [Cl.uint(100n)],
      wallet1,
    );
    expect(directStacking.result).toBeErr(Cl.uint(203n));

    const directZest = simnet.callPublicFn(
      "zest-adapter",
      "deposit-sbtc",
      [Cl.uint(100n)],
      wallet1,
    );
    expect(directZest.result).toBeErr(Cl.uint(203n));

    const directBitflow = simnet.callPublicFn(
      "bitflow-adapter",
      "harvest",
      [],
      wallet1,
    );
    expect(directBitflow.result).toBeErr(Cl.uint(203n));
  });
});
