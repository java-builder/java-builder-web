interface NotificationTabsProps {
  activeTab: "all" | "unread";
  totalCount: number;
  unreadCount: number;
  onTabChange: (tab: "all" | "unread") => void;
}

export default function NotificationTabs({
  activeTab,
  totalCount,
  unreadCount,
  onTabChange,
}: NotificationTabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTabChange("all")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === "all"
            ? "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
        }`}
      >
        Tất cả ({totalCount})
      </button>
      <button
        onClick={() => onTabChange("unread")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === "unread"
            ? "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
        }`}
      >
        Chưa đọc ({unreadCount})
      </button>
    </div>
  );
}
