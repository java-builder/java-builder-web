"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HiOutlineBell } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { notificationApi } from "@/services/notification.service";
import { NotificationDetailResponse } from "@/types/notification";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminNotificationDropdown() {
  const { isAuthenticated } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDetailResponse[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [tabPages, setTabPages] = useState<{ all: number; unread: number }>({
    all: 1,
    unread: 1,
  });
  const [itemsPerPage, setItemsPerPage] = useState<{
    all: number;
    unread: number;
  }>({ all: 0, unread: 0 });

  // Refs to prevent duplicate API calls
  const hasInitiallyLoaded = useRef(false);
  const loadedTabsRef = useRef<Set<"all" | "unread">>(new Set());
  const prevActiveTabRef = useRef<"all" | "unread">(activeTab);

  const loadNotifications = useCallback(
    async (
      page: number = 1,
      append: boolean = false,
      markAsReadOnLoad: boolean = false,
    ) => {
      if (!isAuthenticated) return;
      try {
        let size: number | undefined = undefined;
        const currentItemsPerPage = itemsPerPage[activeTab];
        if (page > 1 && currentItemsPerPage > 0 && !append) {
          size = page * currentItemsPerPage;
        }

        const res =
          activeTab === "unread"
            ? await notificationApi.getUnreadNotifications(
              size ? 1 : page,
              size,
            )
            : await notificationApi.getMyNotifications(size ? 1 : page, size);
        const list = res.result?.result || [];
        const total = res.result?.totalPages || 1;
        const pageSize = res.result?.pageSizes || 0;

        if (pageSize > 0) {
          setItemsPerPage((prev) => {
            if (prev[activeTab] !== pageSize) {
              return { ...prev, [activeTab]: pageSize };
            }
            return prev;
          });
        }

        setCurrentPage(page);
        setTotalPages(total);
        setTabPages((prev) => ({ ...prev, [activeTab]: page }));

        if (append) {
          setNotifications((prev) => [...prev, ...list]);
        } else {
          setNotifications(list);
        }

        // Update unread count from loaded notifications
        const unreadInList = list.filter((n) => !n.read).length;
        setHasUnread(unreadInList > 0);
        setUnreadCount(unreadInList);

        if (markAsReadOnLoad && list.length > 0) {
          const unreadIds = list.filter((n) => !n.read).map((n) => n.id);
          if (unreadIds.length > 0) {
            try {
              await notificationApi.markAsRead(unreadIds);
              setNotifications((prev) =>
                prev.map((n) =>
                  unreadIds.includes(n.id) ? { ...n, read: true } : n,
                ),
              );
              setHasUnread(false);
              setUnreadCount(0);
            } catch (e) {
              console.error("Failed to mark notifications as read", e);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    },
    [isAuthenticated, activeTab, itemsPerPage],
  );

  // Single useEffect for initial load - prevents duplicate calls
  useEffect(() => {
    if (!isAuthenticated || hasInitiallyLoaded.current) return;

    hasInitiallyLoaded.current = true;
    loadedTabsRef.current.add(activeTab);
    prevActiveTabRef.current = activeTab;

    const savedPage = tabPages[activeTab] || 1;
    loadNotifications(savedPage, false);
  }, [isAuthenticated, activeTab, loadNotifications, tabPages]);

  // Handle tab changes only (not initial load)
  useEffect(() => {
    if (!isAuthenticated || !hasInitiallyLoaded.current) return;

    if (prevActiveTabRef.current !== activeTab && !loadedTabsRef.current.has(activeTab)) {
      const savedPage = tabPages[activeTab] || 1;
      loadNotifications(savedPage, false);
      loadedTabsRef.current.add(activeTab);
      prevActiveTabRef.current = activeTab;
    }
  }, [isAuthenticated, activeTab, loadNotifications, tabPages]);

  const handleOpenNotifications = async () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      if (unreadIds.length > 0) {
        try {
          await notificationApi.markAsRead(unreadIds);
          setNotifications((prev) =>
            prev.map((n) =>
              unreadIds.includes(n.id) ? { ...n, read: true } : n,
            ),
          );
          setHasUnread(false);
          setUnreadCount(0);
        } catch (e) {
          console.error("Failed to mark notifications as read", e);
        }
      }
    }
  };

  const handleTabChange = (tab: "all" | "unread") => {
    setActiveTab(tab);
    setNotifications([]);
    loadedTabsRef.current.delete(tab);
  };

  const filteredNotifications = notifications;

  const handleLoadMore = async () => {
    if (currentPage >= totalPages || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    await loadNotifications(nextPage, true, true);
    setIsLoadingMore(false);
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
                  href={n.content || "#"}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-blue-50 ${!n.read ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
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
                    <div className="text-xs text-gray-400">
                      {n.createdAt}
                    </div>
                  </div>
                  {n.link && (
                    <Image
                      src={n.link}
                      alt="attachment"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-contain bg-white border border-gray-200"
                      unoptimized
                    />
                  )}
                </Link>
              ))
            )}
          </div>

          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="px-4 py-2.5 border-t border-gray-100">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-full text-sm text-accent hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isLoadingMore ? (
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
