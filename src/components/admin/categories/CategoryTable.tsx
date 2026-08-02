"use client";

import { Folder } from "lucide-react";
import { CategoryDetailResponse } from "@/types/category";
import CategoryRow from "./CategoryRow";
import { useI18n } from "@/contexts/I18nContext";

interface CategoryTableProps {
  categories: CategoryDetailResponse[];
  isLoading: boolean;
  deletingId: string | null;
  onEdit: (category: CategoryDetailResponse) => void;
  onDelete: (id: string, name: string) => void;
}

export default function CategoryTable({
  categories,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const { t, locale } = useI18n();

  const columnHeaders: { label: string; align?: "left" | "right" }[] = [
    { label: t("admin.categories.colCategory") },
    { label: t("admin.categories.colType") },
    { label: t("admin.categories.colDescription") },
    { label: t("admin.categories.colCreatedAt") },
    { label: t("admin.categories.colActions"), align: "right" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("admin.categories.tableTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("admin.categories.tableSubtitle")}
          </p>
        </div>
        {categories.length > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">
            {categories.length.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {t("admin.categories.colCategory").toLowerCase()}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              {columnHeaders.map((col, i) => (
                <th
                  key={i}
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
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={columnHeaders.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {t("admin.categories.emptyTitle")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("admin.categories.emptyDesc")}
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
