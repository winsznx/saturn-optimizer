"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SaturnLogo } from "@/components/ui/saturn-logo";
import { truncateAddress } from "@/lib/utils";
import { useWallet } from "@/lib/wallet";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const { connected, address, stxBalance, connect, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                Security
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-white transition-colors">
                Dashboard
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isDashboard ? (
            <div className="flex items-center gap-3">
              {connected ? (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium">{stxBalance} STX</span>
                    <span className="text-xs text-muted-foreground font-mono">{truncateAddress(address)}</span>
                  </div>
                  <Button
                    id="btn-disconnect"
                    variant="outline"
                    size="sm"
                    className="border-white/20"
                    onClick={disconnect}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  id="btn-connect"
                  variant="glass"
                  size="sm"
                  className="border border-primary/50 bg-primary/20 hover:bg-primary/40"
                  onClick={connect}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          ) : (
            <>
              <Link href="/dashboard" className="hidden md:block">
                <Button variant="glass" className="border border-primary/50 bg-primary/20 hover:bg-primary/40">
                  Launch App
                </Button>
              </Link>
              <button
                className="md:hidden text-muted-foreground hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && !isDashboard && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl px-4 py-4 flex flex-col gap-3"
        >
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-white transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Security Model
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-white transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full">Launch App</Button>
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
