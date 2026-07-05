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

  // Đối với size === "lg" hoặc mặc định (tải trang), ta render Skeleton chuyên nghiệp thay vì loading spinner
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      
      {/* Body content skeleton (danh sách dòng) */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 items-center py-4 border-b border-border/40 last:border-0 last:pb-0 first:pt-0">
            <div className="w-10 h-10 rounded bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
            <div className="w-16 h-6 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
