import { Copy, LayoutDashboard, Wallet, ShieldAlert, FileText, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { DEPLOYER_ADDRESS } from "@/lib/contracts";
import { buildAddressLink } from "@/lib/explorer";

export const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/dashboard/deposit", icon: Wallet, label: "Deposit & Withdraw", exact: false },
  { href: "/dashboard/swap", icon: ArrowLeftRight, label: "Swap Assets", exact: false },
];

export function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const copyVaultAddress = useCallback(() => {
    navigator.clipboard.writeText(DEPLOYER_ADDRESS);
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
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
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
          <Link
            href="/dashboard/safe-withdraw"
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/dashboard/safe-withdraw"
                ? "bg-destructive/20 text-destructive"
                : "text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-400"
            }`}
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            Emergency Exit
          </Link>
        </nav>
      </div>

      <div className="mt-auto pt-8 border-t border-white/10">
        <div className="px-3 rounded-lg border border-white/5 bg-white/5 p-4 relative overflow-hidden group cursor-pointer" onClick={copyVaultAddress}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-xs text-muted-foreground mb-1 relative z-10">Vault Contract</div>
          <div className="flex items-center gap-2 text-sm font-medium font-mono truncate relative z-10">
            <span className="truncate">{DEPLOYER_ADDRESS.slice(0, 8)}...{DEPLOYER_ADDRESS.slice(-6)}</span>
            <Copy className="h-3 w-3 text-muted-foreground hover:text-primary shrink-0" />
          </div>
        </div>
        <div className="mt-4 px-3">
          <a
            href={buildAddressLink(DEPLOYER_ADDRESS)}
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
