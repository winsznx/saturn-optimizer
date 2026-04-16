"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  resetMs?: number;
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, value, resetMs = 1500, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleClick = React.useCallback(async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }, [value]);

    React.useEffect(() => {
      if (!copied) return;
      const id = window.setTimeout(() => setCopied(false), resetMs);
      return () => window.clearTimeout(id);
    }, [copied, resetMs]);

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground",
          className
        )}
        {...props}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    );
  }
);
CopyButton.displayName = "CopyButton";

export { CopyButton };
