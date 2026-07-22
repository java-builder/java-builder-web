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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-slate-700" />
              <div className="h-7 w-12 rounded bg-gray-200 dark:bg-slate-700" />
            </div>
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700 mt-2" />
            <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-slate-700 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Object.entries(stats).map(([type, count]) => {
        const activityType = type as ActivityType;
        const tone = ActivityTypeColors[activityType];
        const barTone = ActivityTypeBarColors[activityType] || "bg-accent";
        const percentage = totalElements
          ? Math.min((count / totalElements) * 100, 100)
          : 0;

        return (
          <div
            key={type}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tone}`}
              >
                <ActivityTypeIcon type={activityType} />
              </span>
              <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {count}
              </span>
            </div>
            <p className="mt-3 truncate text-xs font-medium text-gray-600 dark:text-gray-400">
              {getActivityTypeName(activityType)}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
              <div
                className={`h-full transition-all duration-700 ${barTone}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
