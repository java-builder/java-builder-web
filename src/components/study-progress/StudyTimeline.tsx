"use client";

import { Calendar } from "lucide-react";
import {
  ActivityType,
  UserDailyActivity,
} from "@/types/user-activity";
import { formatApiDate, formatRelativeTime } from "@/utils/dateUtils";
import { TranslationKey } from "@/contexts/I18nContext";
import StudyTimelineItem from "./StudyTimelineItem";

interface StudyTimelineProps {
  groupedActivities: Record<string, UserDailyActivity[]>;
  getActivityTypeName: (type: ActivityType) => string;
  t: (key: TranslationKey) => string;
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
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft border border-primary/15 text-primary">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {timelineLabel}
          </h3>
        </div>
      </div>

      <div className="divide-y divide-border">
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <section key={date} className="px-4 py-5 sm:px-6">
            {/* Date header */}
            <div className="mb-3.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h4 className="text-sm font-bold text-foreground">
                {date}
              </h4>
              <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground tabular-nums">
                {dateActivities.length}
              </span>
            </div>

            <div className="space-y-2 mt-2">
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
