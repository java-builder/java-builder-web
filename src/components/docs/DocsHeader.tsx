"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DocsHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button and Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            <div className="h-8 w-px bg-gray-300 dark:bg-slate-600" />
            <Link href="/docs" className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Tài liệu hướng dẫn
              </h1>
            </Link>
          </div>

          {/* Right: Home link */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
