"use client";

import { CheckCheck } from "lucide-react";
import NotificationFilterTabs from "./NotificationFilterTabs";

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
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <NotificationFilterTabs
        activeTab={activeTab}
        totalCount={totalCount}
        unreadCount={unreadCount}
        onTabChange={onTabChange}
      />
      {unreadCount > 0 && onMarkAllRead && (
        <button
          type="button"
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Đánh dấu tất cả đã đọc
        </button>
      )}
    </div>
  );
}
