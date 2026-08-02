"use client";

import { useState } from "react";
import { FileText, Search, Tag } from "lucide-react";
import { CategoryType } from "@/types/category";
import { CATEGORY_COLORS, EMOJI_LIST } from "./helpers";
import { useI18n } from "@/contexts/I18nContext";

interface CategoryFormFieldsProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  categoryType: CategoryType;
  isLocked?: boolean;
  onChange: (patch: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    categoryType?: CategoryType;
  }) => void;
}

export default function CategoryFormFields({
  name,
  description,
  icon,
  color,
  categoryType,
  isLocked,
  onChange,
}: CategoryFormFieldsProps) {
  const { t } = useI18n();
  const [emojiSearch, setEmojiSearch] = useState("");
  const filteredEmojis = emojiSearch
    ? EMOJI_LIST.filter((e) => e.includes(emojiSearch))
    : EMOJI_LIST;

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
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
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
            className="block w-full resize-y rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {t("admin.categories.colType")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: CategoryType.BLOG, label: t("admin.categories.tabBlog"), desc: "Bài viết blog & tin tức" },
            { value: CategoryType.POST, label: t("admin.categories.tabPost"), desc: "Bài đăng Q&A & thảo luận" },
          ].map((opt) => {
            const isActive = categoryType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !isLocked && onChange({ categoryType: opt.value })}
                disabled={isLocked}
                className={`flex flex-col gap-0.5 rounded-lg border p-3 text-left transition disabled:opacity-50 ${
                  isActive
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-900/40"
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

      {/* Icon picker */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Icon
          </label>
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-slate-700 dark:text-gray-300">
            Đã chọn:{" "}
            <span className="text-base leading-none">{icon || "—"}</span>
          </span>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="relative border-b border-gray-200 dark:border-slate-700">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={emojiSearch}
              onChange={(e) => setEmojiSearch(e.target.value)}
              placeholder="Tìm emoji..."
              disabled={isLocked}
              className="block w-full rounded-t-lg bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:outline-none disabled:opacity-50 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </div>
          <div className="grid max-h-40 grid-cols-8 gap-1 overflow-y-auto p-2">
            {filteredEmojis.map((e, i) => {
              const isSelected = icon === e;
              return (
                <button
                  key={`${e}-${i}`}
                  type="button"
                  onClick={() => {
                    onChange({ icon: e });
                    setEmojiSearch("");
                  }}
                  disabled={isLocked}
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-xl transition ${
                    isSelected
                      ? "bg-accent/10 ring-1 ring-accent"
                      : "hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color picker */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Màu sắc
          </label>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-slate-700 dark:text-gray-300">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-sm border border-gray-200 dark:border-slate-600"
              style={{ background: color }}
            />
            <span className="font-mono text-[11px]">{color}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => !isLocked && onChange({ color: c })}
              disabled={isLocked}
              aria-label={`Chọn màu ${c}`}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition disabled:opacity-50 ${
                color === c
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
                  : "ring-1 ring-gray-200 dark:ring-slate-600"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      {(name.trim() || icon) && (
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Xem trước
          </p>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-3 dark:border-slate-600 dark:bg-slate-900/30">
            <span
              className="inline-flex max-w-full items-center gap-1.5 truncate rounded-md px-2.5 py-1 text-sm font-semibold"
              style={{
                background: `${color}1a`,
                color,
              }}
            >
              <span className="flex-shrink-0 text-base leading-none">{icon}</span>
              <span className="truncate">{name.trim() || "Tên danh mục"}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
