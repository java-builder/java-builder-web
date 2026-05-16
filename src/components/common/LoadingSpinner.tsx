"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

export default function LoadingSpinner({
  size,
  className = "",
}: LoadingSpinnerProps) {
  const spinnerSize = size ?? "lg";

  const spinner = (
    <div
      className={`animate-spin rounded-full border-b-2 border-accent ${sizeClasses[spinnerSize]} ${className}`}
      role="status"
      aria-label="Đang tải"
    />
  );

  if (size === "sm" || size === "md") {
    return spinner;
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      {spinner}
    </div>
  );
}
