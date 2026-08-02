"use client";

import { Bell, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface UserStreakHeaderProps {
  onOpenReminder: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const UserStreakHeader = ({
  onOpenReminder,
  onRefresh,
  isRefreshing,
}: UserStreakHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("admin.userStreaks.pageTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("admin.userStreaks.pageSubtitle")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onOpenReminder}
          className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-sm transition-all rounded-xl cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {t("admin.userStreaks.sendReminderBtn")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5 shrink-0 rounded-xl h-9 cursor-pointer"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {t("admin.questionContributions.refreshBtn")}
        </Button>
      </div>
    </div>
  );
};
