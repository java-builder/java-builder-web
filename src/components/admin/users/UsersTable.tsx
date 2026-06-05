"use client";

import { Users } from "lucide-react";
import { UserDetailResponse } from "@/types/user";
import { UserTableRow } from "./UserTableRow";

interface UsersTableProps {
  users: UserDetailResponse[];
  isLoading: boolean;
  totalElements: number;
  hasFilter: boolean;
  deletingId: string;
  onEdit: (user: UserDetailResponse) => void;
  onDelete: (id: string, userName: string) => void;
}

const COLUMN_HEADERS: { label: string; align?: "left" | "right" }[] = [
  { label: "Người dùng" },
  { label: "Email" },
  { label: "Trạng thái" },
  { label: "Vai trò" },
  { label: "MFT" },
  { label: "Ngày tạo" },
  { label: "Thao tác", align: "right" },
];

export const UsersTable = ({
  users,
  isLoading,
  totalElements,
  hasFilter,
  deletingId,
  onEdit,
  onDelete,
}: UsersTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Danh sách người dùng
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Quản lý thông tin tài khoản, vai trò và trạng thái
          </p>
        </div>
        {totalElements > 0 && (
          <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {totalElements.toLocaleString("vi-VN")} người dùng
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/40">
            <tr>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
            {isLoading && users.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Đang tải...
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_HEADERS.length} className="px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {hasFilter
                      ? "Không tìm thấy người dùng phù hợp"
                      : "Chưa có người dùng nào"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {hasFilter
                      ? "Thử thay đổi từ khoá tìm kiếm"
                      : "Bấm 'Thêm người dùng' để tạo tài khoản mới"}
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isDeleting={deletingId === user.id}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
