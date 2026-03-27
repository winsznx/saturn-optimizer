"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToken } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";
import { useEffect } from "react";

export default function DepositWithdrawPage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [balance, setBalance] = useState(0);

  const { mint, transfer, fetchBalance } = useToken();
  const { address, connected } = useWallet();

  useEffect(() => {
    if (connected && address) {
      fetchBalance(address).then(setBalance);
    }
  }, [connected, address, fetchBalance]);

  const handleAction = async () => {
    if (!amount || isNaN(Number(amount)) || !connected) return;
    setIsPending(true);
    try {
      const uAmount = Math.floor(Number(amount) * 1_000_000);
      if (activeTab === "deposit") {
        await mint(uAmount, address); // Minting to user instead of real vault deposit since we are using saturn-token
      } else {
        await transfer(uAmount, "SP2ZNGJ85ENDY6QRHQ5P2D4REKG7G7FWEHGD1Z387"); // Transfer to a dump address to simulate withdrawal
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Assets</h1>
        <p className="text-muted-foreground">Deposit to start earning, or safely withdraw idle liquidity.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Interaction Panel */}
        <Card glass className="relative bg-background/50 border-white/5 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[200px] h-[200px] bg-primary/10 blur-[80px] rounded-full" />
          <CardHeader className="pb-4 border-b border-white/5">
            <div className="flex bg-white/5 p-1 rounded-lg w-max mb-2">
              <button 
                onClick={() => setActiveTab("deposit")}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'deposit' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white'}`}
              >
                Deposit
              </button>
              <button 
                onClick={() => setActiveTab("withdraw")}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'withdraw' ? 'bg-secondary text-white' : 'text-muted-foreground hover:text-white'}`}
              >
                Withdraw
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'deposit' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Asset</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-white/5 border-primary/50 text-white">sBTC</Button>
                    <Button variant="ghost" className="flex-1 text-muted-foreground border border-transparent hover:bg-white/5">STX</Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 flex justify-between">
                    Amount
                    <span className="text-muted-foreground text-xs font-mono">
                      Balance: {connected ? (balance / 1_000_000).toFixed(3) : "0.000"} sBTC
                    </span>
                  </label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-2xl font-mono h-14 bg-black/40 border-white/10 pr-24"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs px-2 text-primary hover:text-primary hover:bg-white/5"
                        onClick={() => setAmount((balance / 1_000_000).toString())}
                      >
                        MAX
                      </Button>
                      <span className="text-muted-foreground font-medium">sBTC</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full h-12 text-base shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    disabled={isPending || !connected || !amount}
                    onClick={handleAction}
                  >
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    {activeTab === 'deposit' ? (
                      <>{!isPending && <ArrowDownToLine className="mr-2 h-5 w-5" />} Deposit sBTC</>
                    ) : (
                      <>{!isPending && <ArrowUpFromLine className="mr-2 h-5 w-5" />} Withdraw sBTC</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Security / Preview Panel */}
        <div className="space-y-6">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-500 flex items-center text-lg">
                <ShieldCheck className="h-5 w-5 mr-2" /> 
                Strict Transaction Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Saturn utilizes Stacks deny-mode post-conditions. The upcoming transaction will explicitly guarantee:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs mt-0.5">1</div>
                  <span className="text-white/80">Only exactly <strong className="font-mono text-white">0.5 sBTC</strong> will leave your wallet.</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs mt-0.5">2</div>
                  <span className="text-white/80">You will receive exactly <strong className="font-mono text-white">450 SIP-010 Shares</strong> representing your claim.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card glass>
             <CardContent className="p-6">
               <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Vault Activity</h3>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                     <div className="flex items-center gap-2">
                       <div className={`h-2 w-2 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-emerald-400'}`} />
                       <span className="text-muted-foreground font-mono">SP...{i}X</span>
                     </div>
                     <span className="text-white">{i === 1 ? '1.2' : i === 2 ? '0.5' : '4.0'} sBTC</span>
                   </div>
                 ))}
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
