"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

const sidePos = {
  top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
  bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  left: "right-full mr-2 top-1/2 -translate-y-1/2",
  right: "left-full ml-2 top-1/2 -translate-y-1/2",
};

export function Tooltip({
  children,
  content,
  side = "top",
  className,
  ...props
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      {children}
      {open ? (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-white/10 bg-background px-2 py-1 text-xs text-foreground shadow-lg",
            sidePos[side]
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
