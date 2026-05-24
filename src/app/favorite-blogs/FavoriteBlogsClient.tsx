"use client";

import FavoriteBlogsTab from "@/components/profile/FavoriteBlogsTab";

export default function FavoriteBlogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Page Header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-700 dark:text-slate-300 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M9 8h3m6 13H6a2 2 0 01-2-2V5a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-slate-50">
              Bài viết yêu thích
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
              Tất cả bài viết bạn đã lưu để đọc sau
            </p>
          </div>
        </div>

        {/* Content */}
        <FavoriteBlogsTab />
      </div>
    </div>
  );
}
