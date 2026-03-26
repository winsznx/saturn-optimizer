"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, AlertTriangle, ArrowLeftRight } from "lucide-react";

export default function SafeWithdrawPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-destructive flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8" />
          Emergency Safe Mode
        </h1>
        <p className="text-muted-foreground">Bypass complex protocol strategies and exit your position directly from idle vault liquidity.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Main Action Panel */}
        <Card className="md:col-span-3 border-destructive/20 bg-destructive/5 relative overflow-hidden glass-panel">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-destructive/10 blur-[100px] rounded-full pointer-events-none" />
          <CardHeader>
            <CardTitle>Safe Withdrawal Execute</CardTitle>
            <CardDescription className="text-white/60">
              Only use this if normal withdrawals are failing or if the specific sub-protocol is paused.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 flex justify-between text-white/80">
                Amount to burn
                <span className="text-white/50 text-xs font-mono">Max: 1,024 Shares</span>
              </label>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="text-2xl font-mono h-14 bg-black/60 border-destructive/30 pr-24 text-white"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-xs px-2 text-destructive hover:bg-destructive/20 hover:text-destructive">MAX</Button>
                  <span className="text-white/50 font-medium text-xs">SIP-010</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowLeftRight className="h-5 w-5 text-destructive/50 rotate-90" />
            </div>

            <div className="p-4 rounded-lg bg-black/60 border border-destructive/20 flex justify-between items-center">
              <span className="text-sm font-medium text-white/80">You receive directly</span>
              <span className="text-xl font-mono text-white">0.350 <span className="text-sm text-muted-foreground ml-1">sBTC</span></span>
            </div>

            <Button variant="destructive" className="w-full h-12 text-base shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-destructive-foreground/20 font-bold">
              Confirm Emergency Withdrawal
            </Button>
          </CardContent>
        </Card>

        {/* Status Panel */}
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
                Because this bypasses the standard unrolling logic, 
                you can only withdraw up to the amount of idle liquidity currently sitting untouched in the primary vault contract.
              </p>
              <div className="mt-4 pt-4 border-t border-orange-500/20">
                 <div className="flex justify-between items-center text-sm mb-2">
                   <span className="text-white/60">Total Vault Idle sBTC</span>
                   <span className="font-mono text-white">0.350 sBTC</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-white/60">Your Max Eligible Claim</span>
                   <span className="font-mono text-white">4.200 sBTC</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
