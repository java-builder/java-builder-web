"use client";

import { useI18n } from "@/contexts/I18nContext";

interface NotificationFilterTabsProps {
  activeTab: "all" | "unread";
  totalCount: number;
  unreadCount: number;
  onTabChange: (tab: "all" | "unread") => void;
}

export default function NotificationFilterTabs({
  activeTab,
  totalCount,
  unreadCount,
  onTabChange,
}: NotificationFilterTabsProps) {
  const { t } = useI18n();

  const tabs: { id: "all" | "unread"; label: string }[] = [
    { id: "all", label: t("admin.notifications.tabAll") },
    { id: "unread", label: t("admin.notifications.tabUnread") },
  ];

  const counts: Record<"all" | "unread", number> = {
    all: totalCount,
    unread: unreadCount,
  };

  return (
    <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition cursor-pointer ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                isActive
                  ? "bg-accent/20 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
