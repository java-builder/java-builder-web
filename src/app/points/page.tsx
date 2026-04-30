"use client";

import { useState } from "react";
import { mockPointsHistory, pointsBreakdown, rewards } from "@/data/mockData";

export default function PointsPage() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "history" | "rewards">("overview");

  const totalPoints = 5270;
  const earnedThisMonth = 1250;
  const spentThisMonth = 300;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Điểm số
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Theo dõi và sử dụng điểm thưởng của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Total Points Card */}
        <div className="bg-gradient-to-br from-accent to-accent-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Tổng điểm của bạn</p>
              <p className="text-4xl font-bold">{totalPoints.toLocaleString()}</p>
              <p className="text-sm opacity-90 mt-2">
                +{earnedThisMonth} điểm tháng này
              </p>
            </div>
            <div className="text-6xl">
              <svg className="w-16 h-16 text-yellow-400 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kiếm được tháng này</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{earnedThisMonth}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đã sử dụng tháng này</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  -{spentThisMonth}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === "overview"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setSelectedTab("history")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === "history"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Lịch sử
            </button>
            <button
              onClick={() => setSelectedTab("rewards")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === "rewards"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Đổi thưởng
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pointsBreakdown.map((item) => (
              <div
                key={item.category}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>
                    {item.points}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.category}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {Math.round((item.points / totalPoints) * 100)}% tổng điểm
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedTab === "history" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {mockPointsHistory.map((item) => (
                <div key={item.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.action}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className={`text-lg font-bold flex-shrink-0 ${
                      item.type === "earn" 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {item.points > 0 ? "+" : ""}{item.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "rewards" && (
          <div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                    Bạn có {totalPoints.toLocaleString()} điểm
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Tích lũy thêm điểm để đổi các phần thưởng hấp dẫn
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-5 border-2 transition-all ${
                    reward.available
                      ? "border-accent hover:shadow-lg"
                      : "border-gray-200 dark:border-slate-700 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{reward.icon}</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reward.available
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                    }`}>
                      {reward.available ? "Có thể đổi" : "Chưa đủ điểm"}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {reward.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-accent">
                      {reward.points} điểm
                    </span>
                    <button
                      disabled={!reward.available}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        reward.available
                          ? "bg-accent text-white hover:bg-accent-600"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Đổi ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
