"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotifications, useMarkAsRead } from "@/hooks/useNotifications";
import { NotificationItem } from "@/types/notification";
import NotificationList from "@/components/notifications/NotificationList";
import { useI18n } from "@/contexts/I18nContext";

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previousFilterRef = useRef<"all" | "unread">("all");
  const { t } = useI18n();

  const { data: notifData, isFetching } = useNotifications(currentPage, filter);
  const markAsRead = useMarkAsRead();

  const hasMarkedInitialRead = useRef(false);
  
  useEffect(() => {
    if (!hasMarkedInitialRead.current && allNotifications.length > 0) {
      const unreadIds = allNotifications.filter((n) => !n.isRead).map((n) => n.id);
      if (unreadIds.length > 0) {
        markAsRead.mutate(unreadIds);
        hasMarkedInitialRead.current = true;
      }
    }
  }, [allNotifications, markAsRead]);

  useEffect(() => {
    if (notifData) {
      setTotalPages(notifData.totalPages || 1);
      
      const filterChanged = previousFilterRef.current !== filter;
      previousFilterRef.current = filter;
      
      if (currentPage === 1 && filterChanged) {
        setAllNotifications(notifData.data || []);
      } else if (currentPage === 1) {
        setAllNotifications(notifData.data || []);
      } else {
        setAllNotifications((prev) => {
          const existingIds = new Set(prev.map(n => n.id));
          const newItems = (notifData.data || []).filter(n => !existingIds.has(n.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [notifData, currentPage, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleNotificationClick = (notification: NotificationItem) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!notification.isRead) {
      markAsRead.mutate([notification.id]);
    }
    
    // Update local state ngay lập tức để UI responsive
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    
    if (notification.link && notification.link !== "#") {
      router.push(notification.link);
    }
  };

  const markAllRead = () => {
    // Lấy tất cả notification chưa đọc
    const unreadIds = allNotifications.filter((n) => !n.isRead).map((n) => n.id);
    
    if (unreadIds.length > 0) {
      // Gọi API để đánh dấu đã đọc
      markAsRead.mutate(unreadIds);
      
      // Update local state ngay lập tức
      setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const filtered = allNotifications.filter((n) => (filter === "all" ? true : !n.isRead));
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;
  const totalCount = allNotifications.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("notificationsPage.title")}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
            >
              {t("notificationsPage.markAllRead")}
            </button>
          )}
        </div>

        {/* Simple Tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              filter === "all"
                ? "text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {t("notificationsPage.tabAll")}
            <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">
              ({totalCount})
            </span>
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              filter === "unread"
                ? "text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {t("notificationsPage.tabUnread")}
            {unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <NotificationList
          notifications={filtered}
          onNotificationClick={handleNotificationClick}
          isLoading={isFetching}
          hasMore={currentPage < totalPages}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}
