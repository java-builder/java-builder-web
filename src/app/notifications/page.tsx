"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/types/notification";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationTabs from "@/components/notifications/NotificationTabs";
import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previousFilterRef = useRef<"all" | "unread">("all");

  const { data: notifData, isFetching } = useNotifications(currentPage, filter);

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
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    
    if (notification.link && notification.link !== "#") {
      router.push(notification.link);
    }
  };

  const markAllRead = () => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <NotificationHeader unreadCount={unreadCount} onMarkAllRead={markAllRead} />
      
      <NotificationTabs
        activeTab={filter}
        totalCount={totalCount}
        unreadCount={unreadCount}
        onTabChange={setFilter}
      />

      <NotificationList
        notifications={filtered}
        onNotificationClick={handleNotificationClick}
        isLoading={isFetching}
        hasMore={currentPage < totalPages}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
