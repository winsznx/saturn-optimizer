import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "pulse";
}

const badgeVariants = {
  default:
    "inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm",
  secondary:
    "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-foreground",
  destructive:
    "inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive",
  outline:
    "inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-sm font-medium text-foreground",
  pulse:
    "inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-sm",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants[variant], className)} {...props} />
  )
}
