"use client";

import { useEffect, useState } from "react";
import { ActivityType, ActivityTypeColors } from "@/types/user-activity";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";

interface StudyStatsProps {
  stats: Record<ActivityType, number>;
  totalElements: number;
  getActivityTypeName: (type: ActivityType) => string;
}

function AnimatedCounter({ value, duration = 800 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function StudyStats({
  stats,
  totalElements,
  getActivityTypeName,
}: StudyStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Object.entries(stats).map(([type, count]) => {
        const activityType = type as ActivityType;
        const tone = ActivityTypeColors[activityType];
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
                <AnimatedCounter value={count} />
              </span>
            </div>
            <p className="mt-3 truncate text-xs font-medium text-gray-600 dark:text-gray-400">
              {getActivityTypeName(activityType)}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
              <div
                className={`h-full transition-all duration-700 ${tone}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
