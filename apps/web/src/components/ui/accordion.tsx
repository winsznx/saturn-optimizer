"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  value: string;
  title: string;
  children: React.ReactNode;
}

export function AccordionItem({ value, title, children }: AccordionItemProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-white/10" data-value={value}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-foreground hover:text-primary"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <div className="pb-3 text-sm text-muted-foreground">{children}</div>
      ) : null}
    </div>
  );
}

export function Accordion({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}
