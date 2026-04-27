"use client";

import { useCallback } from "react";
import { CONTRACTS, STACKS_API_URL } from "@/lib/contracts";
import { useWallet } from "@/lib/wallet";
import { encodePrincipalArg, decodeClarityUint } from "./utils";

export function useToken() {
  const { address } = useWallet();
  const contract = CONTRACTS.TOKEN;

  const mint = useCallback(async (amount: number | bigint, recipient: string) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, principalCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "mint",
      functionArgs: [uintCV(amount), principalCV(recipient)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const transfer = useCallback(async (amount: number | bigint, recipient: string) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, principalCV, noneCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "transfer",
      functionArgs: [
        uintCV(amount),
        principalCV(address),
        principalCV(recipient),
        noneCV(),
      ],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract, address]);

  const fetchBalance = useCallback(async (owner: string): Promise<number> => {
    try {
      const { cvToValue, deserializeCV } = await import("@stacks/transactions");
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-balance`,
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
      if (!data.result) return 0;
      const cv = deserializeCV(data.result);
      const val = cvToValue(cv, true);
      if (typeof val === "object" && val !== null && "value" in val) {
        return Number((val as { value: bigint | number }).value);
      }
      return 0;
    } catch (error) {
      console.warn("[useToken] get-balance read failed", error);
      return 0;
    }
  }, [contract]);

  const fetchTotalSupply = useCallback(async (): Promise<number> => {
    try {
      const { cvToValue, deserializeCV } = await import("@stacks/transactions");
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-total-supply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: contract.address, arguments: [] }),
        }
      );
      const data = await res.json();
      if (!data.result) return 0;
      const cv = deserializeCV(data.result);
      const val = cvToValue(cv, true);
      if (typeof val === "object" && val !== null && "value" in val) {
        return Number((val as { value: bigint | number }).value);
      }
      return decodeClarityUint(data.result);
    } catch (error) {
      console.warn("[useToken] get-total-supply read failed", error);
      return 0;
    }
  }, [contract]);

  return { mint, transfer, fetchBalance, fetchTotalSupply };
}
