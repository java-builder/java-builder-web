"use client";

import { useEffect, useState } from "react";
import { notificationApi, NotificationDetailResponse } from "@/services/notification.service";
import { authApi } from "@/services/auth.service";

type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  read?: boolean;
  meta?: Record<string, string>;
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [detailModal, setDetailModal] = useState<null | { title: string; meta?: Record<string, string> }>(null);

  // Load notifications for current logged-in user
  useEffect(() => {
    const load = async () => {
      if (!authApi.isAuthenticated()) return;
      try {
        const res = await notificationApi.getMyNotifications(1, 50);
        const list = res.result?.result || [];
        const mapped = list.map((it: NotificationDetailResponse) => ({
          id: it.id,
          title: it.title || it.senderName || "Thông báo",
          desc: it.content || "",
          time: it.createdAt ? new Date(it.createdAt).toLocaleString() : "",
          read: it.read ?? false,
          meta: {}, // API doesn't provide meta data
        }));
        setNotifications(mapped);
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    };
    load();
  }, []);

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
    );
  };

  const removeNotification = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications
    .filter((n) => (filter === "all" ? true : !n.read))
    .filter((n) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q)
      );
    });

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Thông báo</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              Quản lý và duyệt các thông báo hệ thống, tương tác với người dùng
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
                className="w-full md:w-80 px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {filtered.length} kết quả
              </div>
            </div>

            <div className="inline-flex items-center rounded-md overflow-hidden bg-white border border-gray-200">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-2 text-sm ${filter === "all" ? "bg-accent-50 text-accent-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-2 text-sm ${filter === "unread" ? "bg-accent-50 text-accent-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Chưa đọc
              </button>
            </div>

            <button
              onClick={markAllRead}
              className="px-3 py-2 text-sm bg-accent-600 text-white rounded-md hover:bg-accent-700"
            >
              Đánh dấu tất cả
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-4">
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">
              Không có thông báo phù hợp
            </div>
          )}

          {filtered.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between p-4 rounded-lg transition-colors shadow-sm ${n.read ? "bg-white hover:bg-gray-50" : "bg-accent-50 border-l-4 border-accent-600"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${n.read ? "bg-gray-100" : "bg-gradient-to-br from-accent-50 to-accent-100"}`}>
                  <svg className={`w-6 h-6 ${n.read ? "text-gray-500" : "text-accent-800"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className={`font-semibold truncate ${n.read ? "text-gray-900" : "text-accent-800"}`}>{n.title}</div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">{n.time}</div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{n.desc}</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!n.read ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-600 text-white">
                    Mới
                  </span>
                ) : null}

                <div className="flex items-center gap-2">
                  {!n.read ? (
                    <button
                      onClick={() => markRead(n.id)}
                      className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-accent rounded"
                      title="Đánh dấu đã đọc"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Đã đọc
                    </button>
                  ) : (
                    <button
                      onClick={() => markUnread(n.id)}
                      className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-accent rounded"
                      title="Đánh dấu chưa đọc"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                      </svg>
                      Chưa đọc
                    </button>
                  )}

                  {n.meta && (
                    <button
                      onClick={() => setDetailModal({ title: n.title, meta: n.meta })}
                      className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-accent rounded"
                      title="Xem chi tiết"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      Chi tiết
                    </button>
                  )}

                  <button
                    onClick={() => removeNotification(n.id)}
                    className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-700 rounded"
                    title="Xóa"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Details modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 backdrop-blur-sm bg-black/10" onClick={() => setDetailModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{detailModal.title}</h3>
                <p className="text-sm text-gray-500">Thông tin đăng nhập</p>
              </div>
              <button onClick={() => setDetailModal(null)} className="p-1 text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(detailModal.meta || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <div className="text-gray-500 capitalize">{k.replace(/_/g, " ")}:</div>
                  <div className="font-medium text-gray-800 ml-2">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setDetailModal(null)} className="px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
