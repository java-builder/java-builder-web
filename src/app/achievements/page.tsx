"use client";

import { useState } from "react";

// Mock data - sẽ thay bằng API thực tế
const mockAchievements = [
  {
    id: 1,
    title: "Người mới bắt đầu",
    description: "Hoàn thành khóa học đầu tiên",
    icon: "🎓",
    unlocked: true,
    unlockedAt: "2024-01-15",
    progress: 100,
    category: "learning",
  },
  {
    id: 2,
    title: "Học viên chăm chỉ",
    description: "Hoàn thành 5 khóa học",
    icon: "📚",
    unlocked: true,
    unlockedAt: "2024-02-20",
    progress: 100,
    category: "learning",
  },
  {
    id: 3,
    title: "Bậc thầy",
    description: "Hoàn thành 10 khóa học",
    icon: "🏆",
    unlocked: false,
    progress: 70,
    category: "learning",
  },
  {
    id: 4,
    title: "Giải bài tập đầu tiên",
    description: "Hoàn thành bài tập đầu tiên",
    icon: "✅",
    unlocked: true,
    unlockedAt: "2024-01-10",
    progress: 100,
    category: "exercise",
  },
  {
    id: 5,
    title: "Người giải quyết vấn đề",
    description: "Hoàn thành 50 bài tập",
    icon: "🧩",
    unlocked: true,
    unlockedAt: "2024-03-05",
    progress: 100,
    category: "exercise",
  },
  {
    id: 6,
    title: "Chuyên gia bài tập",
    description: "Hoàn thành 100 bài tập",
    icon: "💪",
    unlocked: false,
    progress: 65,
    category: "exercise",
  },
  {
    id: 7,
    title: "Người đóng góp",
    description: "Đóng góp 5 câu hỏi phỏng vấn",
    icon: "🤝",
    unlocked: true,
    unlockedAt: "2024-02-28",
    progress: 100,
    category: "community",
  },
  {
    id: 8,
    title: "Chuyên gia cộng đồng",
    description: "Đóng góp 20 câu hỏi phỏng vấn",
    icon: "🌟",
    unlocked: false,
    progress: 40,
    category: "community",
  },
  {
    id: 9,
    title: "Streak 7 ngày",
    description: "Học liên tục 7 ngày",
    icon: "🔥",
    unlocked: true,
    unlockedAt: "2024-01-22",
    progress: 100,
    category: "streak",
  },
  {
    id: 10,
    title: "Streak 30 ngày",
    description: "Học liên tục 30 ngày",
    icon: "⚡",
    unlocked: false,
    progress: 23,
    category: "streak",
  },
];

const categories = [
  { value: "all", label: "Tất cả", icon: "🏅" },
  { value: "learning", label: "Học tập", icon: "📚" },
  { value: "exercise", label: "Bài tập", icon: "✅" },
  { value: "community", label: "Cộng đồng", icon: "🤝" },
  { value: "streak", label: "Streak", icon: "🔥" },
];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredAchievements = selectedCategory === "all"
    ? mockAchievements
    : mockAchievements.filter(a => a.category === selectedCategory);

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
  const totalCount = mockAchievements.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Thành tích
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Mở khóa thành tích và theo dõi tiến độ của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đã mở khóa</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unlockedCount}/{totalCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đang tiến hành</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCount - unlockedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedCategory === category.value
                    ? "bg-accent text-white"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white dark:bg-slate-800 rounded-xl p-5 border-2 transition-all ${
                achievement.unlocked
                  ? "border-accent shadow-lg shadow-accent/20"
                  : "border-gray-200 dark:border-slate-700 opacity-75"
              }`}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`text-4xl ${
                    achievement.unlocked ? "grayscale-0" : "grayscale opacity-50"
                  }`}
                >
                  {achievement.icon}
                </div>
                {achievement.unlocked && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Đã mở
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {achievement.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.unlocked && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Tiến độ</span>
                    <span className="font-medium">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-accent rounded-full h-2 transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Unlocked Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Mở khóa: {new Date(achievement.unlockedAt).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có thành tích nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bắt đầu học tập để mở khóa thành tích đầu tiên!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
