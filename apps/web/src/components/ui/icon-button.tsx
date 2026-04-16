"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends HTMLMotionProps<"button"> {
  label: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, size = "md", children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-white/10 bg-transparent text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);
IconButton.displayName = "IconButton";

export { IconButton };
