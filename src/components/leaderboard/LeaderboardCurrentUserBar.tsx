"use client";

import Image from "next/image";
import { LeaderboardUser } from "@/types/user-streak";
import { useI18n } from "@/contexts/I18nContext";
import { Flame } from "lucide-react";

interface LeaderboardCurrentUserBarProps {
  currentUser: LeaderboardUser | null;
}

export function LeaderboardCurrentUserBar({ currentUser }: LeaderboardCurrentUserBarProps) {
  const { t } = useI18n();

  if (!currentUser) return null;

  return (
    <div className="rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 p-3.5 sm:p-4 flex items-center justify-between gap-3 mt-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 bg-muted">
          {currentUser.avatar ? (
            <Image
              src={currentUser.avatar}
              alt={currentUser.username || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white font-bold text-xs">
              {(currentUser.username || currentUser.userId).charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
          <span className="font-bold text-foreground truncate max-w-[120px] sm:max-w-none">
            {currentUser.username || currentUser.email || t("leaderboardPage.student")}
          </span>
          <span className="text-muted-foreground mx-0.5">•</span>
          <span className="text-muted-foreground shrink-0 hidden sm:inline">{t("leaderboardPage.userRankNotice")}</span>
          <span className="text-muted-foreground shrink-0 sm:hidden">{t("leaderboardPage.rankShort")}</span>
          <span className="font-black text-orange-600 dark:text-orange-400 text-sm shrink-0">
            {currentUser.rank}
          </span>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 font-extrabold text-xs shrink-0">
        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
        {currentUser.currentStreak} {t("leaderboardPage.dayStreak")}
      </div>
    </div>
  );
}
