"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblings?: number;
}

function pageRange(current: number, total: number, siblings: number): number[] {
  const start = Math.max(1, current - siblings);
  const end = Math.min(total, current + siblings);
  const pages: number[] = [];
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
}

export function Pagination({
  className,
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  ...props
}: PaginationProps) {
  const pages = pageRange(page, pageCount, siblings);
  const isFirst = page <= 1;
  const isLast = page >= pageCount;
  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-foreground/80 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm",
            p === page
              ? "bg-primary text-primary-foreground"
              : "border border-white/10 text-foreground/80 hover:bg-white/5"
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-foreground/80 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
