"use client";

import Image from "next/image";
import { CourseDetailResponse, CourseLevel } from "@/types/course";

interface CourseHeaderProps {
  course: CourseDetailResponse;
  formatDate: (dateString: string) => string;
  getLevelText: (level: CourseLevel) => string;
}

export default function CourseHeader({ course, formatDate, getLevelText }: CourseHeaderProps) {
  return (
    <>
      {/* Course Cover */}
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            priority
            className="object-cover bg-gray-100"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
            <div className="text-center text-white">
              <svg
                className="w-16 h-16 mx-auto mb-4"
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
              <p className="text-lg font-medium">Khóa học</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Course Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {course.title}
            </h1>

            <div className="flex items-center space-x-3 mb-4">
              {course.level && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    course.level === CourseLevel.BEGINNER
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : course.level === CourseLevel.INTERMEDIATE
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  }`}
                >
                  {getLevelText(course.level)}
                </span>
              )}
              {course.duration && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium border border-gray-200 dark:border-slate-600">
                  {course.duration} giờ
                </span>
              )}
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-800">
                {formatDate(course.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
