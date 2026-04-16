import * as React from "react";
import { cn } from "@/lib/utils";

export interface DataListItem {
  label: string;
  value: React.ReactNode;
}

export interface DataListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DataListItem[];
}

export function DataList({ className, items, ...props }: DataListProps) {
  return (
    <dl
      className={cn(
        "divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02]",
        className
      )}
      {...props}
    >
      {items.map((item, idx) => (
        <div
          key={`${item.label}-${idx}`}
          className="flex items-center justify-between gap-4 px-4 py-3"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-sm font-medium text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
