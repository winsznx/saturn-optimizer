"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck, Activity, LineChart, Wallet, ShieldAlert, PauseCircle, ExternalLink } from "lucide-react";
import { useGovernance, useVault } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DEPLOYER } from "@/lib/contracts";

interface VaultBalances {
  idleSbtc: number;
  idleStx: number;
  managedSbtc: number;
  managedStx: number;
  managedStstx: number;
}

interface UserPosition {
  sbtcShares: number;
  stxShares: number;
}

export default function DashboardOverview() {
  const { fetchPauseState } = useGovernance();
  const { fetchVaultBalances, fetchTotalShares, fetchUserPosition } = useVault();
  const { address, connected } = useWallet();

  const [isPaused, setIsPaused] = useState(false);
  const [totalShares, setTotalShares] = useState({ sbtc: 0, stx: 0 });
  const [vaultBalances, setVaultBalances] = useState<VaultBalances>({
    idleSbtc: 0, idleStx: 0, managedSbtc: 0, managedStx: 0, managedStstx: 0,
  });
  const [userPosition, setUserPosition] = useState<UserPosition>({ sbtcShares: 0, stxShares: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [paused, shares, balances] = await Promise.all([
        fetchPauseState(),
        fetchTotalShares(),
        fetchVaultBalances(),
      ]);
      setIsPaused(paused);
      setTotalShares(shares);
      setVaultBalances(balances);
      setLoading(false);
    }
    loadData();
  }, [fetchPauseState, fetchTotalShares, fetchVaultBalances]);

  useEffect(() => {
    if (connected && address) {
      fetchUserPosition(address).then(setUserPosition);
    } else {
      Promise.resolve().then(() => {
        setUserPosition(prev => 
          prev.sbtcShares === 0 && prev.stxShares === 0 
            ? prev 
            : { sbtcShares: 0, stxShares: 0 }
        );
      });
    }
  }, [connected, address, fetchUserPosition]);

  const totalManaged = vaultBalances.managedSbtc + vaultBalances.idleSbtc;

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Vault Overview</h1>
          <p className="text-muted-foreground">Monitor your exposure and vault health in real-time.</p>
        </div>
        <a
          href={`https://explorer.hiro.so/address/${DEPLOYER}?chain=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-white/10 rounded-md px-3 py-2 w-max"
        >
          <ExternalLink className="h-3 w-3" />
          View Contracts
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card glass className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs font-semibold uppercase tracking-wider">
              Total Managed <Wallet className="h-3 w-3 ml-2" />
            </CardDescription>
            <CardTitle className="text-4xl font-mono mt-2 flex items-baseline gap-2">
              {loading ? (
                <span className="text-muted-foreground text-2xl animate-pulse">...</span>
              ) : (
                <>{(totalManaged / 1_000_000).toFixed(4)}</>
              )}
              <span className="text-lg text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 rounded-md">sBTC</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium flex items-center mt-2 text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Idle: {(vaultBalances.idleSbtc / 1_000_000).toFixed(4)} sBTC
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs font-semibold uppercase tracking-wider">
              Your sBTC Position <Activity className="h-3 w-3 ml-2" />
            </CardDescription>
            <CardTitle className="text-4xl font-mono mt-2 flex items-baseline gap-2">
              {connected ? (
                <>{(userPosition.sbtcShares / 1_000_000).toFixed(4)}</>
              ) : (
                <span className="text-muted-foreground">---</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mt-2 flex items-center justify-between">
              <span>STX Shares</span>
              <span className="font-mono text-xs">{connected ? (userPosition.stxShares / 1_000_000).toFixed(4) : "---"}</span>
            </div>
          </CardContent>
        </Card>

        <Card glass className="relative overflow-hidden group border-white/5 hover:border-white/20 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent z-0" />
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="flex items-center text-xs font-semibold uppercase tracking-wider">
              Strategy Status <ShieldCheck className="h-3 w-3 ml-2 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl mt-2 flex items-center">
              {loading ? (
                <span className="text-muted-foreground animate-pulse">Loading...</span>
              ) : isPaused ? (
                <span className="text-orange-500 flex items-center">Paused <PauseCircle className="h-5 w-5 ml-2" /></span>
              ) : (
                <>Active <span className="h-2 w-2 rounded-full bg-emerald-500 ml-3 animate-pulse" /></>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-sm mt-4 flex justify-between items-center text-muted-foreground">
              <span>Total sBTC Shares:</span>
              <span className="font-mono text-white/50">{(totalShares.sbtc / 1_000_000).toFixed(4)}</span>
            </div>
            <div className="text-sm mt-1 flex justify-between items-center text-muted-foreground">
              <span>Total STX Shares:</span>
              <span className="font-mono text-white/50">{(totalShares.stx / 1_000_000).toFixed(4)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center">
        <LineChart className="h-5 w-5 mr-2 text-primary" /> Strategy Exposure
      </h2>
      <div className="mb-8">
        {!connected ? (
          <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-white/5 rounded-xl border-dashed">
            <Wallet className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white/80">Wallet Disconnected</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect your wallet to view active protocol positions</p>
          </div>
        ) : vaultBalances.managedSbtc === 0 && vaultBalances.managedStx === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-white/5 rounded-xl border-dashed">
            <Activity className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white/80">No Active Positions</h3>
            <p className="text-sm text-muted-foreground mb-4">Deposit assets to see strategy exposure metrics</p>
            <Link href="/dashboard/deposit">
              <Button size="sm">Deposit Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Managed sBTC</span>
              <span className="font-mono text-sm text-white">{(vaultBalances.managedSbtc / 1_000_000).toFixed(4)} sBTC</span>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Managed STX</span>
              <span className="font-mono text-sm text-white">{(vaultBalances.managedStx / 1_000_000).toFixed(4)} STX</span>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Managed stSTX</span>
              <span className="font-mono text-sm text-white">{(vaultBalances.managedStstx / 1_000_000).toFixed(4)} stSTX</span>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Idle STX</span>
              <span className="font-mono text-sm text-white">{(vaultBalances.idleStx / 1_000_000).toFixed(4)} STX</span>
            </div>
          </div>
        )}
      </div>

      <Card className="border-destructive/30 bg-destructive/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-destructive/10 blur-[100px] rounded-full pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2" /> Safe Mode Withdrawal
          </CardTitle>
          <CardDescription className="text-destructive/80 max-w-2xl">
            If a protocol fails or the operator pauses the main strategies, bypass the router logic and withdraw idle vault assets directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-black/40 border border-destructive/20 mt-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Your sBTC Shares</span>
              <span className="text-2xl font-mono text-destructive tracking-widest mt-1">
                {connected ? (userPosition.sbtcShares / 1_000_000).toFixed(4) : "0.0000"}{" "}
                <span className="text-sm">shares</span>
              </span>
            </div>
            <Link href="/dashboard/safe-withdraw">
              <Button
                variant="destructive"
                className="px-8 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] border border-destructive-foreground/20"
              >
                Emergency Exit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
