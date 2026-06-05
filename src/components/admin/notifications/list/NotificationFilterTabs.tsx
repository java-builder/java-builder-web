"use client";

interface NotificationFilterTabsProps {
  activeTab: "all" | "unread";
  totalCount: number;
  unreadCount: number;
  onTabChange: (tab: "all" | "unread") => void;
}

const TABS: { id: "all" | "unread"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "unread", label: "Chưa đọc" },
];

export default function NotificationFilterTabs({
  activeTab,
  totalCount,
  unreadCount,
  onTabChange,
}: NotificationFilterTabsProps) {
  const counts: Record<"all" | "unread", number> = {
    all: totalCount,
    unread: unreadCount,
  };

  return (
    <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                isActive
                  ? "bg-accent/20 text-accent"
                  : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400"
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
