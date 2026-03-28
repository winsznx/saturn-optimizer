"use client";

import { useCallback } from "react";
import { CONTRACTS, STACKS_API_URL, DEPLOYER } from "@/lib/contracts";
import { useWallet } from "@/lib/wallet";

function decodeClarityUint(hex: string): number {
  if (!hex) return 0;
  const cleaned = hex.replace(/^0x/, "");
  if (cleaned.startsWith("01")) {
    return parseInt(cleaned.slice(2), 16);
  }
  return 0;
}

function encodePrincipalArg(address: string): string {
  const bytes = Buffer.from(address, "ascii");
  const lenByte = bytes.length.toString(16).padStart(2, "0");
  return `0x06${lenByte}${bytes.toString("hex")}`;
}

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

  const transfer = useCallback(async (amount: number, recipient: string) => {
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
            sender: DEPLOYER,
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
    } catch {
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
          body: JSON.stringify({ sender: DEPLOYER, arguments: [] }),
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
    } catch {
      return 0;
    }
  }, [contract]);

  return { mint, transfer, fetchBalance, fetchTotalSupply };
}

export function useVault() {
  const { address } = useWallet();
  const contract = CONTRACTS.VAULT;

  const depositSbtc = useCallback(async (amount: number) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "deposit-sbtc",
      functionArgs: [uintCV(amount)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const depositStx = useCallback(async (amount: number) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "deposit-stx",
      functionArgs: [uintCV(amount)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const withdrawSbtc = useCallback(async (shares: number) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "withdraw-sbtc",
      functionArgs: [uintCV(shares)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const withdrawStx = useCallback(async (shares: number) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "withdraw-stx",
      functionArgs: [uintCV(shares)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const safeWithdrawSbtc = useCallback(async (shares: number) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "safe-withdraw-sbtc",
      functionArgs: [uintCV(shares)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
  }, [contract]);

  const safeWithdrawStx = useCallback(async (shares: number) => {
    const { openContractCall } = await import("@stacks/connect");
    const { uintCV, PostConditionMode, AnchorMode } = await import("@stacks/transactions");

    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: "safe-withdraw-stx",
      functionArgs: [uintCV(shares)],
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
            sender: DEPLOYER,
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
    } catch {
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
          body: JSON.stringify({ sender: DEPLOYER, arguments: [] }),
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
    } catch {
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
          body: JSON.stringify({ sender: DEPLOYER, arguments: [] }),
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
    } catch {
      return { sbtc: 0, stx: 0 };
    }
  }, [contract]);

  void address;

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
