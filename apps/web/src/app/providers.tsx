"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const WalletProvider = dynamic(
  () => import("@/lib/wallet").then((mod) => mod.WalletProvider),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
