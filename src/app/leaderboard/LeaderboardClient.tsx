"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Zap,
  Search,
  ArrowRight,
  Sparkles,
  Flame
} from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl?: string;
  levelName: string;
  xp: number;
  trend: "up" | "down" | "same";
  solvedCount: number;
  streak: number;
  accuracy: number;
  rankChange: number;
  isCurrentUser?: boolean;
}

// Mock data for weekly ranking
const weeklyRankings: LeaderboardUser[] = [
  { rank: 1, name: "Hoàng Minh", levelName: "Spring Master", xp: 2450, trend: "same", solvedCount: 32, streak: 15, accuracy: 94, rankChange: 0 },
  { rank: 2, name: "Nguyễn Hương", levelName: "Concurrency Guru", xp: 2120, trend: "up", solvedCount: 28, streak: 8, accuracy: 89, rankChange: 2 },
  { rank: 3, name: "Trần Nam", levelName: "Java Expert", xp: 1980, trend: "down", solvedCount: 24, streak: 12, accuracy: 91, rankChange: -1 },
  { rank: 4, name: "Phạm Thảo", levelName: "OOP Architect", xp: 1850, trend: "up", solvedCount: 22, streak: 5, accuracy: 88, rankChange: 1 },
  { rank: 5, name: "Lê Cường", levelName: "Java Expert", xp: 1620, trend: "same", solvedCount: 19, streak: 14, accuracy: 85, rankChange: 0 },
  { rank: 6, name: "Vũ Hải", levelName: "JVM Master", xp: 1540, trend: "down", solvedCount: 17, streak: 6, accuracy: 82, rankChange: -2 },
  { rank: 7, name: "Đỗ Oanh", levelName: "Spring Master", xp: 1480, trend: "up", solvedCount: 16, streak: 9, accuracy: 90, rankChange: 3 },
  { rank: 8, name: "Bùi Tuấn", levelName: "Java Apprentice", xp: 1310, trend: "same", solvedCount: 15, streak: 7, accuracy: 87, rankChange: 0, isCurrentUser: true },
  { rank: 9, name: "Phan Hà", levelName: "Java Expert", xp: 1250, trend: "down", solvedCount: 14, streak: 4, accuracy: 84, rankChange: -1 },
  { rank: 10, name: "Ngô Trung", levelName: "OOP Architect", xp: 1190, trend: "up", solvedCount: 12, streak: 10, accuracy: 86, rankChange: 1 },
];

// Mock data for monthly ranking
const monthlyRankings: LeaderboardUser[] = [
  { rank: 1, name: "Nguyễn Hương", levelName: "Concurrency Guru", xp: 8900, trend: "up", solvedCount: 112, streak: 22, accuracy: 91, rankChange: 1 },
  { rank: 2, name: "Hoàng Minh", levelName: "Spring Master", xp: 8450, trend: "down", solvedCount: 105, streak: 28, accuracy: 93, rankChange: -1 },
  { rank: 3, name: "Phạm Thảo", levelName: "OOP Architect", xp: 7650, trend: "up", solvedCount: 96, streak: 19, accuracy: 89, rankChange: 2 },
  { rank: 4, name: "Trần Nam", levelName: "Java Expert", xp: 7200, trend: "down", solvedCount: 90, streak: 15, accuracy: 88, rankChange: -1 },
  { rank: 5, name: "Đỗ Oanh", levelName: "Spring Master", xp: 6480, trend: "up", solvedCount: 82, streak: 21, accuracy: 87, rankChange: 1 },
  { rank: 6, name: "Lê Cường", levelName: "Java Expert", xp: 6120, trend: "same", solvedCount: 78, streak: 24, accuracy: 84, rankChange: 0 },
  { rank: 7, name: "Bùi Tuấn", levelName: "Java Apprentice", xp: 5800, trend: "up", solvedCount: 74, streak: 18, accuracy: 86, rankChange: 3, isCurrentUser: true },
  { rank: 8, name: "Vũ Hải", levelName: "JVM Master", xp: 5400, trend: "down", solvedCount: 68, streak: 14, accuracy: 81, rankChange: -2 },
  { rank: 9, name: "Phan Hà", levelName: "Java Expert", xp: 4950, trend: "same", solvedCount: 62, streak: 11, accuracy: 83, rankChange: 0 },
  { rank: 10, name: "Ngô Trung", levelName: "OOP Architect", xp: 4720, trend: "up", solvedCount: 59, streak: 16, accuracy: 85, rankChange: 1 },
];

