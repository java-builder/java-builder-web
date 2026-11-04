import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export function FormField({
  label,
  error,
  description,
  required,
  children,
  className,
  id,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-900 dark:text-slate-200"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
