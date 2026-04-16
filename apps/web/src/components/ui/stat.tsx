import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  delta?: React.ReactNode;
  trend?: "up" | "down" | "flat";
}

const TREND_COLOR: Record<NonNullable<StatProps["trend"]>, string> = {
  up: "text-emerald-400",
  down: "text-rose-400",
  flat: "text-muted-foreground",
};

export function Stat({
  className,
  label,
  value,
  delta,
  trend = "flat",
  ...props
}: StatProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.02] p-4",
        className
      )}
      {...props}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {delta !== undefined ? (
        <p className={cn("mt-1 text-xs font-medium", TREND_COLOR[trend])}>
          {delta}
        </p>
      ) : null}
    </div>
  );
}
