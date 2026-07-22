"use client";

import Image from "next/image";
import { LeaderboardUser } from "@/types/user-streak";
import { useI18n } from "@/contexts/I18nContext";
import { Flame, Crown, Medal, Award, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface LeaderboardTableProps {
  topUsers: LeaderboardUser[];
  currentUser: LeaderboardUser | null;
  isLoading: boolean;
}

export function LeaderboardTable({ topUsers, currentUser, isLoading }: LeaderboardTableProps) {
  const { t } = useI18n();

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center font-bold text-xs shadow-xs">
            <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-300/20 text-slate-400 border border-slate-400/40 flex items-center justify-center font-bold text-xs shadow-xs">
            <Medal className="w-3.5 h-3.5 text-slate-400" />
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 border border-amber-600/40 flex items-center justify-center font-bold text-xs shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center font-bold text-xs">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="p-3.5 sm:p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <h3 className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          {t("leaderboardPage.top10Title")}
        </h3>
        <span className="text-[11px] text-muted-foreground">{t("leaderboardPage.realtimeUpdate")}</span>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-muted rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {topUsers.map((user) => {
            const isMe = currentUser && currentUser.userId === user.userId;
            return (
              <div
                key={user.userId}
                className={`flex items-center justify-between p-3 sm:p-4 transition-colors gap-3 ${
                  isMe ? "bg-orange-500/10 border-l-4 border-orange-500" : "hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{getRankBadge(user.rank)}</div>

                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0 bg-muted">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.username || "User"} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-500/10 text-orange-600 font-bold text-xs">
                        {(user.username || user.userId).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-foreground truncate">
                        {user.username || t("leaderboardPage.student")}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-orange-500 text-white shrink-0">
                          {t("leaderboardPage.you")}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate hidden sm:block">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400">
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                      {user.currentStreak} {t("leaderboardPage.daysCount")}
                    </span>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">
                      {t("leaderboardPage.record")} {user.longestStreak} {t("leaderboardPage.daysCount")}
                    </span>
                  </div>

                  <div>
                    {Boolean(user.isMaintainedToday ?? user.maintainedToday) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> <span className="hidden sm:inline">{t("leaderboardPage.learned")}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-3 h-3" /> <span className="hidden sm:inline">{t("leaderboardPage.notLearned")}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
