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
    { id: CategoryType.BLOG, label: "Blog", count: blogCount },
    { id: CategoryType.POST, label: "Bài viết", count: postCount },
  ];

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm">
      <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition cursor-pointer ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
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
