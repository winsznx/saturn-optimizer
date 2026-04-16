import * as React from "react"
import { cn } from "@/lib/utils"

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "pulse";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const BASE =
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "border border-primary/30 bg-primary/10 text-primary",
  secondary: "border border-white/10 bg-white/5 text-foreground",
  destructive:
    "border border-destructive/30 bg-destructive/10 text-xs text-destructive",
  outline: "border border-white/20 text-foreground",
  pulse: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(BASE, VARIANT_CLASSES[variant], className)}
      {...props}
    />
  );
}
