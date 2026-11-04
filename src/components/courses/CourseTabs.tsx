"use client";

import { useI18n } from "@/contexts/I18nContext";

interface CourseTabsProps {
  activeTab: "description" | "curriculum" | "instructor";
  onTabChange: (tab: "description" | "curriculum" | "instructor") => void;
}

export default function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
  const { t } = useI18n();

  return (
    <div className="border-b border-border mb-6 overflow-x-auto">
      <nav className="-mb-px flex space-x-6 sm:space-x-8 min-w-max">
        <button
          type="button"
          onClick={() => onTabChange("curriculum")}
          className={`py-2.5 px-1 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "curriculum"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-foreground hover:border-border"
          }`}
        >
          {t("courseDetail.tabs.curriculum")}
        </button>
        <button
          type="button"
          onClick={() => onTabChange("description")}
          className={`py-2.5 px-1 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "description"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-foreground hover:border-border"
          }`}
        >
          {t("courseDetail.tabs.description")}
        </button>
        <button
          type="button"
          onClick={() => onTabChange("instructor")}
          className={`py-2.5 px-1 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "instructor"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-foreground hover:border-border"
          }`}
        >
          {t("courseDetail.tabs.instructor")}
        </button>
      </nav>
    </div>
  );
}
