"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Copy, LayoutDashboard, Wallet, ShieldAlert, FileText, ArrowLeftRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import * as motion from "framer-motion/client";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/dashboard/deposit", icon: Wallet, label: "Deposit & Withdraw", exact: false },
  { href: "/dashboard/swap", icon: ArrowLeftRight, label: "Swap Assets", exact: false },
];

const VAULT_ADDR = "SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV";

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const copyVaultAddress = useCallback(() => {
    navigator.clipboard.writeText(VAULT_ADDR);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3">
          Your Position
        </h2>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate}>
                <span
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3 flex items-center justify-between">
          Safe Mode
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </h2>
        <nav className="space-y-1">
          <Link href="/dashboard/safe-withdraw" onClick={onNavigate}>
            <span
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === "/dashboard/safe-withdraw"
                  ? "bg-destructive/20 text-destructive"
                  : "text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-400"
              }`}
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Emergency Exit
            </span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto pt-8 border-t border-white/10">
        <div className="px-3 rounded-lg border border-white/5 bg-white/5 p-4 relative overflow-hidden group cursor-pointer" onClick={copyVaultAddress}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-xs text-muted-foreground mb-1 relative z-10">Vault Contract</div>
          <div className="flex items-center gap-2 text-sm font-medium font-mono truncate relative z-10">
            <span className="truncate">{VAULT_ADDR.slice(0, 8)}...{VAULT_ADDR.slice(-6)}</span>
            <Copy className="h-3 w-3 text-muted-foreground hover:text-primary shrink-0" />
          </div>
        </div>
        <div className="mt-4 px-3">
          <a
            href={`https://explorer.hiro.so/address/${VAULT_ADDR}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-muted-foreground hover:text-white transition-colors"
          >
            <FileText className="h-3 w-3 mr-2" />
            View on Explorer
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden container mx-auto px-4">
        <aside className="hidden md:flex flex-col w-64 border-r border-white/10 pr-6 py-8 shrink-0">
          <SidebarContent pathname={pathname} />
        </aside>

        <main className="flex-1 overflow-y-auto py-8 md:pl-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="md:hidden mb-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-white border border-white/10 rounded-md px-3 py-2 transition-colors"
            >
              <Menu className="h-4 w-4" />
              Navigation
            </button>
          </div>

          {children}
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-72 h-full bg-background border-r border-white/10 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
