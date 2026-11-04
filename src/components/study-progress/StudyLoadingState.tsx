"use client";

export default function StudyLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-muted shrink-0" />
          <div className="space-y-2">
            <div className="h-7 w-56 rounded-lg bg-muted" />
            <div className="h-4 w-72 rounded bg-muted" />
          </div>
        </div>
        <div className="h-16 w-full max-w-md rounded-2xl bg-surface border border-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-5">
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-border bg-surface"
              />
            ))}
          </div>

          {/* Filter skeleton */}
          <div className="h-36 rounded-2xl border border-border bg-surface" />

          {/* Timeline skeleton */}
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-14 w-20 shrink-0 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-28 rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="h-72 rounded-2xl border border-border bg-surface" />
          <div className="h-64 rounded-2xl border border-border bg-surface" />
        </div>
      </div>
    </div>
  );
}
