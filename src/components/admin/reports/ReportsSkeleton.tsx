export const ReportsSkeleton = () => {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2 flex-grow">
          <div className="h-7 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <div className="h-10 bg-muted rounded w-32 shrink-0" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-5 space-y-3 h-28"
          />
        ))}
      </div>

      {/* Charts Skeleton: Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-6 h-96" />
        <div className="bg-surface border border-border rounded-2xl p-6 h-96" />
      </div>

      {/* Charts Skeleton: Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-6 h-96" />
        <div className="bg-surface border border-border rounded-2xl p-6 h-96" />
      </div>
    </div>
  );
};
