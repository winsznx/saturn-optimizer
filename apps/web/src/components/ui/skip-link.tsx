import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkipLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string;
}

export function SkipLink({
  className,
  targetId,
  children = "Skip to content",
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
