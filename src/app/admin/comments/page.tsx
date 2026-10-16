"use client";

import { useState } from "react";
import { MessageSquare, BookOpen, FileText } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import BlogCommentsTab from "@/components/admin/comments/BlogCommentsTab";
import CourseCommentsTab from "@/components/admin/comments/CourseCommentsTab";
import DocsCommentsTab from "@/components/admin/comments/DocsCommentsTab";

type TabType = "blogs" | "courses" | "docs";

export default function CommentsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>("blogs");

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-accent" />
            <span>{t("admin.comments.pageTitle")}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.comments.pageSubtitle")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl shadow-sm border border-border mb-6">
        <div className="border-b border-border overflow-x-auto">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "blogs"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{t("admin.comments.tabBlogs")}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "courses"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{t("admin.comments.tabCourses")}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("docs")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "docs"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{t("admin.comments.tabDocs")}</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === "blogs" && <BlogCommentsTab />}
          {activeTab === "courses" && <CourseCommentsTab />}
          {activeTab === "docs" && <DocsCommentsTab />}
        </div>
      </div>
    </div>
  );
}
