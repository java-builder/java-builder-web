"use client";

import { FileText, Tag } from "lucide-react";
import { CategoryType } from "@/types/category";
import { useI18n } from "@/contexts/I18nContext";

interface CategoryFormFieldsProps {
  name: string;
  description: string;
  categoryType: CategoryType;
  isLocked?: boolean;
  onChange: (patch: {
    name?: string;
    description?: string;
    categoryType?: CategoryType;
  }) => void;
}

export default function CategoryFormFields({
  name,
  description,
  categoryType,
  isLocked,
  onChange,
}: CategoryFormFieldsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Tên danh mục <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Tag className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Ví dụ: Spring Boot, Java Core, DevOps..."
            disabled={isLocked}
            autoFocus
            className="block w-full rounded-xl border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 dark:border-border dark:bg-background dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Mô tả
        </label>
        <div className="relative">
          <FileText className="pointer-events-none absolute left-2.5 top-3 h-3.5 w-3.5 text-gray-400" />
          <textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Mô tả ngắn về danh mục này (tuỳ chọn)"
            rows={2}
            disabled={isLocked}
            className="block w-full resize-y rounded-xl border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 dark:border-border dark:bg-background dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {t("admin.categories.colType")}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { value: CategoryType.BLOG, label: t("admin.categories.tabBlog"), desc: "Bài viết blog & tin tức" },
            { value: CategoryType.POST, label: t("admin.categories.tabPost"), desc: "Bài đăng Q&A & thảo luận" },
            { value: CategoryType.CHALLENGE, label: "Thử thách", desc: "Thử thách lập trình" },
          ].map((opt) => {
            const isActive = categoryType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !isLocked && onChange({ categoryType: opt.value })}
                disabled={isLocked}
                className={`flex flex-col gap-0.5 rounded-xl border p-3 text-left transition disabled:opacity-50 ${
                  isActive
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-border dark:bg-surface dark:hover:bg-surface/80"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    isActive ? "text-accent" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
