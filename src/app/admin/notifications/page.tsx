"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotificationDetailResponse } from "@/types/notification";
import { NotificationItem } from "@/types/notification";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationApi } from "@/services/notification.service";
import NotificationTabs from "@/components/notifications/NotificationTabs";
import AdminNotificationList from "@/components/notifications/AdminNotificationList";
import ConfirmModal from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previousFilterRef = useRef<"all" | "unread">("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: "",
    title: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: notifPageData, isFetching, isLoading } = useNotifications(currentPage, filter === "unread" ? "unread" : "all");

  useEffect(() => {
    if (notifPageData) {
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
          const existingIds = new Set(prev.map(n => n.id));
          const newItems = mapped.filter((n: NotificationItem) => !existingIds.has(n.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [notifPageData, currentPage, filter]);

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

  const filtered = allNotifications.filter((n) => (filter === "all" ? true : !n.isRead));
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;
  const totalCount = allNotifications.length;

  // Show loading spinner on initial load
  if (isLoading && allNotifications.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông báo</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Đang tải thông báo...</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông báo</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {unreadCount > 0 ? `Có ${unreadCount} thông báo chưa đọc` : "Không có thông báo mới"}
            </p>
          </div>
          <Link
            href="/admin/notifications/send"
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium shadow-sm"
          >
            Gửi thông báo
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <NotificationTabs
            activeTab={filter}
            totalCount={totalCount}
            unreadCount={unreadCount}
            onTabChange={setFilter}
          />
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-accent hover:underline"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        <AdminNotificationList
          notifications={filtered}
          onNotificationClick={handleNotificationClick}
          onDelete={handleDelete}
          isLoading={isFetching}
          hasMore={currentPage < totalPages}
          onLoadMore={handleLoadMore}
        />
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
