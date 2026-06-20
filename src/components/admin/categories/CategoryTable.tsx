"use client";

import { Folder } from "lucide-react";
import { CategoryDetailResponse } from "@/types/category";
import CategoryRow from "./CategoryRow";

interface CategoryTableProps {
  categories: CategoryDetailResponse[];
  isLoading: boolean;
  deletingId: string | null;
  onEdit: (category: CategoryDetailResponse) => void;
  onDelete: (id: string, name: string) => void;
}

const COLUMN_HEADERS: { label: string; align?: "left" | "right" }[] = [
  { label: "Danh mục" },
  { label: "Loại" },
  { label: "Mô tả" },
  { label: "Tạo lúc" },
  { label: "Thao tác", align: "right" },
];

export default function CategoryTable({
  categories,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách danh mục
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sắp xếp theo thứ tự hiển thị mới nhất
          </p>
        </div>
        {categories.length > 0 && (
          <span className="whitespace-nowrap rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {categories.length} danh mục
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
            {isLoading && categories.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
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
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Chưa có danh mục nào
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bấm &quot;Tạo danh mục&quot; để thêm danh mục mới
                  </p>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  isDeleting={deletingId === category.id}
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
