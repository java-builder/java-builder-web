"use client";

import { useState } from "react";
import BlogCommentsTab from "@/components/admin/comments/BlogCommentsTab";
import CourseCommentsTab from "@/components/admin/comments/CourseCommentsTab";
import DocsCommentsTab from "@/components/admin/comments/DocsCommentsTab";

type TabType = "blogs" | "courses" | "docs";

export default function CommentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("blogs");

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Quản lý bình luận</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Xem và quản lý tất cả bình luận trong hệ thống
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl shadow-sm border border-border mb-6">
        <div className="border-b border-border overflow-x-auto">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "blogs"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="hidden sm:inline">Bình luận bài viết</span>
                <span className="sm:hidden">Bài viết</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "courses"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="hidden sm:inline">Bình luận khóa học</span>
                <span className="sm:hidden">Khóa học</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("docs")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "docs"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Bình luận tài liệu khóa học</span>
                <span className="sm:hidden">Tài liệu</span>
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
