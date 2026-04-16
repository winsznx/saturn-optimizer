import * as React from "react";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  showIcon?: boolean;
}

const ExternalLink = React.forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ className, showIcon = true, children, ...props }, ref) => (
    <a
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-primary hover:underline",
        className
      )}
      {...props}
    >
      {children}
      {showIcon ? <ExternalLinkIcon className="h-3 w-3" /> : null}
    </a>
  )
);
ExternalLink.displayName = "ExternalLink";

export { ExternalLink };
