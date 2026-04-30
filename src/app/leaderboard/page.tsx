"use client";

import { useState } from "react";
import { mockLeaderboard, timeRanges } from "@/data/mockData";

export default function LeaderboardPage() {
  const [selectedRange, setSelectedRange] = useState("month");
  const [isLoading] = useState(false);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">3</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
        <span className="text-gray-600 dark:text-gray-400 font-semibold">{rank}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Bảng xếp hạng
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Xem thứ hạng của bạn và cạnh tranh với các học viên khác
              </p>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedRange === range.value
                    ? "bg-accent text-white"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* Rank 2 */}
            <div className="text-center">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-gray-200 dark:border-slate-700 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    {mockLeaderboard[1]?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {mockLeaderboard[1]?.username}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {mockLeaderboard[1]?.points.toLocaleString()} điểm
                </p>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border-2 border-yellow-400 dark:border-yellow-600 mb-2 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="w-14 h-14 bg-yellow-200 dark:bg-yellow-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                    {mockLeaderboard[0]?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                  {mockLeaderboard[0]?.username}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                  {mockLeaderboard[0]?.points.toLocaleString()} điểm
                </p>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="text-center">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-gray-200 dark:border-slate-700 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    {mockLeaderboard[2]?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {mockLeaderboard[2]?.username}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {mockLeaderboard[2]?.points.toLocaleString()} điểm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Toàn bộ xếp hạng
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {mockLeaderboard.map((user) => (
                <div
                  key={user.id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankBadge(user.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.username}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {user.courses} khóa học
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          {user.exercises} bài tập
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-accent">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">điểm</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
