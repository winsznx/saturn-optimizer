"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, AlertTriangle, ArrowLeftRight, Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useVault } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Asset = "sbtc" | "stx";

interface TxStatus {
  type: "success" | "error";
  message: string;
  txId?: string;
}

export default function SafeWithdrawPage() {
  const [amount, setAmount] = useState("");
  const [activeAsset, setActiveAsset] = useState<Asset>("sbtc");
  const [isPending, setIsPending] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);
  const [userPosition, setUserPosition] = useState({ sbtcShares: 0, stxShares: 0 });

  const { safeWithdrawSbtc, safeWithdrawStx, fetchUserPosition, fetchVaultBalances } = useVault();
  const { address, connected } = useWallet();
  const [vaultIdle, setVaultIdle] = useState({ sbtc: 0, stx: 0 });

  const loadData = useCallback(async () => {
    const [balances] = await Promise.all([fetchVaultBalances()]);
    setVaultIdle({ sbtc: balances.idleSbtc, stx: balances.idleStx });
    if (connected && address) {
      const pos = await fetchUserPosition(address);
      setUserPosition(pos);
    }
  }, [connected, address, fetchUserPosition, fetchVaultBalances]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !connected) return;
    setIsPending(true);
    setTxStatus(null);
    try {
      const uAmount = Math.floor(Number(amount) * 1_000_000);
      if (activeAsset === "sbtc") {
        await safeWithdrawSbtc(uAmount);
      } else {
        await safeWithdrawStx(uAmount);
      }
      setTxStatus({ type: "success", message: "Emergency withdrawal broadcast. Confirm in your wallet." });
      setAmount("");
      setTimeout(() => loadData(), 3000);
    } catch (e) {
      setTxStatus({ type: "error", message: e instanceof Error ? e.message : "Withdrawal failed. Please try again." });
    } finally {
      setIsPending(false);
    }
  };

  const maxShares = activeAsset === "sbtc" ? userPosition.sbtcShares : userPosition.stxShares;
  const idleAvailable = activeAsset === "sbtc" ? vaultIdle.sbtc : vaultIdle.stx;
  const assetLabel = activeAsset === "sbtc" ? "sBTC" : "STX";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-destructive flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8" />
          Emergency Safe Mode
        </h1>
        <p className="text-muted-foreground">
          Bypass complex protocol strategies and exit your position directly from idle vault liquidity.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <Card className="md:col-span-3 border-destructive/20 bg-destructive/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-destructive/10 blur-[100px] rounded-full pointer-events-none" />
          <CardHeader>
            <CardTitle>Safe Withdrawal</CardTitle>
            <CardDescription className="text-white/60">
              Only use this if normal withdrawals are failing or strategies are paused.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2 relative z-10">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Asset to withdraw</label>
              <div className="flex gap-2">
                <button
                  id="safe-asset-sbtc"
                  onClick={() => { setActiveAsset("sbtc"); setAmount(""); setTxStatus(null); }}
                  className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${activeAsset === "sbtc" ? "border-destructive/50 bg-destructive/10 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"}`}
                >
                  sBTC
                </button>
                <button
                  id="safe-asset-stx"
                  onClick={() => { setActiveAsset("stx"); setAmount(""); setTxStatus(null); }}
                  className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${activeAsset === "stx" ? "border-destructive/50 bg-destructive/10 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"}`}
                >
                  STX
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 flex justify-between text-white/80">
                Shares to burn
                <span className="text-white/50 text-xs font-mono">
                  Max: {connected ? (maxShares / 1_000_000).toFixed(4) : "0.0000"} shares
                </span>
              </label>
              <div className="relative">
                <Input
                  id="safe-amount-input"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-mono h-14 bg-black/60 border-destructive/30 pr-24 text-white"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
                  {maxShares > 0 && (
                    <button
                      id="safe-btn-max"
                      className="h-8 text-xs px-2 text-destructive hover:text-destructive/80 transition-colors"
                      onClick={() => setAmount((maxShares / 1_000_000).toFixed(6))}
                    >
                      MAX
                    </button>
                  )}
                  <span className="text-white/50 font-medium text-xs">shares</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowLeftRight className="h-5 w-5 text-destructive/50 rotate-90" />
            </div>

            <div className="p-4 rounded-lg bg-black/60 border border-destructive/20 flex justify-between items-center">
              <span className="text-sm font-medium text-white/80">You receive directly</span>
              <span className="text-xl font-mono text-white">
                {amount || "0.0000"} <span className="text-sm text-muted-foreground ml-1">{assetLabel}</span>
              </span>
            </div>

            <AnimatePresence>
              {txStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-start gap-3 p-3 rounded-lg text-sm ${txStatus.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-destructive/10 border border-destructive/20 text-red-400"}`}
                >
                  {txStatus.type === "success"
                    ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  }
                  <span>{txStatus.message}</span>
                  {txStatus.txId && (
                    <a
                      href={`https://explorer.hiro.so/txid/${txStatus.txId}?chain=mainnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              id="btn-safe-withdraw"
              variant="destructive"
              className="w-full h-12 text-base shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-destructive-foreground/20 font-bold"
              disabled={isPending || !connected || !amount || Number(amount) <= 0}
              onClick={handleWithdraw}
            >
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Confirm Emergency Withdrawal
            </Button>

            {!connected && (
              <p className="text-xs text-center text-muted-foreground">Connect your wallet to use emergency exit</p>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-500 flex items-center text-lg">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Liquidity Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 leading-relaxed">
                Safe withdrawal only draws from idle vault liquidity, not from deployed strategies. You can only withdraw
                up to the idle amount currently sitting in the vault contract.
              </p>
              <Separator className="my-4 bg-orange-500/20" />
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Idle {assetLabel} in Vault</span>
                  <span className="font-mono text-white">{(idleAvailable / 1_000_000).toFixed(4)} {assetLabel}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Your {assetLabel} Shares</span>
                  <span className="font-mono text-white">{connected ? (maxShares / 1_000_000).toFixed(4) : "---"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Max Withdrawable</span>
                  <span className="font-mono text-emerald-400">
                    {connected
                      ? (Math.min(maxShares, idleAvailable) / 1_000_000).toFixed(4)
                      : "---"
                    } {assetLabel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-white/5">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">What happens</h3>
              <ol className="space-y-3 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-xs font-bold text-destructive shrink-0 mt-0.5">1</span>
                  Your share tokens are burned from your wallet.
                </li>
                <li className="flex gap-2">
                  <span className="text-xs font-bold text-destructive shrink-0 mt-0.5">2</span>
                  {assetLabel} is sent directly from vault idle reserves to your address.
                </li>
                <li className="flex gap-2">
                  <span className="text-xs font-bold text-destructive shrink-0 mt-0.5">3</span>
                  Strategy unrolling logic is bypassed entirely.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
