"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface SessionsHeaderProps {
  totalCount: number;
}

export const SessionsHeader = ({ totalCount }: SessionsHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("admin.sessions.pageTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("admin.sessions.pageSubtitle")}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {totalCount > 0 && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent dark:text-accent-on-dark">
            {t("admin.sessionsAnalytics.totalSessions")}:{" "}
            <span className="font-bold tabular-nums">
              {totalCount.toLocaleString()}
            </span>
          </span>
        )}
        <Link
          href="/admin/reports#session-analytics"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <BarChart3 className="h-4 w-4 mr-1.5" />
          {t("admin.sessions.analyticsBtn")}
        </Link>
      </div>
    </div>
  );
};
