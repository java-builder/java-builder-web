"use client";

import { useState } from "react";
import BlogCommentsTab from "@/components/admin/comments/BlogCommentsTab";
import CourseCommentsTab from "@/components/admin/comments/CourseCommentsTab";

type TabType = "blogs" | "courses";

export default function CommentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("blogs");

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
        <p className="mt-2 text-sm text-gray-600">
          Xem và quản lý tất cả bình luận trong hệ thống
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px min-w-max">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "blogs"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
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
                <span className="whitespace-nowrap">Bình luận bài viết</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "courses"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
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
                <span className="whitespace-nowrap">Bình luận khóa học</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === "blogs" && <BlogCommentsTab />}
          {activeTab === "courses" && <CourseCommentsTab />}
        </div>
      </div>
    </div>
  );
}
