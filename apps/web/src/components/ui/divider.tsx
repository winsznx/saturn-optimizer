import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, label, ...props }, ref) => {
    if (!label) {
      return (
        <div
          ref={ref}
          role="separator"
          className={cn("h-[1px] w-full bg-white/10", className)}
          {...props}
        />
      );
    }
    return (
      <div
        ref={ref}
        className={cn("relative flex items-center py-2", className)}
        {...props}
      >
        <span className="h-[1px] flex-1 bg-white/10" />
        <span className="px-3 text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="h-[1px] flex-1 bg-white/10" />
      </div>
    );
  }
);
Divider.displayName = "Divider";

export { Divider };
