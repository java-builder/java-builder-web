"use client";

import { useState, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { useNotifications, useMarkAsRead } from "@/hooks/useNotifications";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  
  const { data: notifData } = useNotifications(1, activeTab);
  const markAsRead = useMarkAsRead();

  const notifications = notifData?.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      markAsRead.mutate(unreadIds);
    }
  };

  // detect mobile view to render dropdown as fixed sheet (avoid being clipped)
  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const check = () => {
      if (typeof window === "undefined") return;
      setIsMobileView(window.innerWidth < 640);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative" data-dropdown>
      <button
        onClick={handleOpen}
        className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 relative"
        aria-label="Thông báo"
      >
        <HiOutlineBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] leading-[18px] rounded-full text-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`${isMobileView ? "fixed inset-x-2 top-16" : "absolute right-2 sm:right-0"} mt-2 w-[min(94vw,24rem)] sm:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 max-h-[70vh]`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-slate-700">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Thông báo</div>
            <div className="flex">
              {(["all", "unread"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all relative ${
                    activeTab === tab 
                      ? "text-accent bg-blue-50/50 dark:bg-slate-700" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab === "all" ? "Tất cả" : "Chưa đọc"}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[420px] overflow-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {activeTab === "unread" ? "Không có thông báo chưa đọc" : "Chưa có thông báo"}
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    !n.read
                      ? "bg-blue-50/50 dark:bg-slate-700/50"
                      : "hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                    {n.avatar ? (
                      <Image src={n.avatar} alt="" width={36} height={36} className="w-full h-full object-cover rounded-full" unoptimized />
                    ) : (
                      <span className="text-xs text-gray-600 dark:text-gray-300">{(n.senderName || "U")[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">{n.title}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.createdAt}</div>
                  </div>
                  {/* thumbnail hidden on FE per request */}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
