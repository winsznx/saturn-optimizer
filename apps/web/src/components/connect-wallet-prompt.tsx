"use client";

import * as React from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/wallet";

export function ConnectWalletPrompt({
  message = "Connect a Stacks wallet to continue.",
}: {
  message?: string;
}) {
  const { connect } = useWallet();
  return (
    <div className="glass-panel rounded-xl p-8 text-center">
      <Wallet className="mx-auto mb-3 h-8 w-8 text-primary" />
      <h3 className="text-lg font-semibold">Wallet required</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <Button onClick={connect} className="mt-4">
        Connect wallet
      </Button>
    </div>
  );
}
