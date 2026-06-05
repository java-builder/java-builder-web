"use client";

import { Hash } from "lucide-react";
import type { TagDetailResponse } from "@/types/tag";
import TagRow from "./TagRow";

interface TagsTableProps {
  tags: TagDetailResponse[];
  isLoading: boolean;
  searchQuery: string;
  deletingId: string | null;
  onEdit: (tag: TagDetailResponse) => void;
  onDelete: (id: string, name: string) => void;
}

const COLUMN_HEADERS: { label: string; align?: "left" | "right" }[] = [
  { label: "Tên tag" },
  { label: "Slug" },
  { label: "Tạo lúc" },
  { label: "Thao tác", align: "right" },
];

export default function TagsTable({
  tags,
  isLoading,
  searchQuery,
  deletingId,
  onEdit,
  onDelete,
}: TagsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Danh sách tag
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Sắp xếp từ tag được tạo mới nhất
          </p>
        </div>
        {tags.length > 0 && (
          <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {tags.length} tag
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
            {isLoading && tags.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
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
            ) : tags.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {searchQuery ? "Không tìm thấy tag phù hợp" : "Chưa có tag nào"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "Thử thay đổi từ khoá tìm kiếm"
                      : "Bấm 'Tạo tag' để bắt đầu tạo tag mới"}
                  </p>
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  isDeleting={deletingId === tag.id}
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
}
