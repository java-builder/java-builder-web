"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react";

interface ReviewHeaderProps {
  onRetry?: () => void;
}

export default function ReviewHeader({ onRetry }: ReviewHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <button
          onClick={() => router.back()}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 transition hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Xem lại bài làm
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Phân tích kết quả chi tiết và đề xuất hướng ôn tập phù hợp
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          Làm lại bài
        </button>
        <Link
          href="/exercises"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
        >
          <BookOpen className="h-4 w-4" />
          Bài tập khác
        </Link>
      </div>
    </div>
  );
}
