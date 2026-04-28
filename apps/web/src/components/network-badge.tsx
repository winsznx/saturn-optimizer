import * as React from "react";
import { cn } from "@/lib/utils";
import { STACKS_NETWORK } from "@/lib/contracts";

const TONE = {
  mainnet: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  testnet: "border-amber-500/30 bg-amber-500/10 text-amber-300",
} as const;

export interface NetworkBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  network?: "mainnet" | "testnet";
}

export function NetworkBadge({ className, network = STACKS_NETWORK, ...props }: NetworkBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        TONE[network],
        className
      )}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {network}
    </span>
  );
}
