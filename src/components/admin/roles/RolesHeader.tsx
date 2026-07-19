"use client";

import { Plus } from "lucide-react";

interface RolesHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function RolesHeader({ totalCount, onCreate }: RolesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            Quản lý Role
          </h1>
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:bg-accent/20">
            {totalCount} role
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tạo và quản lý các role bảo mật hệ thống. Role quyết định quyền truy cập APIs của người dùng.
        </p>
      </div>

      <button
        onClick={onCreate}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/20 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        Tạo role mới
      </button>
    </div>
  );
}
