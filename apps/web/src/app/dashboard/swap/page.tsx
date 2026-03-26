"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Settings, Route } from "lucide-react";

export default function SwapPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Swap Assets</h1>
        <p className="text-muted-foreground">Exchange yield-bearing shares or base assets directly via vault liquidity.</p>
      </div>

      <div className="grid gap-8">
        {/* Swap Iteration */}
        <Card glass className="relative border-white/5 bg-background/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent z-0" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 border-b border-white/5">
            <CardTitle className="text-lg">Swap</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 relative z-10 space-y-2">
            
            {/* From */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
              <div className="text-xs text-muted-foreground mb-2 flex justify-between">
                <span>You pay</span>
                <span>Balance: 12.45 STX</span>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="w-[120px] bg-white/5 border-white/10">STX</Button>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="text-right text-2xl font-mono h-12 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="relative h-6 flex justify-center">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-white/5" />
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-white/10 bg-background relative z-10 text-muted-foreground hover:text-white">
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
              <div className="text-xs text-muted-foreground mb-2 flex justify-between">
                <span>You receive</span>
                <span>Balance: 0.000 sBTC</span>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="w-[120px] bg-white/5 border-primary/50 text-white">sBTC</Button>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  readOnly
                  className="text-right text-2xl font-mono h-12 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 text-muted-foreground"
                />
              </div>
            </div>

            {/* Rate Info */}
            <div className="py-4 text-sm text-muted-foreground flex justify-between items-center">
              <span className="flex items-center gap-1.5"><Route className="h-3 w-3" /> Auto-Router</span>
              <span>1 sBTC = 94,200.5 STX</span>
            </div>

            <Button className="w-full h-12 text-base font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              Connect Wallet to Swap
            </Button>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
