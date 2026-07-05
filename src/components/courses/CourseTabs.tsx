"use client";

import { useI18n } from "@/contexts/I18nContext";

interface CourseTabsProps {
  activeTab: "description" | "curriculum" | "instructor";
  onTabChange: (tab: "description" | "curriculum" | "instructor") => void;
}

export default function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
  const { t } = useI18n();

  return (
    <div className="border-b border-gray-200 dark:border-slate-700 mb-6 overflow-x-auto">
      <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
        <button
          onClick={() => onTabChange("curriculum")}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "curriculum"
              ? "border-accent text-accent"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}
        >
          {t("courseDetail.tabs.curriculum")}
        </button>
        <button
          onClick={() => onTabChange("description")}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "description"
              ? "border-accent text-accent"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}
        >
          {t("courseDetail.tabs.description")}
        </button>
        <button
          onClick={() => onTabChange("instructor")}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "instructor"
              ? "border-accent text-accent"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}
        >
          {t("courseDetail.tabs.instructor")}
        </button>
      </nav>
    </div>
  );
}
