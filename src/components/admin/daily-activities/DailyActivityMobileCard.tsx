"use client";

import Image from "next/image";
import Link from "next/link";
import { UserDailyActivity, ActivityType, ActivityTypeColors, ActivityTypeDisplayNames } from "@/types/user-activity";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Eye } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface DailyActivityMobileCardProps {
  activity: UserDailyActivity;
  onViewDetail: (activity: UserDailyActivity) => void;
}

export const DailyActivityMobileCard = ({
  activity,
  onViewDetail,
}: DailyActivityMobileCardProps) => {
  const { t } = useI18n();

  const getResourceUrl = () => {
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

  const resourceUrl = getResourceUrl();
  const badgeTone = ActivityTypeColors[activity.activityType] || "bg-muted text-foreground";
  const typeDisplayName = ActivityTypeDisplayNames[activity.activityType] || activity.activityType;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3 hover:border-border/80 transition-colors">
      {/* Top: Badge + Date */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeTone}`}>
          <ActivityTypeIcon type={activity.activityType} className="w-3.5 h-3.5 shrink-0" />
          {typeDisplayName}
        </span>

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
          <Calendar className="w-3 h-3 text-muted-foreground/60 shrink-0" />
          <span>{activity.activityDateTime}</span>
        </div>
      </div>

      {/* Resource info with thumbnail */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-12 rounded-lg bg-muted overflow-hidden border border-border shrink-0 flex items-center justify-center">
          {activity.resourceThumbnailUrl ? (
            <Image
              src={activity.resourceThumbnailUrl}
              alt={activity.resourceTitle}
              fill
              className="object-cover"
            />
          ) : (
            <ActivityTypeIcon type={activity.activityType} className="w-6 h-6 text-muted-foreground/50" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-xs line-clamp-2 leading-snug">
            {activity.resourceTitle}
          </p>
          {activity.resourceSlug && (
            <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
              /{activity.resourceSlug}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(activity)}
          className="h-8 px-2.5 text-xs rounded-lg gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t("admin.dailyActivities.viewDetail")}</span>
        </Button>

        {resourceUrl && (
          <Link href={resourceUrl} target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs rounded-lg gap-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/30 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t("admin.dailyActivities.openResource")}</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
