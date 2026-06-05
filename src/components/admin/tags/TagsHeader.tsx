"use client";

import { Plus } from "lucide-react";

interface TagsHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function TagsHeader({ totalCount, onCreate }: TagsHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Quản lý Tags
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Tạo, xem và quản lý tags dùng cho bài viết và bộ câu hỏi
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Tổng{" "}
          <span className="tabular-nums">
            {totalCount.toLocaleString("vi-VN")}
          </span>{" "}
          tag
        </span>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" />
          Tạo tag
        </button>
      </div>
    </div>
  );
}
