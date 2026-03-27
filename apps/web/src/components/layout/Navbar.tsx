"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SaturnLogo } from "@/components/ui/saturn-logo";
import { useWallet } from "@/lib/wallet";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const { connected, address, stxBalance, connect, disconnect } = useWallet();

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SaturnLogo className="h-7 w-7" />
          <Link href="/" className="font-bold text-xl tracking-tight">
            Saturn<span className="text-primary">Optimizer</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {!isDashboard && (
            <>
              <Link href="#features" className="text-muted-foreground hover:text-white transition-colors">
                Security Model
              </Link>
              <Link href="#integrations" className="text-muted-foreground hover:text-white transition-colors">
                Integrations
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isDashboard ? (
            <div className="flex items-center gap-4">
              {connected ? (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium">{stxBalance} STX</span>
                    <span className="text-xs text-muted-foreground">{truncateAddress(address)}</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20" onClick={disconnect}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button variant="glass" size="sm" className="border border-primary/50 bg-primary/20 hover:bg-primary/40" onClick={connect}>
                  Connect Wallet
                </Button>
              )}
            </div>
          ) : (
            <Link href="/dashboard">
              <Button variant="glass" className="border border-primary/50 bg-primary/20 hover:bg-primary/40">
                Launch App
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