// Mock data for all time ranking
const allTimeRankings: LeaderboardUser[] = [
  { rank: 1, name: "Hoàng Minh", levelName: "Spring Master", xp: 54200, trend: "same", solvedCount: 712, streak: 142, accuracy: 92, rankChange: 0 },
  { rank: 2, name: "Nguyễn Hương", levelName: "Concurrency Guru", xp: 48900, trend: "same", solvedCount: 645, streak: 115, accuracy: 90, rankChange: 0 },
  { rank: 3, name: "Trần Nam", levelName: "Java Expert", xp: 41200, trend: "same", solvedCount: 520, streak: 92, accuracy: 89, rankChange: 0 },
  { rank: 4, name: "Phạm Thảo", levelName: "OOP Architect", xp: 38700, trend: "same", solvedCount: 482, streak: 76, accuracy: 88, rankChange: 0 },
  { rank: 5, name: "Vũ Hải", levelName: "JVM Master", xp: 32400, trend: "same", solvedCount: 410, streak: 64, accuracy: 83, rankChange: 0 },
  { rank: 6, name: "Đỗ Oanh", levelName: "Spring Master", xp: 31200, trend: "same", solvedCount: 395, streak: 81, accuracy: 87, rankChange: 0 },
  { rank: 7, name: "Lê Cường", levelName: "Java Expert", xp: 29500, trend: "same", solvedCount: 368, streak: 70, accuracy: 85, rankChange: 0 },
  { rank: 8, name: "Phan Hà", levelName: "Java Expert", xp: 26400, trend: "same", solvedCount: 325, streak: 55, accuracy: 82, rankChange: 0 },
  { rank: 9, name: "Bùi Tuấn", levelName: "Java Apprentice", xp: 23100, trend: "same", solvedCount: 292, streak: 60, accuracy: 86, rankChange: 0, isCurrentUser: true },
  { rank: 10, name: "Ngô Trung", levelName: "OOP Architect", xp: 21800, trend: "same", solvedCount: 275, streak: 48, accuracy: 84, rankChange: 0 },
];

