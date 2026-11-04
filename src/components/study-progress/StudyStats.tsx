"use client";

import { ActivityType, ActivityTypeColors, ActivityTypeBarColors } from "@/types/user-activity";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";

interface StudyStatsProps {
  stats: Record<ActivityType, number>;
  totalElements: number;
  getActivityTypeName: (type: ActivityType) => string;
  isLoading?: boolean;
}

export default function StudyStats({
  stats,
  totalElements,
  getActivityTypeName,
  isLoading,
}: StudyStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-border bg-surface p-4 shadow-xs flex flex-col justify-between animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-muted" />
              <div className="h-7 w-10 rounded bg-muted" />
            </div>
            <div className="h-3.5 w-24 rounded bg-muted mt-2" />
            <div className="h-1.5 w-full rounded-full bg-muted mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {Object.entries(stats).map(([type, count]) => {
        const activityType = type as ActivityType;
        const tone = ActivityTypeColors[activityType];
        const barTone = ActivityTypeBarColors[activityType] || "bg-primary";
        const percentage = totalElements
          ? Math.min((count / totalElements) * 100, 100)
          : 0;

        return (
          <div
            key={type}
            className="rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all hover:border-primary/30"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <ActivityTypeIcon type={activityType} />
              </span>
              <span className="text-2xl font-extrabold tabular-nums text-foreground">
                {count}
              </span>
            </div>
            <p className="mt-3 truncate text-xs font-semibold text-muted-foreground">
              {getActivityTypeName(activityType)}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barTone}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
