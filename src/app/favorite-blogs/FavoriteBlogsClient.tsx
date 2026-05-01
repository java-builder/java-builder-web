"use client";

import FavoriteBlogsTab from "@/components/profile/FavoriteBlogsTab";

export default function FavoriteBlogsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Bài viết yêu thích
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tất cả bài viết bạn đã lưu để đọc sau
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <FavoriteBlogsTab />
      </div>
    </div>
  );
}
