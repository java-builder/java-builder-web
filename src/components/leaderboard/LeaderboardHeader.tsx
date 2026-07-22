"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Sparkles } from "lucide-react";

export function LeaderboardHeader() {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 p-5 sm:p-6">
      <div className="relative z-10 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          {t("leaderboardPage.badge")}
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          {t("leaderboardPage.title")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          {t("leaderboardPage.subtitle")}
        </p>
      </div>
    </div>
  );
}
