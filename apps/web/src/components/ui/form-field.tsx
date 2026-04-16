import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  helper?: string;
  error?: string;
}

export function FormField({
  className,
  label,
  htmlFor,
  helper,
  error,
  children,
  ...props
}: FormFieldProps) {
  const describedById = error
    ? `${htmlFor}-error`
    : helper
      ? `${htmlFor}-helper`
      : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={describedById} className="text-xs text-destructive">
          {error}
        </p>
      ) : helper ? (
        <p id={describedById} className="text-xs text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
