"use client";

import { useStreakLeaderboard } from "@/hooks/useUserStreak";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardPodium } from "@/components/leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardCurrentUserBar } from "@/components/leaderboard/LeaderboardCurrentUserBar";

export default function StreakLeaderboardPage() {
  const { data, isLoading } = useStreakLeaderboard();

  const topUsers = data?.topUsers || [];
  const currentUser = data?.currentUser || null;

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <LeaderboardHeader />
      {!isLoading && <LeaderboardPodium topUsers={topUsers} />}
      <LeaderboardTable topUsers={topUsers} currentUser={currentUser} isLoading={isLoading} />
      <LeaderboardCurrentUserBar currentUser={currentUser} />
    </div>
  );
}
