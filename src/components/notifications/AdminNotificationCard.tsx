import Image from "next/image";
import { NotificationItem } from "@/types/notification";
import { formatRelativeTime } from "@/utils/dateUtils";

interface AdminNotificationCardProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
  onDelete: (id: string) => void;
}

export default function AdminNotificationCard({ notification, onClick, onDelete }: AdminNotificationCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all group ${
        notification.isRead
          ? "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30"
      } shadow-sm hover:shadow-md`}
      onClick={() => onClick(notification)}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
      )}

      {/* Avatar */}
      <div className="flex-shrink-0 ml-2">
        {notification.avatar ? (
          <Image
            src={notification.avatar}
            alt={notification.senderName || "Avatar"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"
            unoptimized
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {(notification.senderName || notification.title || "U")[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-semibold line-clamp-1 mb-1.5 ${
          notification.isRead 
            ? "text-gray-700 dark:text-gray-300" 
            : "text-gray-900 dark:text-white"
        }`}>
          {notification.title}
        </h3>
        <p className={`text-sm line-clamp-2 mb-2 ${
          notification.isRead
            ? "text-gray-500 dark:text-gray-400"
            : "text-gray-700 dark:text-gray-300"
        }`}>
          {notification.content}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          {notification.senderName && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{notification.senderName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatRelativeTime(notification.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
        title="Xóa thông báo"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
