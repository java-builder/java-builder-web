"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HiOutlineBell, HiOutlineChatAlt2 } from "react-icons/hi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/auth.service";
import {
  notificationApi,
  NotificationDetailResponse,
} from "@/services/notification.service";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    NotificationDetailResponse[]
  >([]);
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(authApi.isAuthenticated());
  }, []);

  const loadUnreadCount = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await notificationApi.getMyNotifications(1);
      const list = res.result?.result || [];
      const count = list.filter((n) => !n.read).length;
      setHasUnread(count > 0);
      setUnreadCount(count);
    } catch (e) {
      console.error("Failed to load unread count", e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadUnreadCount();
  }, [isLoggedIn, loadUnreadCount]);

  const loadNotifications = useCallback(
    async (
      page: number = 1,
      append: boolean = false,
      markAsReadOnLoad: boolean = false,
    ) => {
      if (!isLoggedIn) return;
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
              await loadUnreadCount();
            } catch (e) {
              console.error("Failed to mark notifications as read", e);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    },
    [isLoggedIn, activeTab, loadUnreadCount, itemsPerPage],
  );

  const loadedTabsRef = useRef<Set<"all" | "unread">>(new Set());
  const prevActiveTabRef = useRef<"all" | "unread">(activeTab);

  useEffect(() => {
    if (
      isLoggedIn &&
      (prevActiveTabRef.current !== activeTab ||
        !loadedTabsRef.current.has(activeTab))
    ) {
      const savedPage = tabPages[activeTab] || 1;
      loadNotifications(savedPage, false);
      loadedTabsRef.current.add(activeTab);
      prevActiveTabRef.current = activeTab;
    }
  }, [isLoggedIn, activeTab, loadNotifications, tabPages]);

  const handleOpenNotifications = async () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      // close messages if opening notifications
      setIsMessagesOpen(false);
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      if (unreadIds.length > 0) {
        try {
          await notificationApi.markAsRead(unreadIds);
          setNotifications((prev) =>
            prev.map((n) =>
              unreadIds.includes(n.id) ? { ...n, read: true } : n,
            ),
          );
          await loadUnreadCount();
        } catch (e) {
          console.error("Failed to mark notifications as read", e);
        }
      }
    }
  };
  const hardcodedMessages = [
    { id: 1, sender: "Nguyễn Văn A", text: "Xin chào, tôi muốn hỏi về khóa học React.", time: "2 giờ trước" },
    { id: 2, sender: "Bạn", text: "Chào anh, khóa học React hiện đang có chương trình ưu đãi.", time: "2 giờ trước" },
    { id: 3, sender: "Nguyễn Văn A", text: "Chi phí và lịch học thế nào?", time: "2 giờ trước" },
    { id: 4, sender: "Bạn", text: "Anh có thể tham khảo lịch học trên trang khoá học, hoặc mình gửi link nhanh.", time: "1 giờ 58 phút trước" },
    { id: 5, sender: "Nguyễn Văn A", text: "Gửi giúp tôi link với.", time: "1 giờ 55 phút trước" },
    { id: 6, sender: "Bạn", text: "Đã gửi, anh kiểm tra inbox nhé.", time: "1 giờ 50 phút trước" },
    { id: 7, sender: "Nguyễn Văn A", text: "Tuyệt, cảm ơn!", time: "1 giờ 45 phút trước" },
    { id: 8, sender: "Trần Thị B", text: "Cảm ơn đã hỗ trợ, tôi đã đăng ký thành công.", time: "1 ngày trước" },
    { id: 9, sender: "Bạn", text: "Chúc mừng chị, nếu cần hỗ trợ thêm inbox mình nhé.", time: "23 giờ trước" },
    { id: 10, sender: "Nguyễn Văn A", text: "Một câu hỏi nữa: cần chuẩn bị gì trước khi học?", time: "10 phút trước" },
    { id: 11, sender: "Bạn", text: "Không cần nhiều, có laptop và tinh thần là đủ.", time: "Vừa xong" },
  ];

  const [messagesList, setMessagesList] = useState(hardcodedMessages);
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now(),
      sender: "Bạn",
      text,
      time: "Vừa xong",
    };
    setMessagesList((prev) => [...prev, newMsg]);
    setMessageInput("");
  };

  const handleOpenMessages = () => {
    const opening = !isMessagesOpen;
    setIsMessagesOpen(opening);
    if (opening) {
      // show conversation list first
      setSelectedConversation(null);
      setIsNotifOpen(false);
    } else {
      setSelectedConversation(null);
    }
  };

  // synchronize body class so other components (Chatbot) can arrange when a conversation is opened
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (selectedConversation) {
      document.body.classList.add("header-chat-open");
    } else {
      document.body.classList.remove("header-chat-open");
    }
    return () => {
      document.body.classList.remove("header-chat-open");
    };
  }, [selectedConversation]);

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

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      authApi.clearAuthData();
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      router.push("/");
    }
  };

  return (
    <nav className="w-full px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-brand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z"
                      />
                    </svg>
                  </div>
                </div>

                <svg
                  viewBox="0 0 24 24"
                  className="absolute -inset-1 w-12 h-12 text-accent pointer-events-none spin-accent-strong"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="31.4 31.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Nền tảng học tập trực tuyến
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/courses", label: "Khóa học" },
            { href: "/documents", label: "Tài liệu" },
            { href: "/blogs", label: "Bài viết" },
            { href: "/about", label: "Giới thiệu" },
            { href: "/contact", label: "Liên hệ" },
          ].map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${isActive ? "text-accent border-b-2 border-accent pb-2" : "text-gray-700 hover:text-accent"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {isLoggedIn && (
            <div className="relative flex items-center space-x-2">
              {/* Messages button */}
              <div className="relative">
                <button
                  onClick={handleOpenMessages}
                  className="p-2.5 rounded-full hover:bg-gray-100 text-gray-700 relative"
                  aria-label="Tin nhắn"
                >
                  <HiOutlineChatAlt2 className="w-6 h-6" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-600 rounded-full text-[10px] leading-none" />
                </button>

                {isMessagesOpen && !selectedConversation && (
                  <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 w-full sm:w-96 h-full sm:h-auto bg-white sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-100 z-50 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-accent to-blue-600 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white">Tin nhắn</h3>
                        <button 
                          onClick={() => setIsMessagesOpen(false)}
                          className="text-white/80 hover:text-white transition-colors sm:hidden"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <button className="text-white/80 hover:text-white transition-colors hidden sm:block">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Conversations List - Fixed height with scroll */}
                    <div className="flex-1 sm:h-[420px] overflow-y-auto">
                      {Array.from(new Map(hardcodedMessages.map((m) => [m.sender, m]))).map(([, m]) => (
                        <button
                          key={m.sender}
                          onClick={() => setSelectedConversation(m.sender)}
                          className="w-full text-left px-4 py-3 transition-all hover:bg-gray-50 active:bg-gray-100 border-b border-gray-50 last:border-0 group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-semibold text-base shadow-sm">
                                {m.sender?.charAt(0)}
                              </div>
                              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">{m.sender}</h4>
                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{m.time}</span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-1 group-hover:text-gray-900 transition-colors">
                                {m.text}
                              </p>
                            </div>

                            {/* Unread badge (optional) */}
                            {m.sender !== "Bạn" && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-accent rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                      <button className="w-full text-center text-sm font-medium text-accent hover:text-blue-700 transition-colors">
                        Xem tất cả tin nhắn
                      </button>
                    </div>
                  </div>
                )}

                {isMessagesOpen && selectedConversation && (
                  <div className="header-chat-modal chatbot-window fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-96 h-[85vh] sm:h-[560px] max-h-[820px] sm:max-h-[560px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent to-blue-600 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                            {selectedConversation?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{selectedConversation}</div>
                            <div className="text-xs text-white/80">Đang hoạt động</div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsMessagesOpen(false);
                          setSelectedConversation(null);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Đóng"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                      {messagesList
                        .filter((mm) => mm.sender === selectedConversation || mm.sender === "Bạn")
                        .map((m) => {
                          const isAdmin = m.sender === "Bạn" || m.sender === "Admin";
                          return (
                            <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] ${isAdmin ? "" : "flex items-start gap-2"}`}>
                                {!isAdmin && (
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                    {m.sender?.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div className={`${
                                    isAdmin 
                                      ? "bg-gradient-to-r from-accent to-blue-600 text-white" 
                                      : "bg-white text-gray-900 border border-gray-100"
                                  } px-4 py-2.5 rounded-2xl ${isAdmin ? "rounded-br-sm" : "rounded-bl-sm"} shadow-sm`}>
                                    <div className="text-sm leading-relaxed">{m.text}</div>
                                  </div>
                                  <div className={`mt-1 text-xs text-gray-500 ${isAdmin ? "text-right" : "text-left"} px-1`}>
                                    {m.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 bg-white border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-accent transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <input
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 text-sm"
                          placeholder="Nhập tin nhắn..."
                          aria-label="Nhập tin nhắn"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="bg-transparent p-0 text-accent hover:text-accent-600 flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Gửi"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={handleOpenNotifications}
                  className="p-2.5 rounded-full hover:bg-gray-100 text-gray-700 relative"
                  aria-label="Thông báo"
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
                      <div className="flex">
                        <button
                          onClick={() => handleTabChange("all")}
                          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all relative ${
                            activeTab === "all"
                              ? "text-accent bg-blue-50/50"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          Tất cả
                          {activeTab === "all" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />
                          )}
                        </button>
                        <button
                          onClick={() => handleTabChange("unread")}
                          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all relative ${
                            activeTab === "unread"
                              ? "text-accent bg-blue-50/50"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          Chưa đọc
                          {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-2 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] leading-[18px] rounded-full text-center font-semibold">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                          {activeTab === "unread" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />
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
            </div>
          )}

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-accent transition-colors rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
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
              </button>

              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="sm:hidden p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Thông tin cá nhân</span>
                    </div>
                  </Link>
                  <Link
                    href="/favorites"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>Khóa học yêu thích</span>
                    </div>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Đăng xuất</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-3 sm:px-4 py-1.5 bg-accent hover:bg-accent-600 text-white rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gray-200 shadow-lg">
          <div className="px-3 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3">
            {[
              { href: "/", label: "Trang chủ" },
              { href: "/courses", label: "Khóa học" },
              { href: "/documents", label: "Tài liệu" },
              { href: "/blogs", label: "Bài viết" },
              { href: "/about", label: "Giới thiệu" },
              { href: "/contact", label: "Liên hệ" },
            ].map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 transition-colors ${isActive ? "text-accent font-medium bg-accent-50 rounded" : "text-gray-700 hover:text-accent"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            {isLoggedIn && (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                <Link
                  href="/profile"
                  className="block py-2 text-gray-700 hover:text-accent font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block py-2 text-left text-red-600 hover:text-red-700 font-medium transition-colors w-full"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
