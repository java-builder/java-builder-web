"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

const mockExercisesData = {
  stats: {
    total: 15,
    completed: 8,
    inProgress: 4,
    notStarted: 3,
  },
  exercises: [
    {
      id: 1,
      title: "Java Basics - Variables and Data Types",
      course: "Java Core",
      difficulty: "easy",
      points: 10,
      timeEstimate: 15,
      status: "completed",
      completedAt: "2024-03-20T10:30:00",
      score: 100,
    },
    {
      id: 2,
      title: "OOP Principles - Inheritance",
      course: "Java Core",
      difficulty: "medium",
      points: 20,
      timeEstimate: 30,
      status: "completed",
      completedAt: "2024-03-21T14:20:00",
      score: 85,
    },
    {
      id: 3,
      title: "Spring Boot REST API",
      course: "Spring Boot",
      difficulty: "hard",
      points: 30,
      timeEstimate: 45,
      status: "in-progress",
      completedAt: null,
      score: null,
    },
    {
      id: 4,
      title: "Collections Framework",
      course: "Java Core",
      difficulty: "medium",
      points: 20,
      timeEstimate: 25,
      status: "in-progress",
      completedAt: null,
      score: null,
    },
    {
      id: 5,
      title: "Exception Handling",
      course: "Java Core",
      difficulty: "easy",
      points: 15,
      timeEstimate: 20,
      status: "not-started",
      completedAt: null,
      score: null,
    },
    {
      id: 6,
      title: "Multithreading Basics",
      course: "Java Advanced",
      difficulty: "hard",
      points: 35,
      timeEstimate: 60,
      status: "not-started",
      completedAt: null,
      score: null,
    },
    {
      id: 7,
      title: "Stream API Practice",
      course: "Java 8+",
      difficulty: "medium",
      points: 25,
      timeEstimate: 35,
      status: "completed",
      completedAt: "2024-03-19T09:15:00",
      score: 95,
    },
    {
      id: 8,
      title: "JPA and Hibernate",
      course: "Spring Boot",
      difficulty: "hard",
      points: 40,
      timeEstimate: 50,
      status: "not-started",
      completedAt: null,
      score: null,
    },
  ],
};

const difficultyColors = {
  easy: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  medium: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const difficultyLabels = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

const statusColors = {
  completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "in-progress": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  "not-started": "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-400",
};

const statusLabels = {
  completed: "Hoàn thành",
  "in-progress": "Đang làm",
  "not-started": "Chưa làm",
};

export default function ExercisesClient() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { stats, exercises } = mockExercisesData;

  const handleExerciseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success("Tính năng đang được phát triển", {
      duration: 3000,
      position: "top-center",
    });
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "all" || exercise.status === selectedStatus;
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesStatus && matchesSearch;
  });

  const completionRate = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Bài tập
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Luyện tập và củng cố kiến thức qua các bài tập thực hành
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng bài tập</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Đang làm</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài tập..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDifficulty("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === "all"
                    ? "bg-accent text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedDifficulty("easy")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === "easy"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Dễ
              </button>
              <button
                onClick={() => setSelectedDifficulty("medium")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === "medium"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                TB
              </button>
              <button
                onClick={() => setSelectedDifficulty("hard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === "hard"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Khó
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedStatus === "all"
                    ? "bg-accent text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedStatus("not-started")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedStatus === "not-started"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Chưa làm
              </button>
              <button
                onClick={() => setSelectedStatus("in-progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedStatus === "in-progress"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Đang làm
              </button>
              <button
                onClick={() => setSelectedStatus("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedStatus === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {exercise.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {exercise.course}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}`}>
                          {difficultyLabels[exercise.difficulty as keyof typeof difficultyLabels]}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[exercise.status as keyof typeof statusColors]}`}>
                          {statusLabels[exercise.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {exercise.points} điểm
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ~{exercise.timeEstimate} phút
                    </span>
                    {exercise.status === "completed" && exercise.score !== null && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Điểm: {exercise.score}/100
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExerciseClick}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    {exercise.status === "completed" ? "Xem lại" : exercise.status === "in-progress" ? "Tiếp tục" : "Bắt đầu"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy bài tập
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
