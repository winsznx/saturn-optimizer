"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { APP_NAME, APP_ICON, STACKS_API_URL, STACKS_NETWORK } from "@/lib/contracts";

import type { UserSession } from "@stacks/connect";

let userSession: UserSession | undefined;

async function initSession() {
  if (typeof window !== "undefined" && !userSession) {
    const { AppConfig, UserSession } = await import("@stacks/connect");
    const appConfig = new AppConfig(["store_write"]);
    userSession = new UserSession({ appConfig });
  }
  return userSession;
}

interface WalletState {
  readonly connected: boolean;
  readonly address: string;
  readonly stxBalance: string;
  readonly connect: () => void;
  readonly disconnect: () => void;
}

const WalletContext = createContext<WalletState>({
  connected: false,
  address: "",
  stxBalance: "0",
  connect: () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [stxBalance, setStxBalance] = useState("0");

  const fetchBalance = useCallback(async (addr: string, signal?: AbortSignal) => {
    try {
      const res = await fetch(`${STACKS_API_URL}/extended/v1/address/${addr}/stx`, { signal });
      const data = await res.json();
      const bal = (Number(data.balance) / 1_000_000).toFixed(2);
      setStxBalance(bal);
    } catch (error) {
      if ((error as { name?: string })?.name === "AbortError") return;
      console.warn("[wallet] failed to fetch STX balance", error);
      setStxBalance("0");
    }
  }, []);

  useEffect(() => {
    initSession().then((session) => {
      if (session && session.isUserSignedIn()) {
        const userData = session.loadUserData();
        const addr = userData.profile.stxAddress[STACKS_NETWORK] ?? userData.profile.stxAddress.mainnet;
        setAddress(addr);
        setConnected(true);
        fetchBalance(addr);
      }
    });
  }, [fetchBalance]);

  const connect = useCallback(async () => {
    const session = await initSession();
    if (!session) return;
    const { showConnect } = await import("@stacks/connect");
    showConnect({
      appDetails: { name: APP_NAME, icon: APP_ICON },
      onFinish: () => {
        const userData = session.loadUserData();
        const addr = userData.profile.stxAddress[STACKS_NETWORK] ?? userData.profile.stxAddress.mainnet;
        setAddress(addr);
        setConnected(true);
        fetchBalance(addr);
      },
      userSession: session,
    });
  }, [fetchBalance]);

  const disconnect = useCallback(async () => {
    const session = await initSession();
    if (session) session.signUserOut();
    setConnected(false);
    setAddress("");
    setStxBalance("0");
  }, []);

  return (
    <WalletContext.Provider value={{ connected, address, stxBalance, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
}
