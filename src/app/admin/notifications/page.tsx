"use client";

import { useState } from "react";
import Link from "next/link";

const initialNotifications = [
  {
    id: "n1",
    title: "Người dùng mới đăng ký",
    desc: "Nguyễn Văn A đã đăng ký khóa học React",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: "n2",
    title: "Báo cáo đã sẵn sàng",
    desc: "Báo cáo tuần đã được tổng hợp",
    time: "2 giờ trước",
    read: false,
  },
  {
    id: "n3",
    title: "Hệ thống cập nhật",
    desc: "Bảo trì định kỳ hoàn tất",
    time: "1 ngày trước",
    read: true,
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Thông báo</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Đánh dấu đã đọc
          </button>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-accent"
          >
            Quay lại
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between p-3 rounded ${n.read ? "bg-gray-50" : "bg-accent-50 border border-accent/20"}`}
            >
              <div>
                <div className="font-medium text-gray-800">{n.title}</div>
                <div className="text-sm text-gray-500">{n.desc}</div>
                <div className="text-xs text-gray-400 mt-1">{n.time}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!n.read && (
                  <span className="text-xs text-accent font-semibold">Mới</span>
                )}
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="text-xs text-gray-600 hover:text-accent"
                  >
                    Đánh dấu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
