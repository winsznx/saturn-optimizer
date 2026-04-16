"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDismiss?: () => void;
  tone?: "info" | "warning" | "success" | "danger";
}

const TONE_CLASSES: Record<NonNullable<BannerProps["tone"]>, string> = {
  info: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  danger: "border-destructive/40 bg-destructive/10 text-destructive",
};

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, children, tone = "info", onDismiss, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "relative flex items-start gap-3 rounded-md border px-4 py-3 text-sm",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="rounded p-1 hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
);
Banner.displayName = "Banner";

export { Banner };
