"use client";

import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationFilterTabs from "./NotificationFilterTabs";
import { useI18n } from "@/contexts/I18nContext";

interface NotificationsToolbarProps {
  activeTab: "all" | "unread";
  totalCount: number;
  unreadCount: number;
  onTabChange: (tab: "all" | "unread") => void;
  onMarkAllRead?: () => void;
}

export default function NotificationsToolbar({
  activeTab,
  totalCount,
  unreadCount,
  onTabChange,
  onMarkAllRead,
}: NotificationsToolbarProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-sm">
      <NotificationFilterTabs
        activeTab={activeTab}
        totalCount={totalCount}
        unreadCount={unreadCount}
        onTabChange={onTabChange}
      />
      {unreadCount > 0 && onMarkAllRead && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onMarkAllRead}
          className="gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          {t("admin.notifications.markAllRead")}
        </Button>
      )}
    </div>
  );
}
