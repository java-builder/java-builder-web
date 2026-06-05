"use client";

import { CategoryType } from "@/types/category";

interface CategoryTabsProps {
  activeTab: CategoryType;
  blogCount: number;
  postCount: number;
  onChange: (tab: CategoryType) => void;
}

export default function CategoryTabs({
  activeTab,
  blogCount,
  postCount,
  onChange,
}: CategoryTabsProps) {
  const tabs: {
    id: CategoryType;
    label: string;
    count: number;
  }[] = [
    { id: CategoryType.POST, label: "Bài viết", count: postCount },
    { id: CategoryType.BLOG, label: "Blog", count: blogCount },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
