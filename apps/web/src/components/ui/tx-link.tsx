import * as React from "react";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildTxLink } from "@/lib/explorer";
import { STACKS_NETWORK } from "@/lib/contracts";

export interface TxLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  txId: string;
  chain?: "mainnet" | "testnet";
  label?: string;
}

function shorten(id: string): string {
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

const TxLink = React.forwardRef<HTMLAnchorElement, TxLinkProps>(
  ({ className, txId, chain = STACKS_NETWORK, label, ...props }, ref) => {
    const href = buildTxLink(txId, chain);
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline",
          className
        )}
        {...props}
      >
        {label ?? shorten(txId)}
        <ExternalLinkIcon className="h-3 w-3" />
      </a>
    );
  }
);
TxLink.displayName = "TxLink";

export { TxLink };
