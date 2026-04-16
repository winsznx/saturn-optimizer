import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      title = "Something went wrong",
      message,
      action,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center",
        className
      )}
      {...props}
    >
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {message ? (
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  )
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
