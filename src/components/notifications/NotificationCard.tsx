import Image from "next/image";
import { NotificationItem } from "@/types/notification";
import { formatRelativeTime } from "@/utils/dateUtils";
import { useI18n } from "@/contexts/I18nContext";

interface NotificationCardProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
}

export default function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const { t } = useI18n();

  return (
    <div
      onClick={() => onClick(notification)}
      className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer ${
        notification.isRead
          ? "bg-white dark:bg-slate-800"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-indigo-950/70"
      } shadow-sm`}
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
            ? "text-gray-700 dark:text-slate-200" 
            : "text-gray-900 dark:text-white"
        }`}>
          {notification.title}
        </h3>
        <p className={`text-sm line-clamp-2 mb-2 ${
          notification.isRead
            ? "text-gray-500 dark:text-slate-300"
            : "text-gray-700 dark:text-slate-200"
        }`}>
          {notification.content}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-400">
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
            <span>{formatRelativeTime(notification.createdAt, t)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
