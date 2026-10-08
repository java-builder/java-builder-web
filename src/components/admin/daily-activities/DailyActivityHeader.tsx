"use client";

import { RotateCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface DailyActivityHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DailyActivityHeader = ({
  onRefresh,
  isRefreshing,
}: DailyActivityHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Activity className="w-6 h-6" />
          </div>
          {t("admin.dailyActivities.pageTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("admin.dailyActivities.pageSubtitle")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5 shrink-0 rounded-xl h-9 cursor-pointer hover:bg-muted"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {t("admin.dailyActivities.refreshBtn")}
        </Button>
      </div>
    </div>
  );
};
