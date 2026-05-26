"use client";

import { useI18n } from "@/contexts/I18nContext";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  isOpen: boolean;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteAll: () => void;
  onClose: () => void;
}

export default function ConversationSidebar({
  conversations,
  currentConversationId,
  isOpen,
  onNewChat,
  onSelectConversation,
  onDeleteAll,
  onClose,
}: ConversationSidebarProps) {
  const { t, locale } = useI18n();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return t("time.today");
    if (days === 1) return t("time.yesterday");
    if (days < 7) return t("time.daysAgo").replace("{count}", String(days));
    
    const localeMap: Record<string, string> = {
      vi: "vi-VN",
      en: "en-US",
      ja: "ja-JP",
      ko: "ko-KR",
    };
    return date.toLocaleDateString(localeMap[locale] || "vi-VN");
  };

  return (
    <div className={`${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${isOpen ? "md:w-64" : "md:w-0"} w-64 transition-all duration-300 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden fixed md:relative left-0 top-0 bottom-0 z-50 h-screen`}>
      {/* Sidebar Header */}
      <div className="p-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
        <button
          onClick={onNewChat}
          className="flex-1 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("chatbotPage.newChatBtn")}
        </button>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full text-left px-2.5 py-2.5 rounded-lg transition-colors ${
                currentConversationId === conv.id
                  ? "bg-gray-100 dark:bg-slate-700"
                  : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(conv.timestamp)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      {conversations.length > 1 && (
        <div className="p-3 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={onDeleteAll}
            className="w-full px-2.5 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t("chatbotPage.deleteAll")}
          </button>
        </div>
      )}
    </div>
  );
}
