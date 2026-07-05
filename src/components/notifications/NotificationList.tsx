import { NotificationItem } from "@/types/notification";
import NotificationCard from "./NotificationCard";
import { useI18n } from "@/contexts/I18nContext";

interface NotificationListProps {
  notifications: NotificationItem[];
  onNotificationClick: (notification: NotificationItem) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function NotificationList({
  notifications,
  onNotificationClick,
  isLoading,
  hasMore,
  onLoadMore,
}: NotificationListProps) {
  const { t } = useI18n();

  if (notifications.length === 0 && isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl animate-pulse">
            <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3.5 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {t("notificationsPage.emptyTitle")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("notificationsPage.emptyDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClick={onNotificationClick}
        />
      ))}

      {/* Load More Skeletons */}
      {isLoading && (
        <div className="space-y-3 pt-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl animate-pulse opacity-60">
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3.5 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && onLoadMore && !isLoading && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="px-6 py-2.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
          >
            <span>{t("notificationsPage.viewMore")}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
