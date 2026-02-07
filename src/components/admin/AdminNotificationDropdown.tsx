"use client";

import { useState, useEffect, useRef } from "react";
import { HiOutlineBell } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { notificationApi } from "@/services/notification.service";
import { NotificationDetailResponse } from "@/types/notification";
import { formatRelativeTime, formatApiDate } from "@/utils/dateUtils";
import { useNotifications } from "@/hooks/useNotifications";

export default function AdminNotificationDropdown() {
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
        className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg"
      >
        <HiOutlineBell className="w-6 h-6" aria-hidden="true" />
        {hasUnread && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] leading-[18px] rounded-full text-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isNotifOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header with tabs */}
          <div className="border-b border-gray-200">
            <div className="px-3 py-2 text-xs font-medium text-gray-500">
              Thông báo
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => handleTabChange("all")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "all"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleTabChange("unread")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "unread"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Chưa đọc
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
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
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
                <div className="text-sm font-medium text-gray-700">
                  {activeTab === "unread"
                    ? "Không có thông báo chưa đọc"
                    : "Chưa có thông báo"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {activeTab === "unread"
                    ? "Tất cả thông báo của bạn đã được đọc."
                    : "Khi có hoạt động mới, chúng tôi sẽ hiển thị tại đây."}
                </div>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-blue-50 ${!n.isRead ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                  onClick={() => setIsNotifOpen(false)}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
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
                      <span className="text-xs text-gray-600">
                        {(n.senderName || "U")[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-900 line-clamp-2 mb-1">
                      <span className="font-medium">
                        {n.title || "Thông báo"}
                      </span>
                    </div>
                    <div
                      className="text-xs text-gray-400"
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
            <div className="px-4 py-2.5 border-t border-gray-100">
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
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <span>Xem thêm</span>
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
