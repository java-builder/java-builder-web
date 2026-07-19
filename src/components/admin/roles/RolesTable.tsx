"use client";

import { Shield, Loader2 } from "lucide-react";
import { RoleDetailResponse } from "@/types/role";
import RoleRow from "./RoleRow";

interface RolesTableProps {
  roles: RoleDetailResponse[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (role: RoleDetailResponse) => void;
}

export default function RolesTable({
  roles,
  isLoading,
  searchQuery,
  onEdit,
}: RolesTableProps) {
  if (isLoading && roles.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Đang tải danh sách role...
          </p>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-950">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-slate-900 dark:text-gray-500">
          <Shield className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
          Không tìm thấy role nào
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "Thử tìm kiếm với từ khóa khác"
            : "Bắt đầu bằng việc tạo một role bảo mật mới"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm dark:border-slate-850 dark:bg-slate-900/40">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-gray-400">
              <th scope="col" className="px-6 py-3.5">
                Tên role
              </th>
              <th scope="col" className="px-6 py-3.5">
                Mô tả
              </th>
              <th scope="col" className="px-6 py-3.5">
                Ngày tạo
              </th>
              <th scope="col" className="px-6 py-3.5">
                Cập nhật lần cuối
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {roles.map((role) => (
              <RoleRow
                key={role.id}
                role={role}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
