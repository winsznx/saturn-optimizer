import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck, Activity, LineChart, Wallet, ShieldAlert } from "lucide-react";

export default function DashboardOverview() {
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
              4.285 
              <span className="text-lg text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 rounded-md">sBTC</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-emerald-400 flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 mr-1" /> +0.15% this week
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs font-semibold uppercase tracking-wider">
              Implied User Claim <Activity className="h-3 w-3 ml-2" />
            </CardDescription>
            <CardTitle className="text-4xl font-mono mt-2">1,024</CardTitle>
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
              Active <span className="h-2 w-2 rounded-full bg-emerald-500 ml-3 animate-pulse"></span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-sm text-muted-foreground mt-4 flex justify-between items-center">
              <span>Next Harvest Route:</span>
              <span className="font-mono text-white">StackingDAO</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Exposure & Approvals */}
      <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center">
        <LineChart className="h-5 w-5 mr-2 text-primary" /> Strategy Exposure
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zest Earn</CardTitle>
            <CardDescription>Supplied sBTC</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-mono">2.100 sBTC</span>
              <span className="text-sm text-emerald-400">49% Allocation</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[49%]"></div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-muted-foreground">
              <span>Adapter Permit</span>
              <span className="text-emerald-400 font-medium">Valid</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">BitFlow Pools</CardTitle>
            <CardDescription>sBTC / stSTX</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-mono">1.835 sBTC</span>
              <span className="text-sm text-blue-400">42% Allocation</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full w-[42%]"></div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-muted-foreground">
              <span>Adapter Permit</span>
              <span className="text-emerald-400 font-medium">Valid</span>
            </div>
          </CardContent>
        </Card>
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
               <span className="text-2xl font-mono text-destructive tracking-widest mt-1">0.350 sBTC</span>
             </div>
             <Button variant="destructive" className="px-8 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] border border-destructive-foreground/20">
               Emergency Exit
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
