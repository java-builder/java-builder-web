"use client";

import { useState } from "react";

// Mock data - sẽ thay bằng API thực tế
const mockProgressData = {
  overall: {
    totalCourses: 12,
    completedCourses: 7,
    inProgressCourses: 3,
    totalHours: 145,
    completedHours: 89,
  },
  courses: [
    {
      id: 2,
      title: "Spring Boot Microservices",
      thumbnail: "/course-thumbnails/spring-boot.jpg",
      progress: 65,
      completedLessons: 26,
      totalLessons: 40,
      timeSpent: 35,
      lastAccessed: "2024-03-24T15:20:00",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Docker & Kubernetes",
      thumbnail: "/course-thumbnails/docker.jpg",
      progress: 45,
      completedLessons: 18,
      totalLessons: 40,
      timeSpent: 22,
      lastAccessed: "2024-03-23T09:15:00",
      status: "in-progress",
    },
    {
      id: 4,
      title: "MySQL Database Design",
      thumbnail: "/course-thumbnails/mysql.jpg",
      progress: 100,
      completedLessons: 30,
      totalLessons: 30,
      timeSpent: 18,
      lastAccessed: "2024-03-15T14:00:00",
      status: "completed",
    },
  ],
  weeklyActivity: [
    { day: "T2", hours: 3.5, lessons: 5 },
    { day: "T3", hours: 2.0, lessons: 3 },
    { day: "T4", hours: 4.5, lessons: 6 },
    { day: "T5", hours: 3.0, lessons: 4 },
    { day: "T6", hours: 5.0, lessons: 7 },
    { day: "T7", hours: 2.5, lessons: 3 },
    { day: "CN", hours: 1.5, lessons: 2 },
  ],
};

export default function LearningProgressPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "in-progress" | "completed">("all");
  const { overall, courses, weeklyActivity } = mockProgressData;

  const filteredCourses = courses.filter((course) => {
    if (selectedFilter === "all") return true;
    return course.status === selectedFilter;
  });

  const overallProgress = Math.round((overall.completedCourses / overall.totalCourses) * 100);
  const hoursProgress = Math.round((overall.completedHours / overall.totalHours) * 100);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Tiến độ học tập
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Theo dõi quá trình học tập và thành tích của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{overall.completedCourses}/{overall.totalCourses}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Khóa học hoàn thành</p>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{overall.completedHours}h</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Thời gian học</p>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${hoursProgress}%` }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{overall.inProgressCourses}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Đang học</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{overallProgress}%</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tiến độ tổng thể</p>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hoạt động tuần này
          </h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end flex-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{day.hours}h</div>
                  <div
                    className="w-full bg-gradient-to-t from-accent to-accent-600 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: '20px' }}
                  ></div>
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-4">
          <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedFilter === "all"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Tất cả ({courses.length})
            </button>
            <button
              onClick={() => setSelectedFilter("in-progress")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedFilter === "in-progress"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Đang học ({courses.filter(c => c.status === "in-progress").length})
            </button>
            <button
              onClick={() => setSelectedFilter("completed")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedFilter === "completed"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Hoàn thành ({courses.filter(c => c.status === "completed").length})
            </button>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {course.completedLessons}/{course.totalLessons} bài học
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.timeSpent} giờ
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(course.lastAccessed)}
                        </span>
                      </div>
                    </div>
                    {course.status === "completed" && (
                      <div className="flex-shrink-0">
                        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Hoàn thành
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tiến độ
                      </span>
                      <span className="text-sm font-bold text-accent">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div
                        className="bg-accent h-2.5 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium">
                    {course.status === "completed" ? "Xem lại" : "Tiếp tục học"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bắt đầu học ngay để theo dõi tiến độ của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
