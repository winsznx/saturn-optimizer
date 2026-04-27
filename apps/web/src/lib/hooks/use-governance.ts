"use client";

import { useCallback } from "react";
import { CONTRACTS, STACKS_API_URL } from "@/lib/contracts";

export function useGovernance() {
  const contract = CONTRACTS.GOVERNANCE;

  const pause = useCallback(async () => {
    const { openContractCall } = await import("@stacks/connect");
    const { PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "pause",
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const unpause = useCallback(async () => {
    const { openContractCall } = await import("@stacks/connect");
    const { PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "unpause",
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const fetchPauseState = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/is-paused`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: contract.address, arguments: [] }),
        }
      );
      const data = await res.json();
      return data.result === "0x03";
    } catch (error) {
      console.warn("[useGovernance] is-paused read failed", error);
      return false;
    }
  }, [contract]);

  const fetchAdmin = useCallback(async (): Promise<string> => {
    try {
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: contract.address, arguments: [] }),
        }
      );
      const data = await res.json();
      return data.result || "";
    } catch {
      return "";
    }
  }, [contract]);

  return { pause, unpause, fetchPauseState, fetchAdmin };
}
