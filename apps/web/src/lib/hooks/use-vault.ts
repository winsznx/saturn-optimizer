"use client";

import { useCallback } from "react";
import { CONTRACTS, STACKS_API_URL } from "@/lib/contracts";
import { useWallet } from "@/lib/wallet";
import { callContract } from "@/lib/contract-call";
import {
  depositSbtcPostConditions,
  depositStxPostConditions,
  withdrawSbtcPostConditions,
  withdrawStxPostConditions,
} from "@/lib/post-conditions";
import { encodePrincipalArg } from "./utils";

export function useVault() {
  const { address } = useWallet();
  const contract = CONTRACTS.VAULT;

  const depositSbtc = useCallback(async (amount: number | bigint) => {
    if (!address) throw new Error("depositSbtc: wallet must be connected");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    return callContract({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "deposit-sbtc",
      functionArgs: [uintCV(amount)],
      postConditions: await depositSbtcPostConditions(address, amount),
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract, address]);

  const depositStx = useCallback(async (amount: number | bigint) => {
    if (!address) throw new Error("depositStx: wallet must be connected");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    return callContract({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "deposit-stx",
      functionArgs: [uintCV(amount)],
      postConditions: await depositStxPostConditions(address, amount),
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract, address]);

  const withdrawSbtc = useCallback(async (shares: number | bigint) => {
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    return callContract({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "withdraw-sbtc",
      functionArgs: [uintCV(shares)],
      postConditions: await withdrawSbtcPostConditions(),
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const withdrawStx = useCallback(async (shares: number | bigint) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "withdraw-stx",
      functionArgs: [uintCV(shares)],
      postConditions: await withdrawStxPostConditions(),
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const safeWithdrawSbtc = useCallback(async (shares: number | bigint) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "safe-withdraw-sbtc",
      functionArgs: [uintCV(shares)],
      postConditions: await withdrawSbtcPostConditions(),
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const safeWithdrawStx = useCallback(async (shares: number | bigint) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "safe-withdraw-stx",
      functionArgs: [uintCV(shares)],
      postConditions: await withdrawStxPostConditions(),
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const fetchUserPosition = useCallback(async (owner: string): Promise<{ sbtcShares: number; stxShares: number }> => {
    try {
      const { cvToValue, deserializeCV } = await import("@stacks/transactions");
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-user-position`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: contract.address,
            arguments: [encodePrincipalArg(owner)],
          }),
        }
      );
      const data = await res.json();
      if (!data.result) return { sbtcShares: 0, stxShares: 0 };
      const cv = deserializeCV(data.result);
      const val = cvToValue(cv, true);
      if (typeof val === "object" && val !== null && "value" in val) {
        const inner = (val as { value: Record<string, { value: bigint }> }).value;
        return {
          sbtcShares: Number(inner["sbtc-shares"]?.value ?? 0),
          stxShares: Number(inner["stx-shares"]?.value ?? 0),
        };
      }
      return { sbtcShares: 0, stxShares: 0 };
    } catch (error) {
      console.warn("[useVault] get-user-position read failed", error);
      return { sbtcShares: 0, stxShares: 0 };
    }
  }, [contract]);

  const fetchVaultBalances = useCallback(async (): Promise<{
    idleSbtc: number;
    idleStx: number;
    managedSbtc: number;
    managedStx: number;
    managedStstx: number;
  }> => {
    try {
      const { cvToValue, deserializeCV } = await import("@stacks/transactions");
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-vault-balances`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: contract.address, arguments: [] }),
        }
      );
      const data = await res.json();
      if (!data.result) return { idleSbtc: 0, idleStx: 0, managedSbtc: 0, managedStx: 0, managedStstx: 0 };
      const cv = deserializeCV(data.result);
      const val = cvToValue(cv, true);
      if (typeof val === "object" && val !== null && "value" in val) {
        const inner = (val as { value: Record<string, { value: bigint }> }).value;
        return {
          idleSbtc: Number(inner["idle-sbtc"]?.value ?? 0),
          idleStx: Number(inner["idle-stx"]?.value ?? 0),
          managedSbtc: Number(inner["managed-sbtc"]?.value ?? 0),
          managedStx: Number(inner["managed-stx"]?.value ?? 0),
          managedStstx: Number(inner["managed-ststx"]?.value ?? 0),
        };
      }
      return { idleSbtc: 0, idleStx: 0, managedSbtc: 0, managedStx: 0, managedStstx: 0 };
    } catch (error) {
      console.warn("[useVault] get-vault-balances read failed", error);
      return { idleSbtc: 0, idleStx: 0, managedSbtc: 0, managedStx: 0, managedStstx: 0 };
    }
  }, [contract]);

  const fetchTotalShares = useCallback(async (): Promise<{ sbtc: number; stx: number }> => {
    try {
      const { cvToValue, deserializeCV } = await import("@stacks/transactions");
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-total-shares`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: contract.address, arguments: [] }),
        }
      );
      const data = await res.json();
      if (!data.result) return { sbtc: 0, stx: 0 };
      const cv = deserializeCV(data.result);
      const val = cvToValue(cv, true);
      if (typeof val === "object" && val !== null && "value" in val) {
        const inner = (val as { value: Record<string, { value: bigint }> }).value;
        return {
          sbtc: Number(inner["sbtc"]?.value ?? 0),
          stx: Number(inner["stx"]?.value ?? 0),
        };
      }
      return { sbtc: 0, stx: 0 };
    } catch (error) {
      console.warn("[useVault] get-total-shares read failed", error);
      return { sbtc: 0, stx: 0 };
    }
  }, [contract]);

  return {
    depositSbtc,
    depositStx,
    withdrawSbtc,
    withdrawStx,
    safeWithdrawSbtc,
    safeWithdrawStx,
    fetchUserPosition,
    fetchVaultBalances,
    fetchTotalShares,
  };
}
