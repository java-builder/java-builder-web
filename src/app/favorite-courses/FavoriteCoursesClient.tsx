"use client";

import FavoriteCoursesTab from "@/components/profile/FavoriteCoursesTab";

export default function FavoriteCoursesPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Khóa học yêu thích
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tất cả khóa học bạn đã lưu để học sau
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <FavoriteCoursesTab />
      </div>
    </div>
  );
}
