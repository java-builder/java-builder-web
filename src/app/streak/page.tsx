"use client";

import { mockStreakData } from "@/data/mockData";

export default function StreakPage() {
  const { currentStreak, longestStreak, totalDays, thisWeek, monthlyCalendar, milestones } = mockStreakData;

  const getDayName = (dateString: string) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Chuỗi ngày học
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Duy trì thói quen học tập mỗi ngày để đạt mục tiêu
              </p>
            </div>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="bg-gradient-to-br from-accent to-accent-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Chuỗi hiện tại</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold">{currentStreak}</p>
                <p className="text-2xl opacity-90">ngày</p>
              </div>
              <p className="text-sm opacity-90 mt-2">
                🔥 Tiếp tục phát huy! Bạn đang làm rất tốt!
              </p>
            </div>
            <div className="text-7xl opacity-20">🔥</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chuỗi dài nhất</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{longestStreak}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ngày</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng số ngày học</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalDays}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ngày</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tuần này</h2>
          <div className="grid grid-cols-7 gap-2">
            {thisWeek.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {getDayName(day.date)}
                </div>
                <div
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                    day.completed
                      ? "bg-gradient-to-br from-accent to-accent-600 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {day.completed ? (
                    <>
                      <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">{day.points}đ</span>
                    </>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Calendar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">
                {day}
              </div>
            ))}
            {monthlyCalendar.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                  day.isToday
                    ? "bg-accent text-white ring-2 ring-accent ring-offset-2 dark:ring-offset-slate-800"
                    : day.completed
                    ? "bg-blue-100 dark:bg-blue-900/30 text-accent dark:text-blue-400"
                    : day.isPast
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500"
                    : "bg-gray-50 dark:bg-slate-700/50 text-gray-300 dark:text-gray-600"
                }`}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mốc thành tích</h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  milestone.unlocked
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      milestone.unlocked
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {milestone.unlocked ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-lg font-bold">{milestone.days}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phần thưởng: {milestone.reward}
                    </p>
                  </div>
                </div>
                {milestone.unlocked && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    Đã đạt
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
