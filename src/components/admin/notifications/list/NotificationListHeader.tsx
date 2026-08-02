"use client";

import { useI18n } from "@/contexts/I18nContext";

interface NotificationListHeaderProps {
  unreadCount: number;
  totalCount: number;
}

export default function NotificationListHeader({
  unreadCount,
  totalCount,
}: NotificationListHeaderProps) {
  const { t } = useI18n();

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">
        {t("admin.notifications.pageTitle")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {totalCount === 0
          ? t("admin.common.noData")
          : unreadCount > 0
          ? `${t("admin.notifications.colTitle")}: ${unreadCount} / ${totalCount}`
          : `${t("admin.notifications.colTitle")}: ${totalCount}`}
      </p>
    </div>
  );
}
