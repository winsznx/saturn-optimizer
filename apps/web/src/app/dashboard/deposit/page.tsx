"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVault } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";
import { toMicroUnits, fromMicroUnits, isValidAmount } from "@/lib/format";
import { buildTxLink } from "@/lib/explorer";

import type { Asset, TabMode, TxStatus, UserPosition } from "@/lib/types";

export default function DepositWithdrawPage() {
  const [activeTab, setActiveTab] = useState<TabMode>("deposit");
  const [activeAsset, setActiveAsset] = useState<Asset>("sbtc");
  const isSbtc = activeAsset === "sbtc";
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);
  const [userPosition, setUserPosition] = useState({ sbtcShares: 0, stxShares: 0 });

  const { depositSbtc, depositStx, withdrawSbtc, withdrawStx, fetchUserPosition } = useVault();
  const { address, connected, stxBalance } = useWallet();

  const loadPosition = useCallback(async () => {
    if (connected && address) {
      const pos = await fetchUserPosition(address);
      setUserPosition(pos);
    }
  }, [connected, address, fetchUserPosition]);

  useEffect(() => {
    loadPosition();
  }, [loadPosition]);

  const handleAction = async () => {
    if (!isValidAmount(amount) || !connected) return;
    setIsPending(true);
    setTxStatus(null);
    try {
      const uAmount = toMicroUnits(amount);
      if (activeTab === "deposit") {
        if (activeAsset === "sbtc") {
          await depositSbtc(uAmount);
        } else {
          await depositStx(uAmount);
        }
      } else {
        if (activeAsset === "sbtc") {
          await withdrawSbtc(uAmount);
        } else {
          await withdrawStx(uAmount);
        }
      }
      setTxStatus({ type: "success", message: "Transaction broadcast successfully. Confirm in your wallet." });
      setAmount("");
      setTimeout(() => loadPosition(), 3000);
    } catch (e) {
      setTxStatus({ type: "error", message: e instanceof Error ? e.message : "Transaction failed. Please try again." });
    } finally {
      setIsPending(false);
    }
  };

  const maxBalance = activeTab === "withdraw"
    ? (activeAsset === "sbtc" ? userPosition.sbtcShares : userPosition.stxShares) / 1_000_000
    : activeAsset === "stx" ? Number(stxBalance) : 0;

  const assetLabel = activeAsset === "sbtc" ? "sBTC" : "STX";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Assets</h1>
        <p className="text-muted-foreground">Deposit to start earning, or safely withdraw your vault position.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card glass className="relative bg-background/50 border-white/5 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[200px] h-[200px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          <CardHeader className="pb-4 border-b border-white/5">
            <div className="flex bg-white/5 p-1 rounded-lg w-max mb-2">
              <button
                id="tab-deposit"
                onClick={() => { setActiveTab("deposit"); setTxStatus(null); }}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === "deposit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"}`}
              >
                Deposit
              </button>
              <button
                id="tab-withdraw"
                onClick={() => { setActiveTab("withdraw"); setTxStatus(null); }}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === "withdraw" ? "bg-secondary text-white" : "text-muted-foreground hover:text-white"}`}
              >
                Withdraw
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + activeAsset}
                initial={{ opacity: 0, x: activeTab === "deposit" ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Asset</label>
                    <div className="flex gap-2">
                      <button
                        id="asset-sbtc"
                        onClick={() => { setActiveAsset("sbtc"); setAmount(""); }}
                        className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${activeAsset === "sbtc" ? "border-primary/50 bg-primary/10 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"}`}
                      >
                        sBTC
                      </button>
                      <button
                        id="asset-stx"
                        onClick={() => { setActiveAsset("stx"); setAmount(""); }}
                        className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${activeAsset === "stx" ? "border-primary/50 bg-primary/10 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"}`}
                      >
                        STX
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 flex justify-between">
                      Amount
                      <span className="text-muted-foreground text-xs font-mono">
                        {activeTab === "withdraw"
                          ? `Shares: ${maxBalance.toFixed(4)} ${assetLabel}`
                          : activeAsset === "stx"
                            ? `Balance: ${stxBalance} STX`
                            : "Enter amount"}
                      </span>
                    </label>
                    <div className="relative">
                      <Input
                        id="amount-input"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-2xl font-mono h-14 bg-black/40 border-white/10 pr-28"
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
                        {maxBalance > 0 && (
                          <button
                            id="btn-max"
                            className="h-8 text-xs px-2 text-primary hover:text-primary/80 transition-colors"
                            onClick={() => setAmount(maxBalance.toFixed(6))}
                          >
                            MAX
                          </button>
                        )}
                        <span className="text-muted-foreground font-medium">{assetLabel}</span>
                      </div>
                    </div>
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
                            href={buildTxLink(txStatus.txId)}
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
                    id="btn-action"
                    className="w-full h-12 text-base shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    disabled={isPending || !connected || !amount || Number(amount) <= 0}
                    onClick={handleAction}
                  >
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    {activeTab === "deposit" ? (
                      <>{!isPending && <ArrowDownToLine className="mr-2 h-5 w-5" />} Deposit {assetLabel}</>
                    ) : (
                      <>{!isPending && <ArrowUpFromLine className="mr-2 h-5 w-5" />} Withdraw {assetLabel}</>
                    )}
                  </Button>

                  {!connected && (
                    <p className="text-xs text-center text-muted-foreground">Connect your wallet to interact with the vault</p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-500 flex items-center text-lg">
                <ShieldCheck className="h-5 w-5 mr-2" />
                Strict Post-Condition Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Saturn uses Stacks deny-mode post-conditions. This transaction guarantees:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs mt-0.5">1</div>
                  <span className="text-white/80">
                    Exactly <strong className="font-mono text-white">{amount || "0.00"} {assetLabel}</strong> will leave your wallet.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs mt-0.5">2</div>
                  <span className="text-white/80">
                    {activeTab === "deposit"
                      ? `You will receive vault shares representing your proportional claim.`
                      : `Your shares will be burned and ${assetLabel} returned from idle vault liquidity.`}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card glass>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Your Current Position</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">sBTC Shares</span>
                  <span className="font-mono text-white">{connected ? (userPosition.sbtcShares / 1_000_000).toFixed(4) : "---"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">STX Shares</span>
                  <span className="font-mono text-white">{connected ? (userPosition.stxShares / 1_000_000).toFixed(4) : "---"}</span>
                </div>
                <Separator className="my-4" />
                <div>
                  <CardDescription className="text-xs">
                    Shares represent a proportional claim on vault assets. They are minted on deposit and burned on withdrawal.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
