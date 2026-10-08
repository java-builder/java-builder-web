"use client";

import Image from "next/image";
import Link from "next/link";
import { UserDailyActivity, ActivityType, ActivityTypeColors, ActivityTypeDisplayNames } from "@/types/user-activity";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";
import { Button } from "@/components/ui/button";
import { X, Calendar, ExternalLink, Hash, Bookmark, Copy, Check } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useState } from "react";
import toast from "react-hot-toast";

interface DailyActivityDetailModalProps {
  activity: UserDailyActivity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DailyActivityDetailModal = ({
  activity,
  isOpen,
  onClose,
}: DailyActivityDetailModalProps) => {
  const { t } = useI18n();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !activity) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Đã sao chép vào bộ nhớ tạm");
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground rounded-2xl shadow-2xl p-5 sm:p-6 z-10 animate-in fade-in zoom-in-95 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${badgeTone}`}>
              <ActivityTypeIcon type={activity.activityType} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t("admin.dailyActivities.detailModalTitle")}
              </h3>
              <p className="text-xs text-muted-foreground">{typeDisplayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Preview */}
        {activity.resourceThumbnailUrl && (
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-muted/40">
            <Image
              src={activity.resourceThumbnailUrl}
              alt={activity.resourceTitle}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content details */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t("admin.dailyActivities.colResource")}
            </label>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              {activity.resourceTitle}
            </p>
          </div>

          {/* Details list */}
          <div className="rounded-xl border border-border/60 bg-muted/30 divide-y divide-border/50 text-xs">
            {/* Activity ID */}
            <div className="flex items-center justify-between p-2.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                {t("admin.dailyActivities.activityId")}:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-foreground truncate max-w-[200px]">
                  {activity.id}
                </span>
                <button
                  onClick={() => copyToClipboard(activity.id, "id")}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Sao chép ID"
                >
                  {copiedKey === "id" ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Resource ID (if present) */}
            {activity.resourceId && (
              <div className="flex items-center justify-between p-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  {t("admin.dailyActivities.resourceId")}:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-foreground truncate max-w-[200px]">
                    {activity.resourceId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(activity.resourceId!, "resourceId")}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Sao chép ID tài nguyên"
                  >
                    {copiedKey === "resourceId" ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Slug (if present) */}
            {activity.resourceSlug && (
              <div className="flex items-center justify-between p-2.5">
                <span className="text-muted-foreground">
                  {t("admin.dailyActivities.resourceSlug")}:
                </span>
                <span className="font-mono text-[11px] text-foreground truncate max-w-[220px]">
                  {activity.resourceSlug}
                </span>
              </div>
            )}

            {/* Date time */}
            <div className="flex items-center justify-between p-2.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {t("admin.dailyActivities.timeLabel")}:
              </span>
              <span className="font-medium text-foreground">
                {activity.activityDateTime}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl cursor-pointer"
          >
            {t("admin.dailyActivities.closeBtn")}
          </Button>

          {resourceUrl && (
            <Link href={resourceUrl} target="_blank">
              <Button
                size="sm"
                className="gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
              >
                <span>{t("admin.dailyActivities.openResource")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
