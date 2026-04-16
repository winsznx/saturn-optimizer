"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  onDismiss?: () => void;
  dismissLabel?: string;
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, children, onDismiss, dismissLabel = "Remove", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="rounded-full p-0.5 hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  )
);
Chip.displayName = "Chip";

export { Chip };
