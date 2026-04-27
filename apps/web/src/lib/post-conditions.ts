import type { PostCondition } from "@stacks/transactions";
import { CONTRACTS, SBTC_TOKEN_PRINCIPAL } from "@/lib/contracts";

const VAULT_PRINCIPAL = `${CONTRACTS.VAULT.address}.${CONTRACTS.VAULT.name}` as const;

export async function depositStxPostConditions(
  owner: string,
  amount: number | bigint
): Promise<PostCondition[]> {
  const { Pc } = await import("@stacks/transactions");
  return [Pc.principal(owner).willSendEq(amount).ustx()];
}

export async function depositSbtcPostConditions(
  owner: string,
  amount: number | bigint
): Promise<PostCondition[]> {
  const { Pc } = await import("@stacks/transactions");
  return [
    Pc.principal(owner).willSendEq(amount).ft(SBTC_TOKEN_PRINCIPAL, "sbtc"),
  ];
}

export async function withdrawStxPostConditions(): Promise<PostCondition[]> {
  const { Pc } = await import("@stacks/transactions");
  return [Pc.principal(VAULT_PRINCIPAL).willSendGte(1).ustx()];
}

export async function withdrawSbtcPostConditions(): Promise<PostCondition[]> {
  const { Pc } = await import("@stacks/transactions");
  return [
    Pc.principal(VAULT_PRINCIPAL)
      .willSendGte(1)
      .ft(SBTC_TOKEN_PRINCIPAL, "sbtc"),
  ];
}

