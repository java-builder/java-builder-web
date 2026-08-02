"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { notificationApi } from "@/services/notification.service";
import { NotificationDetailResponse } from "@/types/notification";
import { formatRelativeTime, formatApiDate } from "@/utils/dateUtils";
import { useNotifications } from "@/hooks/useNotifications";
import { useI18n } from "@/contexts/I18nContext";

export default function AdminNotificationDropdown() {
  const { t } = useI18n();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDetailResponse[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const loadedTabsRef = useRef<Set<"all" | "unread">>(new Set());

  // Use shared react-query hook and enable only when dropdown is open to avoid duplicate calls
  const { data: notifPageData, isFetching } = useNotifications(currentPage, activeTab, isNotifOpen);

  // Sync query data into local state
  useEffect(() => {
    if (!notifPageData) return;
    const list = notifPageData.data || [];
    const total = notifPageData.totalPages || 1;

    setCurrentPage(notifPageData.currentPage || currentPage);
    setTotalPages(total);

    // Append if loading more, replace if first page
    setNotifications(prev => {
      if (notifPageData.currentPage === 1) return list;
      // Avoid duplicates just in case
      const existingIds = new Set(prev.map(n => n.id));
      const newItems = list.filter(n => !existingIds.has(n.id));
      return [...prev, ...newItems];
    });

    // Update unread count based on the first page fetch mostly, 
    // but simplified logic here just checks current list. 
    // Ideally we trust API for unread count if it provided it.
    const unreadInList = list.filter((n) => !n.isRead).length;
    if (currentPage === 1) {
      setHasUnread(unreadInList > 0);
      setUnreadCount(unreadInList);
    }
  }, [notifPageData, activeTab, currentPage]);

  const handleOpenNotifications = async () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      if (notifications.some(n => !n.isRead)) {
        const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
        if (unreadIds.length > 0) {
          try {
            await notificationApi.markAsRead(unreadIds);
            setNotifications((prev) =>
              prev.map((n) =>
                unreadIds.includes(n.id) ? { ...n, isRead: true } : n,
              ),
            );
            setHasUnread(false);
            setUnreadCount(0);
          } catch (e) {
            console.error("Failed to mark notifications as read", e);
          }
        }
      }
    }
  };

  const handleTabChange = (tab: "all" | "unread") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setNotifications([]);
    loadedTabsRef.current.delete(tab);
  };

  const filteredNotifications = notifications;

  const handleLoadMore = () => {
    if (currentPage >= totalPages || isFetching) return;
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpenNotifications}
        className="relative p-2 text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-accent rounded-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {hasUnread && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] leading-[18px] rounded-full text-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isNotifOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
          {/* Header with tabs */}
          <div className="border-b border-gray-200 dark:border-slate-700">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">
              {t("admin.notificationDropdown.title")}
            </div>
            <div className="flex border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => handleTabChange("all")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "all"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                {t("admin.notificationDropdown.tabAll")}
              </button>
              <button
                onClick={() => handleTabChange("unread")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "unread"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                {t("admin.notificationDropdown.tabUnread")}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] leading-[18px] rounded-full text-center font-semibold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-auto">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {activeTab === "unread"
                    ? t("admin.notificationDropdown.emptyUnreadTitle")
                    : t("admin.notificationDropdown.emptyAllTitle")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  {activeTab === "unread"
                    ? t("admin.notificationDropdown.emptyUnreadDesc")
                    : t("admin.notificationDropdown.emptyAllDesc")}
                </div>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${!n.isRead ? "bg-blue-50/50 dark:bg-accent/10 hover:bg-blue-50 dark:hover:bg-accent/20" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}
                  onClick={() => setIsNotifOpen(false)}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                    {n.avatar ? (
                      <Image
                        src={n.avatar}
                        alt={n.senderName || "Avatar"}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {(n.senderName || "U")[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                      <span className="font-medium">
                        {n.title || t("admin.notificationDropdown.defaultTitle")}
                      </span>
                    </div>
                    <div
                      className="text-xs text-gray-400 dark:text-gray-300"
                      title={n.createdAt ? formatApiDate(n.createdAt) : ""}
                    >
                      {n.createdAt ? formatRelativeTime(n.createdAt) : ""}
                    </div>
                  </div>
                  {/* thumbnail not displayed on FE */}
                </Link>
              ))
            )}
          </div>

          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={handleLoadMore}
                disabled={isFetching}
                className="w-full text-sm text-accent hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isFetching ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>{t("admin.notificationDropdown.loading")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("admin.notificationDropdown.viewMore")}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
