"use client";

import { useCallback } from "react";
import { CONTRACTS } from "@/lib/contracts";

export function useMetrics() {
  const contract = CONTRACTS.METRICS;

  const pingProtocol = useCallback(async () => {
    const { openContractCall } = await import("@stacks/connect");
    const { PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "ping-protocol",
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const trackActivity = useCallback(async () => {
    const { openContractCall } = await import("@stacks/connect");
    const { PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "track-activity",
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  return { pingProtocol, trackActivity };
}
