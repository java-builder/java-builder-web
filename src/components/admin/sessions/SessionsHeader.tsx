"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";

interface SessionsHeaderProps {
  totalCount: number;
}

export const SessionsHeader = ({ totalCount }: SessionsHeaderProps) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Quản lý phiên đăng nhập
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Theo dõi các phiên truy cập đang hoạt động và thu hồi phiên khi cần
        </p>
      </div>
      <div className="flex items-center gap-2">
        {totalCount > 0 && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Tổng{" "}
            <span className="tabular-nums">
              {totalCount.toLocaleString("vi-VN")}
            </span>{" "}
            phiên
          </span>
        )}
        <Link
          href="/admin/reports#session-analytics"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
        >
          <BarChart3 className="h-4 w-4" />
          Xem thống kê
        </Link>
      </div>
    </div>
  );
};
