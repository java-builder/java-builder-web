"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/ui/SearchBar";
import { useCourses } from "@/hooks/useCourses";
import { CourseFormat } from "@/types/course";
import { formatDate } from "@/utils/formatters";

export default function DocsPage() {
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");

  const { data, isLoading } = useCourses(1, 100, currentSearch || undefined, undefined, CourseFormat.TEXT);
  const courses = data?.data || [];

  const handleSearch = () => {
    setCurrentSearch(searchText.trim());
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tài liệu học tập
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Khám phá các khóa học dạng văn bản để học tập hiệu quả và nâng cao kiến thức.
          </p>
        </div>
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/15 via-accent/15 to-accent/15 blur-xl" />
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
            <SearchBar
              placeholder="Tìm kiếm tài liệu..."
              value={searchText}
              onChange={setSearchText}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="mx-auto w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải tài liệu...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              {currentSearch ? "Không tìm thấy tài liệu" : "Chưa có tài liệu nào"}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {currentSearch ? "Thử tìm kiếm với từ khóa khác" : "Các khóa học dạng văn bản sẽ hiển thị tại đây"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/docs/${course.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {course.thumbnailUrl ? (
                  <div className="relative h-48 bg-gray-100 dark:bg-slate-700">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                    <svg className="w-16 h-16 text-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                      {course.level === "BEGINNER" && "Cơ bản"}
                      {course.level === "INTERMEDIATE" && "Trung cấp"}
                      {course.level === "ADVANCED" && "Nâng cao"}
                      {course.level === "EXPERT" && "Chuyên gia"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(course.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {course.chapters?.length || 0} chương
                    </span>
                    <span className="text-accent font-medium group-hover:underline">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
