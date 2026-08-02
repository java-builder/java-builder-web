"use client";

import { CategoryType } from "@/types/category";
import { useI18n } from "@/contexts/I18nContext";
import { SlidersHorizontal, BookOpen, FileText } from "lucide-react";

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
  const { t } = useI18n();

  const tabs = [
    { id: CategoryType.BLOG, label: t("admin.categories.tabBlog"), count: blogCount, icon: BookOpen },
    { id: CategoryType.POST, label: t("admin.categories.tabPost"), count: postCount, icon: FileText },
  ];

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 pr-2 border-r border-border/80 hidden sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            {t("admin.categories.colType")}
          </span>
        </div>

        <div className="flex h-9 items-center gap-1 rounded-md border border-input bg-muted/40 p-1 shadow-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={`flex h-7 items-center gap-1.5 px-3 text-sm font-medium rounded transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border/80 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? "text-accent" : "text-muted-foreground/70"
                  }`}
                />
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
