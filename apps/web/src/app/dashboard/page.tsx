"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck, Activity, LineChart, Wallet, ShieldAlert, PauseCircle } from "lucide-react";
import { useGovernance, useToken } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";
import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const { fetchPauseState } = useGovernance();
  const { fetchTotalSupply, fetchBalance } = useToken();
  const { address, connected } = useWallet();

  const [isPaused, setIsPaused] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchPauseState().then(setIsPaused);
    fetchTotalSupply().then(setTotalSupply);
    if (connected && address) {
      fetchBalance(address).then(setBalance);
    }
  }, [connected, address, fetchPauseState, fetchTotalSupply, fetchBalance]);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Vault Overview</h1>
        <p className="text-muted-foreground">Monitor your exposure and vault health in real-time.</p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card glass className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs font-semibold uppercase tracking-wider">
              Total Managed Balance <Wallet className="h-3 w-3 ml-2" />
            </CardDescription>
            <CardTitle className="text-4xl font-mono mt-2 flex items-baseline gap-2">
              {connected ? (totalSupply > 0 ? (totalSupply / 1_000_000).toFixed(3) : "0.000") : "---"}
              <span className="text-lg text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 rounded-md">sBTC</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-sm font-medium flex items-center mt-2 ${connected ? 'text-emerald-400' : 'text-muted-foreground'}`}>
              <ArrowUpRight className="h-4 w-4 mr-1" /> {connected ? "+0.00% this week" : "Connect to view stats"}
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs font-semibold uppercase tracking-wider">
              Implied User Claim <Activity className="h-3 w-3 ml-2" />
            </CardDescription>
            <CardTitle className="text-4xl font-mono mt-2 flex items-baseline gap-2">
              {connected ? (balance / 1_000_000).toFixed(3) : "---"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mt-2">
              Saturn sBTC Shares <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 ml-2">SIP-010</span>
            </div>
          </CardContent>
        </Card>

        <Card glass className="relative overflow-hidden group border-white/5 hover:border-white/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent z-0" />
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="flex items-center text-xs font-semibold uppercase tracking-wider">
              Strategy Status <ShieldCheck className="h-3 w-3 ml-2 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl mt-2 flex items-center">
              {isPaused ? (
                <span className="text-orange-500 flex items-center">Paused <PauseCircle className="h-5 w-5 ml-2" /></span>
              ) : (
                <>Active <span className="h-2 w-2 rounded-full bg-emerald-500 ml-3 animate-pulse"></span></>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-sm mt-4 flex justify-between items-center ${connected ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
              <span>Next Harvest Route:</span>
              <span className="font-mono text-white/50">{connected ? "Awaiting Deposits" : "---"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Exposure & Approvals */}
      <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center">
        <LineChart className="h-5 w-5 mr-2 text-primary" /> Strategy Exposure
      </h2>
      <div className="mb-8">
        {!connected ? (
          <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-white/5 rounded-xl border-dashed">
            <Wallet className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white/80">Wallet Disconnected</h3>
            <p className="text-sm text-muted-foreground">Connect your wallet to view active protocol positions</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-white/5 rounded-xl border-dashed">
            <Activity className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white/80">No Active Positions</h3>
            <p className="text-sm text-muted-foreground">Deposit assets to see strategy exposure metrics</p>
          </div>
        )}
      </div>

      {/* Safe Mode Controls */}
      <Card className="border-destructive/30 bg-destructive/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-destructive/10 blur-[100px] rounded-full pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2" /> Safe Mode Withdrawal
          </CardTitle>
          <CardDescription className="text-destructive/80 max-w-2xl">
            If a protocol fails or the operator pauses the main strategies, you can bypass the router logic and withdraw idle vault assets directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-destructive/20 mt-2">
             <div className="flex flex-col">
               <span className="text-sm font-medium text-white">Available Idle Liquidity</span>
               <span className="text-2xl font-mono text-destructive tracking-widest mt-1">
                 {connected ? (balance / 1_000_000).toFixed(3) : "0.000"} <span className="text-sm">sBTC</span>
               </span>
             </div>
             <a href="/dashboard/safe-withdraw">
               <Button variant="destructive" className="px-8 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] border border-destructive-foreground/20">
                 Emergency Exit
               </Button>
             </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
