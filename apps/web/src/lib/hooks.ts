"use client";

import { useCallback } from "react";
import {
  uintCV,
  principalCV,
  noneCV,
  PostConditionMode,
  AnchorMode,
} from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { CONTRACTS, STACKS_API_URL } from "@/lib/contracts";
import { useWallet } from "@/lib/wallet";

export function useGovernance() {
  const { address } = useWallet();
  const contract = CONTRACTS.GOVERNANCE;

  const pause = useCallback(async () => {
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
    } catch {
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

export function useToken() {
  const { address } = useWallet();
  const contract = CONTRACTS.TOKEN;

  const mint = useCallback(async (amount: number, recipient: string) => {
    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "mint",
      functionArgs: [uintCV(amount), principalCV(recipient)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const transfer = useCallback(async (amount: number, recipient: string) => {
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
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-balance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: contract.address,
            arguments: [`0x0516${owner}`],
          }),
        }
      );
      const data = await res.json();
      return parseInt(data.result?.replace("0x01", "") || "0", 16);
    } catch {
      return 0;
    }
  }, [contract]);

  const fetchTotalSupply = useCallback(async (): Promise<number> => {
    try {
      const res = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${contract.address}/${contract.name}/get-total-supply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: contract.address, arguments: [] }),
        }
      );
      const data = await res.json();
      return parseInt(data.result?.replace("0x01", "") || "0", 16);
    } catch {
      return 0;
    }
  }, [contract]);

  return { mint, transfer, fetchBalance, fetchTotalSupply };
}
