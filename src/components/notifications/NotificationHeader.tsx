interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export default function NotificationHeader({ unreadCount, onMarkAllRead }: NotificationHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông báo</h1>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-sm text-accent hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {unreadCount > 0 ? `Có ${unreadCount} thông báo chưa đọc` : "Không có thông báo mới"}
      </p>
    </div>
  );
}
