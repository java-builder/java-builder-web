"use client";

interface CourseTabsProps {
  activeTab: "description" | "comments" | "curriculum" | "instructor";
  onTabChange: (tab: "description" | "comments" | "curriculum" | "instructor") => void;
}

export default function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-slate-700 mb-6 overflow-x-auto">
      <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
        <button
          onClick={() => onTabChange("curriculum")}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "curriculum"
              ? "border-accent text-accent-600 dark:text-accent-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}
        >
          Nội dung
        </button>
        <button
          onClick={() => onTabChange("description")}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "description"
              ? "border-accent text-accent-600 dark:text-accent-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}
        >
          Mô tả
        </button>
        <button
          onClick={() => onTabChange("instructor")}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "instructor"
              ? "border-accent text-accent-600 dark:text-accent-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}
        >
          Tác giả
        </button>
        <button
          onClick={() => onTabChange("comments")}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "comments"
              ? "border-accent text-accent-600 dark:text-accent-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}
        >
          Đánh giá
        </button>
      </nav>
    </div>
  );
}
