"use client";

interface NotificationListHeaderProps {
  unreadCount: number;
  totalCount: number;
}

export default function NotificationListHeader({
  unreadCount,
  totalCount,
}: NotificationListHeaderProps) {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        Trung tâm thông báo
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        {totalCount === 0
          ? "Bạn chưa có thông báo nào"
          : unreadCount > 0
          ? `Bạn có ${unreadCount} thông báo chưa đọc trong tổng số ${totalCount}`
          : `Tất cả ${totalCount} thông báo đã được đọc`}
      </p>
    </div>
  );
}
