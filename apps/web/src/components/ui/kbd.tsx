import * as React from "react";
import { cn } from "@/lib/utils";

const Kbd = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-white/15 bg-white/5 px-1 font-mono text-[10px] font-medium text-foreground/80",
      className
    )}
    {...props}
  />
));
Kbd.displayName = "Kbd";

export { Kbd };
