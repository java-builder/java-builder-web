"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NotificationDetailResponse } from "@/types/notification";
import { NotificationItem } from "@/types/notification";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationApi } from "@/services/notification.service";
import AdminNotificationList from "@/components/notifications/AdminNotificationList";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  NotificationListHeader,
  NotificationsToolbar,
} from "@/components/admin/notifications/list";
import toast from "react-hot-toast";

export default function AdminNotificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "unread" ? "unread" : "all";
  const [filter, setFilter] = useState<"all" | "unread">(initialTab);
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previousFilterRef = useRef<"all" | "unread">("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: "",
    title: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: notifPageData, isFetching, isLoading } = useNotifications(
    currentPage,
    filter === "unread" ? "unread" : "all"
  );

  // Tổng count dựa trên metadata trả về từ server, không phụ thuộc tab đang xem
  const { data: allCountData } = useNotifications(1, "all");
  const { data: unreadCountData } = useNotifications(1, "unread");
  const totalCount = allCountData?.totalElements ?? 0;
  const unreadCount = unreadCountData?.totalElements ?? 0;

  useEffect(() => {
    if (!notifPageData) return;

    const list = notifPageData.data || [];
    const mapped = list.map((it: NotificationDetailResponse) => ({
      id: it.id,
      title: it.title || it.senderName || "Thông báo",
      content: it.content || "",
      createdAt: it.createdAt ? it.createdAt : "",
      avatar: it.avatar,
      senderName: it.senderName,
      isRead: it.isRead ?? false,
      link: it.link || "#",
    }));

    setTotalPages(notifPageData.totalPages || 1);

    const filterChanged = previousFilterRef.current !== filter;
    previousFilterRef.current = filter;

    if (currentPage === 1 && filterChanged) {
      setAllNotifications(mapped);
    } else if (currentPage === 1) {
      setAllNotifications(mapped);
    } else {
      setAllNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const newItems = mapped.filter(
          (n: NotificationItem) => !existingIds.has(n.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [notifPageData, currentPage, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleTabChange = (tab: "all" | "unread") => {
    setFilter(tab);
    // Persist filter in URL so navigating away and back keeps the tab
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/admin/notifications?${query}` : "/admin/notifications", {
      scroll: false,
    });
  };

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

  const handleDelete = (id: string) => {
    const notification = allNotifications.find((n) => n.id === id);
    setDeleteModal({
      isOpen: true,
      id,
      title: notification?.title || "thông báo này",
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await notificationApi.deleteNotification(deleteModal.id);
      setAllNotifications((prev) => prev.filter((n) => n.id !== deleteModal.id));
      toast.success("Xóa thông báo thành công");
      setDeleteModal({ isOpen: false, id: "", title: "" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Xóa thông báo thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = allNotifications.filter((n) =>
    filter === "all" ? true : !n.isRead
  );

  return (
    <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-5">
        {/* Header */}
        {isLoading && allNotifications.length === 0 ? (
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Trung tâm thông báo
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Đang tải thông báo...
            </p>
          </div>
        ) : (
          <NotificationListHeader
            totalCount={totalCount}
            unreadCount={unreadCount}
          />
        )}

        {/* Toolbar */}
        <NotificationsToolbar
          activeTab={filter}
          totalCount={totalCount}
          unreadCount={unreadCount}
          onTabChange={handleTabChange}
          onMarkAllRead={markAllRead}
        />

        {/* List card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
          {isLoading && allNotifications.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-accent"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Đang tải thông báo...
              </div>
            </div>
          ) : (
            <AdminNotificationList
              notifications={filtered}
              onNotificationClick={handleNotificationClick}
              onDelete={handleDelete}
              isLoading={isFetching}
              hasMore={currentPage < totalPages}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "", title: "" })}
        onConfirm={confirmDelete}
        title="Xóa thông báo"
        message={`Bạn có chắc chắn muốn xóa thông báo <strong>${deleteModal.title}</strong>?`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
