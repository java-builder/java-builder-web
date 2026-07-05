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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách tag
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sắp xếp từ tag được tạo mới nhất
          </p>
        </div>
        {tags.length > 0 && (
          <span className="whitespace-nowrap rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {tags.length} tag
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-transparent">
            {isLoading && tags.length === 0 ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-32" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-8 bg-muted rounded w-16 ml-auto" />
                  </td>
                </tr>
              ))
            ) : tags.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {searchQuery ? "Không tìm thấy tag phù hợp" : "Chưa có tag nào"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
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
