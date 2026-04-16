import * as React from "react";
import { cn } from "@/lib/utils";

const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 -m-px",
      className
    )}
    style={{ clip: "rect(0 0 0 0)", clipPath: "inset(50%)" }}
    {...props}
  />
));
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
