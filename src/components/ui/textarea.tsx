import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={!!error}
        className={cn(
          "flex min-h-[80px] w-full rounded-[8px] border bg-white dark:bg-[#181d28] px-3 py-2 text-sm shadow-xs transition-colors",
          "placeholder:text-[#64748B] dark:placeholder:text-slate-500",
          "text-[#171717] dark:text-slate-100",
          "border-[#E8E8E8] dark:border-[#262d3d]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F]/30 focus-visible:border-[#FF5A1F]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500 dark:border-red-500",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;
