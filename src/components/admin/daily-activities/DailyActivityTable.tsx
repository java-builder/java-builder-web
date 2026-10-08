"use client";

import Image from "next/image";
import Link from "next/link";
import { UserDailyActivity, ActivityType, ActivityTypeColors, ActivityTypeDisplayNames } from "@/types/user-activity";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";
import { Button } from "@/components/ui/button";
import { DailyActivityMobileCard } from "./DailyActivityMobileCard";
import {
  Calendar,
  ExternalLink,
  Eye,
  Activity,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface DailyActivityTableProps {
  activities: UserDailyActivity[];
  isLoading: boolean;
  onViewDetail: (activity: UserDailyActivity) => void;
}

export const DailyActivityTable = ({
  activities,
  isLoading,
  onViewDetail,
}: DailyActivityTableProps) => {
  const { t } = useI18n();

  const getResourceUrl = (activity: UserDailyActivity) => {
    if (!activity.resourceSlug) return "";
    switch (activity.activityType) {
      case ActivityType.VIEW_LESSON:
        return `/docs/${activity.resourceSlug}${activity.resourceId ? `?lessonId=${activity.resourceId}` : ""}`;
      case ActivityType.READ_BLOG:
        return `/blogs/${activity.resourceSlug}`;
      case ActivityType.READ_INTERVIEW:
        return `/interview/${activity.resourceSlug}`;
      case ActivityType.SUBMIT_EXERCISE:
        return `/exercises/${activity.resourceSlug}`;
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Mobile Skeleton */}
        <div className="block md:hidden space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card border border-border rounded-xl" />
          ))}
        </div>
        {/* Desktop Skeleton */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-sm p-6 space-y-4 animate-pulse">
          <div className="h-10 bg-muted/70 rounded-xl" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 bg-muted/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm py-16 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center">
          <Activity className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-foreground">
          {t("admin.dailyActivities.noData")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {activities.map((activity) => (
          <DailyActivityMobileCard
            key={activity.id}
            activity={activity}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
            <tr>
              <th className="px-5 py-3.5 whitespace-nowrap">
                {t("admin.dailyActivities.colType")}
              </th>
              <th className="px-5 py-3.5 whitespace-nowrap">
                {t("admin.dailyActivities.colResource")}
              </th>
              <th className="px-5 py-3.5 whitespace-nowrap">
                {t("admin.dailyActivities.colDateTime")}
              </th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">
                {t("admin.dailyActivities.colActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.map((activity) => {
              const badgeTone = ActivityTypeColors[activity.activityType] || "bg-muted text-foreground";
              const typeDisplayName = ActivityTypeDisplayNames[activity.activityType] || activity.activityType;
              const resourceUrl = getResourceUrl(activity);

              return (
                <tr
                  key={activity.id}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  {/* Activity Type Badge */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeTone}`}>
                      <ActivityTypeIcon type={activity.activityType} className="w-3.5 h-3.5 shrink-0" />
                      {typeDisplayName}
                    </span>
                  </td>

                  {/* Resource Info */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 min-w-[260px] max-w-md">
                      <div className="relative w-11 h-9 rounded-lg bg-muted overflow-hidden border border-border shrink-0 flex items-center justify-center">
                        {activity.resourceThumbnailUrl ? (
                          <Image
                            src={activity.resourceThumbnailUrl}
                            alt={activity.resourceTitle}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ActivityTypeIcon type={activity.activityType} className="w-5 h-5 text-muted-foreground/60" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {activity.resourceTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {activity.resourceSlug && (
                            <span className="text-[11px] font-mono text-muted-foreground truncate">
                              /{activity.resourceSlug}
                            </span>
                          )}
                          {activity.resourceId && (
                            <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">
                              ID: {activity.resourceId.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Recorded Timestamp */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                      <span>{activity.activityDateTime}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(activity)}
                        title={t("admin.dailyActivities.viewDetail")}
                        className="h-8 px-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-xs">
                          {t("admin.dailyActivities.viewDetail")}
                        </span>
                      </Button>

                      {resourceUrl && (
                        <Link href={resourceUrl} target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            title={t("admin.dailyActivities.openResource")}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