export default function LeaderboardClient() {
  const [activeTab, setActiveTab] = useState<"week" | "month" | "all">("week");
  const [searchQuery, setSearchQuery] = useState("");

  const currentRankings = useMemo(() => {
    switch (activeTab) {
      case "month":
        return monthlyRankings;
      case "all":
        return allTimeRankings;
      default:
        return weeklyRankings;
    }
  }, [activeTab]);

  const filteredRankings = useMemo(() => {
    if (!searchQuery.trim()) return currentRankings;
    return currentRankings.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentRankings, searchQuery]);

  // Find top 3
  const top1 = currentRankings.find(u => u.rank === 1);
  const top2 = currentRankings.find(u => u.rank === 2);
  const top3 = currentRankings.find(u => u.rank === 3);

  // Remaining users starting from rank 4
  const listUsers = filteredRankings.filter(u => u.rank > 3 || searchQuery.trim() !== "");

  // Logged-in user stats
  const currentUserStats = useMemo(() => {
    return currentRankings.find(u => u.isCurrentUser);
  }, [currentRankings]);

  // Find user ranked right above the current user to display competitive target
  const nextTargetUser = useMemo(() => {
    if (!currentUserStats) return null;
    return currentRankings.find(u => u.rank === currentUserStats.rank - 1);
  }, [currentUserStats, currentRankings]);




  const getRankIndicator = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 font-bold text-amber-500">
            <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
            1
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 font-bold text-slate-400">
            <Crown className="w-4 h-4 fill-slate-400 text-slate-400" />
            2
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 font-bold text-orange-500">
            <Crown className="w-4 h-4 fill-orange-500 text-orange-500" />
            3
          </span>
        );
      default:
        return <span className="font-semibold text-gray-500 dark:text-gray-400 pl-5">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

        {/* Header Section (High-fidelity tech mesh card style) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
          {/* Grid background mesh overlay */}
          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          {/* Glow points */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 h-36 w-36 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Đại sảnh vinh danh
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Bảng Xếp Hạng Lập Trình
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Nơi tôn vinh những nỗ lực bền bỉ và tài năng vượt trội. Hãy kiên trì học tập, tích lũy XP qua từng dòng code để vươn lên đỉnh vinh quang.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shadow-lg relative group">
                <Trophy className="w-10 h-10 text-amber-400 drop-shadow-md group-hover:scale-110 transition duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* User Rank Stats Card (Sleek Clean Vercel-style Profile Widget) */}
        {currentUserStats && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">

            {/* Left section: User name, avatar, and level */}
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              {/* User Avatar Circle with First Letter */}
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black border border-indigo-100 dark:border-indigo-900 text-lg shadow-sm flex-shrink-0">
                {currentUserStats.name.charAt(0)}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-gray-900 dark:text-white text-base">
                    {currentUserStats.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                    {currentUserStats.levelName}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Thứ hạng của bạn: <span className="font-extrabold text-gray-900 dark:text-white text-sm">Thứ {currentUserStats.rank}</span>
                </p>
              </div>
            </div>

            {/* Middle section: Weekly progress tracking */}
            <div className="flex-1 w-full md:max-w-xs space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span>Điểm tích lũy</span>
                <span className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-extrabold">
                  <Zap className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
                  {currentUserStats.xp} XP
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentUserStats.xp / (top1?.xp || 3000)) * 100, 100)}%` }}
                />
              </div>
              {nextTargetUser && (
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  Còn thiếu <strong className="text-indigo-600 dark:text-indigo-400">{nextTargetUser.xp - currentUserStats.xp} XP</strong> để vượt qua <strong className="text-gray-700 dark:text-gray-200">@{nextTargetUser.name}</strong> (Thứ {nextTargetUser.rank})
                </p>
              )}
            </div>

            {/* Right section: CTA Button (Minimalist clean style with bg-accent) */}
            <Link
              href="/exercises"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white transition duration-200 font-bold rounded-xl text-xs shadow-sm cursor-pointer select-none"
            >
              Học ngay kiếm XP
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Tab Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tab buttons */}
          <div className="flex p-1 rounded-xl bg-gray-200/50 dark:bg-slate-800/80 border border-gray-200/10 dark:border-slate-800/20 w-full sm:w-auto shadow-inner">
            <button
              onClick={() => setActiveTab("week")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer select-none ${activeTab === "week"
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-150 dark:border-slate-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setActiveTab("month")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer select-none ${activeTab === "month"
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-150 dark:border-slate-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              Tháng này
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer select-none ${activeTab === "all"
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-150 dark:border-slate-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              Tất cả thời gian
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-colors duration-300"
            />
          </div>
        </div>

        {/* Podium Top 3 Section (Gamer/Coder Premium Podium Design) */}
        {searchQuery.trim() === "" && (
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-4 pt-12 pb-6 border-b border-gray-200 dark:border-slate-800/80">

            {/* TOP 2 Step */}
            {top2 && (
              <div className="flex flex-col items-center w-full md:w-44 order-2 md:order-1 hover:-translate-y-1 transition-transform duration-300">
                {/* Avatar sitting above step */}
                <div className="relative -mb-2 z-10 flex flex-col items-center">
                  <Crown className="w-7 h-7 text-slate-400 absolute -top-5.5 transform fill-slate-400" />
                  <div className="w-16 h-16 rounded-full border-[3px] border-slate-300 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700/60 flex items-center justify-center shadow-md overflow-hidden">
                    <span className="text-lg font-black text-slate-700 dark:text-slate-350">{top2.name.charAt(0)}</span>
                  </div>
                </div>
                {/* Step Block */}
                <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-t-xl pt-9 pb-4 px-3 text-center shadow-sm h-40 flex flex-col justify-between relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.08]">
                    <span className="text-7.5xl font-black text-slate-900 dark:text-white select-none">2</span>
                  </div>

                  {/* Banner inside block */}
                  <div className="relative z-10">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-slate-500 dark:bg-slate-600 text-[9px] font-bold text-white uppercase tracking-wider shadow-sm border border-slate-400/20 whitespace-nowrap">
                      🥈 Á Quân 1
                    </span>
                  </div>

                  <div className="relative z-10 mt-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{top2.name}</h3>
                    <p className="text-[10px] text-gray-550 dark:text-gray-400 truncate mt-0.5">{top2.levelName}</p>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-0.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-250 dark:border-slate-700 shadow-sm">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {top2.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TOP 1 Step (Highlighted) */}
            {top1 && (
              <div className="flex flex-col items-center w-full md:w-52 order-1 md:order-2 z-10 hover:-translate-y-1 transition-transform duration-300">
                {/* Avatar sitting above step */}
                <div className="relative -mb-2.5 z-10 flex flex-col items-center">
                  <Crown className="w-8 h-8 text-amber-400 absolute -top-7 transform animate-bounce fill-amber-500" style={{ animationDuration: "3s" }} />
                  <div className="w-20 h-20 rounded-full border-[4px] border-amber-400 bg-gradient-to-tr from-amber-200 to-yellow-100 dark:from-amber-950 dark:to-yellow-900/40 flex items-center justify-center shadow-lg overflow-hidden">
                    <span className="text-2xl font-black text-amber-850 dark:text-amber-300">{top1.name.charAt(0)}</span>
                  </div>
                </div>
                {/* Step Block */}
                <div className="w-full bg-gradient-to-b from-amber-500/[0.05] to-white dark:from-amber-950/[0.12] dark:to-slate-800 border-x-2 border-t-2 border-amber-400 dark:border-amber-500/50 rounded-t-2xl pt-9 pb-5 px-3 text-center shadow-md h-48 flex flex-col justify-between relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] dark:opacity-[0.1]">
                    <span className="text-9xl font-black text-amber-500 select-none">1</span>
                  </div>

                  {/* Banner inside block */}
                  <div className="relative z-10">
                    <span className="inline-flex px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-[10px] font-black text-white uppercase tracking-widest shadow-md border border-amber-400/35 whitespace-nowrap">
                      🏆 Quán Quân
                    </span>
                  </div>

                  <div className="relative z-10 mt-1">
                    <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-300 truncate">{top1.name}</h3>
                    <p className="text-[10px] text-amber-650 dark:text-amber-500 truncate mt-0.5">{top1.levelName}</p>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-xs font-black text-white shadow-md shadow-amber-500/10">
                      <Zap className="w-3.5 h-3.5 fill-white text-white" />
                      {top1.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TOP 3 Step */}
            {top3 && (
              <div className="flex flex-col items-center w-full md:w-44 order-3 hover:-translate-y-1 transition-transform duration-300">
                {/* Avatar sitting above step */}
                <div className="relative -mb-2 z-10 flex flex-col items-center">
                  <Crown className="w-7 h-7 text-orange-555 absolute -top-5.5 transform fill-orange-555/40" />
                  <div className="w-16 h-16 rounded-full border-[3px] border-orange-400/60 bg-gradient-to-tr from-orange-200 to-orange-100 dark:from-orange-950/60 dark:to-orange-900/40 flex items-center justify-center shadow-md overflow-hidden">
                    <span className="text-lg font-black text-orange-850 dark:text-orange-355">{top3.name.charAt(0)}</span>
                  </div>
                </div>
                {/* Step Block */}
                <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-t-xl pt-9 pb-4 px-3 text-center shadow-sm h-36 flex flex-col justify-between relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.08]">
                    <span className="text-6.5xl font-black text-orange-555 select-none">3</span>
                  </div>

                  {/* Banner inside block */}
                  <div className="relative z-10">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-orange-600 text-[9px] font-bold text-white uppercase tracking-wider shadow-sm border border-orange-400/25 whitespace-nowrap">
                      🥉 Á Quân 2
                    </span>
                  </div>

                  <div className="relative z-10 mt-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{top3.name}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{top3.levelName}</p>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-0.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-250 dark:border-slate-700 shadow-sm">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {top3.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[8%] min-w-[80px] whitespace-nowrap">
                    Hạng
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[32%] min-w-[240px] whitespace-nowrap">
                    Học viên
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[18%] min-w-[140px] whitespace-nowrap">
                    Chuỗi học tập
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[12%] min-w-[100px] whitespace-nowrap">
                    Đã giải
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%] min-w-[120px] whitespace-nowrap">
                    Độ chính xác
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%] min-w-[140px] whitespace-nowrap">
                    Hiệu suất tuần
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {listUsers.map((user) => {
                  return (
                    <tr
                      key={user.rank}
                      className={`transition-colors duration-150 ${user.isCurrentUser
                          ? "bg-accent/[0.04] dark:bg-accent/[0.08] hover:bg-accent/[0.06] dark:hover:bg-accent/[0.1] font-semibold"
                          : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                      {/* Rank column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getRankIndicator(user.rank)}
                      </td>

                      {/* User profile column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-black text-xs ${user.isCurrentUser
                              ? "bg-accent/20 text-accent border border-accent/30"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-650 dark:text-gray-300 border border-gray-200/80 dark:border-slate-650"
                            }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {user.name}
                              </span>
                              {user.isCurrentUser && (
                                <span className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold uppercase tracking-wider">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-450 dark:text-gray-500 font-medium">
                              {user.levelName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Streak Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400">
                          <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                          <span>{user.streak} ngày</span>
                        </div>
                      </td>

                      {/* Solved Count Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {user.solvedCount} bài
                      </td>

                      {/* Accuracy Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className={`text-sm font-semibold ${user.accuracy >= 90
                              ? "text-emerald-600 dark:text-emerald-400"
                              : user.accuracy >= 85
                                ? "text-amber-500"
                                : "text-rose-505"
                            }`}>
                            {user.accuracy}%
                          </span>
                        </div>
                      </td>

                      {/* XP count column */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-extrabold text-gray-900 dark:text-gray-100">
                        <div className="inline-flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>+{user.xp.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">XP</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {listUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Không tìm thấy học viên tương ứng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
