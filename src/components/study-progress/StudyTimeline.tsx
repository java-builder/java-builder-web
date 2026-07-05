"use client";

import { Calendar } from "lucide-react";
import {
  ActivityType,
  UserDailyActivity,
} from "@/types/user-activity";
import { formatApiDate, formatRelativeTime } from "@/utils/dateUtils";
import StudyTimelineItem from "./StudyTimelineItem";

interface StudyTimelineProps {
  groupedActivities: Record<string, UserDailyActivity[]>;
  getActivityTypeName: (type: ActivityType) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: any) => string;
  timelineLabel: string;
  questionSetToTopicMap?: Map<string, string>;
}

export default function StudyTimeline({
  groupedActivities,
  getActivityTypeName,
  t,
  timelineLabel,
  questionSetToTopicMap,
}: StudyTimelineProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <Calendar className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {timelineLabel}
          </h3>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-slate-700">
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <section key={date} className="px-4 py-5 sm:px-6">
            {/* Date header */}
            <div className="mb-4 flex items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {date}
              </h4>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                {dateActivities.length}
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800/60 mt-2">
              {dateActivities.map((activity) => {
                const activityType = activity.activityType as ActivityType;
                
                const getResourceUrl = () => {
                  if (!activity.resourceSlug) return "";
                  switch (activityType) {
                    case ActivityType.VIEW_LESSON:
                      return `/docs/${activity.resourceSlug}${activity.resourceId ? `?lessonId=${activity.resourceId}` : ""}`;
                    case ActivityType.READ_BLOG:
                      return `/blogs/${activity.resourceSlug}`;
                    case ActivityType.READ_INTERVIEW:
                      const topicSlug = questionSetToTopicMap?.get(activity.resourceSlug) || "topic";
                      return `/interview/${topicSlug}/${activity.resourceSlug}`;
                    case ActivityType.SUBMIT_EXERCISE:
                      return `/exercises/${activity.resourceSlug}`;
                    default:
                      return "";
                  }
                };

                const href = getResourceUrl();

                return (
                  <StudyTimelineItem
                    key={activity.id}
                    activityType={activityType}
                    activityTypeName={getActivityTypeName(activityType)}
                    resourceTitle={activity.resourceTitle}
                    resourceThumbnailUrl={activity.resourceThumbnailUrl}
                    relativeTime={formatRelativeTime(
                      activity.activityDateTime,
                      t
                    )}
                    fullTime={formatApiDate(activity.activityDateTime)}
                    href={href}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
