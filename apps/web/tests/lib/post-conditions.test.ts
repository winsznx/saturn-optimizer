import { describe, it, expect } from "vitest";
import {
  depositSbtcPostConditions,
  depositStxPostConditions,
  withdrawSbtcPostConditions,
  withdrawStxPostConditions,
} from "../../src/lib/post-conditions";

const USER = "SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV";

function principalOf(pc: { type?: string; address?: string; principal?: { address?: string } }): string | undefined {
  return pc.address ?? pc.principal?.address;
}

describe("post-condition builders", () => {
  it("depositSbtcPostConditions returns a single FT condition tied to the user", async () => {
    const list = await depositSbtcPostConditions(USER, 1_000_000);
    expect(list).toHaveLength(1);
    expect(JSON.stringify(list[0])).toContain(USER);
  });

  it("depositStxPostConditions returns a single STX condition tied to the user", async () => {
    const list = await depositStxPostConditions(USER, 5_000_000);
    expect(list).toHaveLength(1);
    expect(JSON.stringify(list[0])).toContain(USER);
  });

  it("withdrawSbtcPostConditions targets the vault principal", async () => {
    const list = await withdrawSbtcPostConditions();
    expect(list).toHaveLength(1);
    expect(JSON.stringify(list[0])).toContain("saturn-vault");
  });

  it("withdrawStxPostConditions targets the vault principal", async () => {
    const list = await withdrawStxPostConditions();
    expect(list).toHaveLength(1);
    expect(JSON.stringify(list[0])).toContain("saturn-vault");
  });

  // Unused helper kept to silence ts unused warnings
  void principalOf;
});
