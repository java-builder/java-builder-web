import { Conversation } from "./types";

export type FilterTab = "all" | "unread" | "groups" | "admin";

interface ConversationTabsProps {
  activeTab: FilterTab;
  onSelectTab: (tab: FilterTab) => void;
  conversations: Conversation[];
}

export default function ConversationTabs({
  activeTab,
  onSelectTab,
  conversations,
}: ConversationTabsProps) {
  const unreadCount = conversations.filter((c) => (c.unreadCount || 0) > 0).length;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto text-xs font-semibold">
      <button
        type="button"
        onClick={() => onSelectTab("all")}
        className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
          activeTab === "all"
            ? "bg-accent text-white shadow-xs"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        Tất cả
      </button>
      <button
        type="button"
        onClick={() => onSelectTab("unread")}
        className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
          activeTab === "unread"
            ? "bg-accent text-white shadow-xs"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <span>Chưa đọc</span>
        {unreadCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
            {unreadCount}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => onSelectTab("groups")}
        className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
          activeTab === "groups"
            ? "bg-accent text-white shadow-xs"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        Nhóm học
      </button>
      <button
        type="button"
        onClick={() => onSelectTab("admin")}
        className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
          activeTab === "admin"
            ? "bg-accent text-white shadow-xs"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        Quản trị
      </button>
    </div>
  );
}
