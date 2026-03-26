import { Navbar } from "@/components/layout/Navbar";
import { Copy, LayoutDashboard, Wallet, ShieldAlert, FileText, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden container mx-auto px-4">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-white/10 pr-6 py-8">
          <div className="mb-8">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3 relative">
              Your Position
            </h2>
            <nav className="space-y-1">
              <SidebarItem href="/dashboard" icon={<LayoutDashboard />} label="Overview" active />
              <SidebarItem href="/dashboard/deposit" icon={<Wallet />} label="Deposit & Withdraw" />
              <SidebarItem href="/dashboard/swap" icon={<ArrowLeftRight />} label="Swap Assets" />
            </nav>
          </div>

          <div className="mb-8 relative">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3 flex items-center justify-between">
              Safe Mode 
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            </h2>
            <nav className="space-y-1">
              <SidebarItem href="/dashboard/safe-withdraw" icon={<ShieldAlert />} label="Emergency Exit" className="text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-400" />
            </nav>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="px-3 rounded-lg border border-white/5 bg-white/5 p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs text-muted-foreground mb-1 relative z-10">Vault Address</div>
              <div className="flex items-center gap-2 text-sm font-medium font-mono truncate relative z-10">
                <span className="truncate">SP2ZNGJ85ENDY6QRHQ...</span>
                <Copy className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer shrink-0" />
              </div>
            </div>
            <div className="mt-4 px-3">
              <Link href="#" className="flex items-center text-xs text-muted-foreground hover:text-white transition-colors">
                <FileText className="h-3 w-3 mr-2" />
                Read the Spec
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto py-8 md:pl-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ 
  href, 
  icon, 
  label, 
  active,
  className = ""
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  className?: string;
}) {
  return (
    <Link href={href}>
      <span
        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
          active 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        } ${className}`}
      >
        <span className="h-4 w-4 shrink-0">{icon}</span>
        {label}
      </span>
    </Link>
  );
}
