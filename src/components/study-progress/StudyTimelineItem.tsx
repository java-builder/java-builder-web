"use client";

import {
  ActivityType,
  ActivityTypeColors,
} from "@/types/user-activity";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";

interface StudyTimelineItemProps {
  activityType: ActivityType;
  activityTypeName: string;
  resourceTitle: string;
  relativeTime: string;
  fullTime: string;
  isLast?: boolean;
}

export default function StudyTimelineItem({
  activityType,
  activityTypeName,
  resourceTitle,
  relativeTime,
  fullTime,
  isLast = false,
}: StudyTimelineItemProps) {
  const tone = ActivityTypeColors[activityType];

  return (
    <div className="flex gap-3">
      {/* Rail column */}
      <div className="flex flex-col items-center pt-3">
        <span
          className={`flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-800 ${tone}`}
        />
        {!isLast && (
          <span
            aria-hidden
            className="mt-1 w-px flex-1 bg-gray-200 dark:bg-slate-700"
          />
        )}
      </div>

      {/* Content card */}
      <div className="min-w-0 flex-1 pb-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-accent/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start gap-3">
            <span
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tone}`}
            >
              <ActivityTypeIcon type={activityType} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${tone}`}
                >
                  {activityTypeName}
                </span>
                <span
                  className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400"
                  title={fullTime}
                >
                  {relativeTime}
                </span>
              </div>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                {resourceTitle}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
