"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import MotionWrapper from "@/components/MotionWrapper";
import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import Link from "next/link";
import { courseApi } from "@/services/course.service";
import { CourseDetailResponse, CourseLevel } from "@/types/course";

export default function CoursesPage() {
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [courseLevel, setCourseLevel] = useState<CourseLevel | "">("");

  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const handleSearch = () => {
    setCurrentSearch(searchText.trim());
    setPage(1);
  };

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await courseApi.getCourses(
        page,
        size,
        currentSearch || undefined,
        courseLevel || undefined,
      );

      if (response.code === 200 && response.data) {
        setCourses(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error("Không thể tải danh sách khóa học");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải khóa học",
      );
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, currentSearch, courseLevel]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses;

  const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 text-gray-900 dark:text-white">
                <div className="inline-block">
                  <span className="bg-accent text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    Course & Training
                  </span>
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                  Khóa học <span className="text-accent">chất lượng</span>
                </h1>

                <p className="mt-3 text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
                  Lộ trình thực tiễn, mentor giàu kinh nghiệm, nội dung cập nhật xu hướng.
                </p>

                <div className="mt-6">
                  <Link
                    href="#list"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    Khám phá khóa học
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                  <Image
                    src="/hero-background.jpg"
                    alt="Courses hero"
                    width={600}
                    height={400}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <div id="list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/15 via-accent/15 to-accent/15 blur-xl" />
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
            <SearchBar
              placeholder="Tìm khóa học..."
              value={searchText}
              onChange={setSearchText}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCourseLevel("");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                courseLevel === ""
                  ? "bg-accent text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => {
                setCourseLevel(CourseLevel.BEGINNER);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                courseLevel === CourseLevel.BEGINNER
                  ? "bg-accent text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              Beginner
            </button>
            <button
              type="button"
              onClick={() => {
                setCourseLevel(CourseLevel.INTERMEDIATE);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                courseLevel === CourseLevel.INTERMEDIATE
                  ? "bg-accent text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              Intermediate
            </button>
            <button
              type="button"
              onClick={() => {
                setCourseLevel(CourseLevel.ADVANCED);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                courseLevel === CourseLevel.ADVANCED
                  ? "bg-accent text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              Advanced
            </button>
            <button
              type="button"
              onClick={() => {
                setCourseLevel(CourseLevel.EXPERT);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                courseLevel === CourseLevel.EXPERT
                  ? "bg-accent text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              Expert
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="mx-auto w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải khóa học...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="px-4 py-2 bg-accent hover:bg-accent-600 text-white rounded-md transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Chưa có khóa học phù hợp
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <button
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
              onClick={() => goTo(page - 1)}
              disabled={page <= 1}
            >
              Trước
            </button>
            {Array.from({ length: totalPages })
              .slice(0, 7)
              .map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i + 1)}
                  className={`px-3 py-2 rounded-lg border ${page === i + 1 ? "border-accent bg-blue-50 dark:bg-accent/20 text-accent" : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                >
                  {i + 1}
                </button>
              ))}
            <button
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
              onClick={() => goTo(page + 1)}
              disabled={page >= totalPages}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
