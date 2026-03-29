"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowDownUp, Info, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "@/lib/wallet";

const SBTC_STX_RATE = 94200;

export default function SwapPage() {
  const [fromAsset, setFromAsset] = useState<"stx" | "sbtc">("stx");
  const [fromAmount, setFromAmount] = useState("");
  const { connected, stxBalance, connect } = useWallet();

  const toAsset = fromAsset === "stx" ? "sbtc" : "stx";
  const toAmount = fromAmount
    ? fromAsset === "stx"
      ? (Number(fromAmount) / SBTC_STX_RATE).toFixed(6)
      : (Number(fromAmount) * SBTC_STX_RATE).toFixed(2)
    : "";

  const fromBalance = fromAsset === "stx" ? stxBalance : "0.0000";
  const toBalance = toAsset === "stx" ? stxBalance : "0.0000";

  const handleFlip = () => {
    setFromAsset((prev) => (prev === "stx" ? "sbtc" : "stx"));
    setFromAmount(toAmount);
  };

  const rateLabel = fromAsset === "stx"
    ? `1 sBTC = ${SBTC_STX_RATE.toLocaleString()} STX`
    : `1 STX = ${(1 / SBTC_STX_RATE).toFixed(8)} sBTC`;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Swap Assets</h1>
        <p className="text-muted-foreground">Exchange assets at protocol rates via vault routing.</p>
      </div>

      <Card glass className="relative border-white/5 bg-background/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 border-b border-white/5">
          <CardTitle className="text-lg">Swap</CardTitle>
          <a
            href="https://explorer.hiro.so/address/SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV?chain=mainnet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Contract
          </a>
        </CardHeader>
        <CardContent className="pt-6 relative z-10 space-y-2">

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
            <div className="text-xs text-muted-foreground mb-2 flex justify-between">
              <span>You pay</span>
              <span>Balance: {connected ? fromBalance : "---"} {fromAsset.toUpperCase()}</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-1 w-[120px] shrink-0">
                <div className="h-10 flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-sm font-semibold text-white tracking-wide">
                  {fromAsset.toUpperCase()}
                </div>
              </div>
              <Input
                id="swap-from-input"
                type="number"
                placeholder="0.00"
                min="0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="text-right text-2xl font-mono h-12 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0"
              />
            </div>
            {connected && fromAsset === "stx" && Number(stxBalance) > 0 && (
              <button
                id="swap-max-btn"
                className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
                onClick={() => setFromAmount(stxBalance)}
              >
                Use max ({stxBalance} STX)
              </button>
            )}
          </div>

          <div className="relative h-8 flex justify-center items-center">
            <Separator className="absolute left-0 right-0" />
            <motion.button
              id="swap-flip-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFlip}
              className="h-9 w-9 rounded-full border border-white/10 bg-background relative z-10 text-muted-foreground hover:text-white hover:border-white/30 transition-colors flex items-center justify-center"
            >
              <ArrowDownUp className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
            <div className="text-xs text-muted-foreground mb-2 flex justify-between">
              <span>You receive (estimate)</span>
              <span>Balance: {connected ? toBalance : "---"} {toAsset.toUpperCase()}</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-1 w-[120px] shrink-0">
                <div className="h-10 flex items-center justify-center rounded-md border border-primary/30 bg-primary/5 text-sm font-semibold text-white tracking-wide">
                  {toAsset.toUpperCase()}
                </div>
              </div>
              <Input
                id="swap-to-input"
                type="number"
                placeholder="0.00"
                readOnly
                value={toAmount}
                className="text-right text-2xl font-mono h-12 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-muted-foreground"
              />
            </div>
          </div>

          <Separator className="mt-2 text-muted-foreground" />
          <div className="py-3 text-sm text-muted-foreground flex justify-between items-center">
            <span className="text-xs">Rate</span>
            <span className="text-xs font-mono">{rateLabel}</span>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-start gap-2 text-xs text-blue-300/80">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Swap routing is currently in development. This interface previews the exchange rate. Vault-native swaps will be enabled once the strategy adapters are live.</span>
          </div>

          {connected ? (
            <Button
              id="btn-swap"
              className="w-full h-12 text-base font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              disabled={!fromAmount || Number(fromAmount) <= 0}
              onClick={() => {}}
            >
              Swap {fromAsset.toUpperCase()} for {toAsset.toUpperCase()}
            </Button>
          ) : (
            <Button
              id="btn-connect-swap"
              className="w-full h-12 text-base font-medium"
              onClick={connect}
            >
              Connect Wallet to Swap
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
