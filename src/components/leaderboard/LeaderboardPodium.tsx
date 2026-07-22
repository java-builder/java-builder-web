"use client";

import Image from "next/image";
import { LeaderboardUser } from "@/types/user-streak";
import { useI18n } from "@/contexts/I18nContext";
import { Flame, Crown } from "lucide-react";

interface LeaderboardPodiumProps {
  topUsers: LeaderboardUser[];
}

export function LeaderboardPodium({ topUsers }: LeaderboardPodiumProps) {
  const { t } = useI18n();
  const rank1 = topUsers[0];
  const rank2 = topUsers[1];
  const rank3 = topUsers[2];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-end">
      {rank2 ? (
        <div className="order-2 sm:order-1 rounded-[36px] border border-border bg-card p-4 text-center space-y-2.5 shadow-xs hover:border-orange-500/30 transition-all">
          <div className="relative mx-auto w-14 h-14 aspect-square shrink-0 rounded-full border-2 border-slate-300 p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-muted">
              {rank2.avatar ? (
                <Image src={rank2.avatar} alt={rank2.username || "User"} fill className="object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-700 font-bold text-xs rounded-full">
                  {(rank2.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1.5 right-1/2 translate-x-1/2 bg-slate-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-xs">
              2
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-foreground truncate max-w-[140px] mx-auto">
              {rank2.username || rank2.userId}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate max-w-[140px] mx-auto">{rank2.email}</p>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            {rank2.currentStreak} {t("leaderboardPage.daysCount")}
          </div>
        </div>
      ) : (
        <div className="order-2 sm:order-1 rounded-[36px] border border-dashed border-border bg-card/40 p-4 text-center space-y-2.5 opacity-60">
          <div className="relative mx-auto w-14 h-14 aspect-square shrink-0 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20">
            <span className="text-xs font-extrabold text-muted-foreground">2</span>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-muted-foreground">{t("leaderboardPage.waitingCandidate")}</h4>
            <p className="text-[11px] text-muted-foreground/70">{t("leaderboardPage.silverPosition")}</p>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            {t("leaderboardPage.noData")}
          </div>
        </div>
      )}

      {rank1 ? (
        <div className="order-1 sm:order-2 rounded-[36px] border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/10 via-card to-card p-5 text-center space-y-3 shadow-md sm:scale-105 z-10 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Crown className="w-3 h-3 fill-white" /> {t("leaderboardPage.champion")}
          </div>
          <div className="relative mx-auto w-16 h-16 aspect-square shrink-0 rounded-full border-2 border-amber-500 p-0.5 shadow-xs">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-muted">
              {rank1.avatar ? (
                <Image src={rank1.avatar} alt={rank1.username || "User"} fill className="object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-500 text-white font-bold text-sm rounded-full">
                  {(rank1.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1.5 right-1/2 translate-x-1/2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shadow-xs">
              1
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-foreground truncate max-w-[160px] mx-auto">
              {rank1.username || rank1.userId}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate max-w-[160px] mx-auto">{rank1.email}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500 text-white font-extrabold text-xs shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-white text-white" />
            {rank1.currentStreak} {t("leaderboardPage.dayStreak")}
          </div>
        </div>
      ) : (
        <div className="order-1 sm:order-2 rounded-[36px] border-2 border-dashed border-amber-500/40 bg-card/40 p-5 text-center space-y-3 opacity-60">
          <div className="relative mx-auto w-16 h-16 aspect-square shrink-0 rounded-full border border-dashed border-amber-500/40 flex items-center justify-center bg-amber-500/10">
            <Crown className="w-5 h-5 text-amber-500/60" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-muted-foreground">{t("leaderboardPage.waitingChampion")}</h4>
            <p className="text-[11px] text-muted-foreground/70">{t("leaderboardPage.goldPosition")}</p>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-muted text-muted-foreground text-xs font-medium">
            {t("leaderboardPage.noData")}
          </div>
        </div>
      )}

      {rank3 ? (
        <div className="order-3 rounded-[36px] border border-border bg-card p-4 text-center space-y-2.5 shadow-xs hover:border-orange-500/30 transition-all">
          <div className="relative mx-auto w-14 h-14 aspect-square shrink-0 rounded-full border-2 border-amber-700/60 p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-muted">
              {rank3.avatar ? (
                <Image src={rank3.avatar} alt={rank3.username || "User"} fill className="object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-800 text-white font-bold text-xs rounded-full">
                  {(rank3.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1.5 right-1/2 translate-x-1/2 bg-amber-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-xs">
              3
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-foreground truncate max-w-[140px] mx-auto">
              {rank3.username || rank3.userId}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate max-w-[140px] mx-auto">{rank3.email}</p>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            {rank3.currentStreak} {t("leaderboardPage.daysCount")}
          </div>
        </div>
      ) : (
        <div className="order-3 rounded-[36px] border border-dashed border-border bg-card/40 p-4 text-center space-y-2.5 opacity-60">
          <div className="relative mx-auto w-14 h-14 aspect-square shrink-0 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20">
            <span className="text-xs font-extrabold text-muted-foreground">3</span>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-muted-foreground">{t("leaderboardPage.waitingCandidate")}</h4>
            <p className="text-[11px] text-muted-foreground/70">{t("leaderboardPage.bronzePosition")}</p>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            {t("leaderboardPage.noData")}
          </div>
        </div>
      )}
    </div>
  );
}
