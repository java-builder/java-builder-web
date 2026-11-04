import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        aria-invalid={!!error}
        className={cn(
          "flex h-9 w-full rounded-xl border bg-surface px-3 py-1 text-sm shadow-xs transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-900 dark:file:text-slate-100",
          "placeholder:text-text-muted dark:placeholder:text-slate-500",
          "text-foreground",
          "border-border",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500 dark:border-red-500",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
