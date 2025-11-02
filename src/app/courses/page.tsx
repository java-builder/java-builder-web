"use client";

import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/courses/CourseCard';
import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import { courseApi } from '@/services/course.service';
import { CourseDetailResponse, CourseLevel } from '@/types/course';

export default function CoursesPage() {
  const [searchText, setSearchText] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [courseLevel, setCourseLevel] = useState<CourseLevel | ''>('');

  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const handleSearch = () => {
    setCurrentSearch(searchText.trim());
    setPage(1);
  };

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await courseApi.getCourses(
        page,
        size,
        currentSearch || undefined,
        courseLevel || undefined
      );

      if (response.code === 200 && response.result) {
        setCourses(response.result.result || []);
        setTotalPages(response.result.totalPages || 1);
      } else {
        throw new Error('Không thể tải danh sách khóa học');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải khóa học');
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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[70vh] bg-gray-900">
        {/* Background with code snippets */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative overflow-hidden bg-gray-900">
            {/* Code snippets overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 text-orange-400 font-mono text-xs">
                <div>const courses = [</div>
                <div>&nbsp;&nbsp;&quot;React&quot;, &quot;Next.js&quot;,</div>
                <div>&nbsp;&nbsp;&quot;TypeScript&quot;, &quot;Node.js&quot;</div>
                <div>];</div>
              </div>
              <div className="absolute top-40 right-20 text-blue-400 font-mono text-xs">
                <div>function learn() {`{`}</div>
                <div>&nbsp;&nbsp;return &quot;success&quot;;</div>
                <div>{`}`}</div>
              </div>
              <div className="absolute bottom-40 left-20 text-purple-400 font-mono text-xs">
                <div>if (dedication) {`{`}</div>
                <div>&nbsp;&nbsp;masterSkills();</div>
                <div>{`}`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white flex items-center min-h-[70vh]">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            {/* Badge */}
            <div className="inline-block">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">Course & Training</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Khóa học <span className="text-orange-400">chất lượng</span>
            </h1>

            {/* Sub text */}
            <p className="mt-4 text-base md:text-lg text-gray-100 max-w-3xl">
              Lộ trình thực tiễn, mentor giàu kinh nghiệm, nội dung cập nhật xu hướng.
            </p>

            {/* CTA */}
            <div className="pt-5">
              <Link
                href="#list"
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Khám phá khóa học
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <div id="list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/15 via-orange-500/15 to-orange-500/15 blur-xl" />
          <div className="relative bg-white/90 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex gap-3">
              {/* Search input */}
              <div className="flex-1">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm khóa học..."
                    className="w-full h-12 rounded-lg border border-gray-300 pl-11 pr-4 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Search button */}
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCourseLevel('');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${courseLevel === ''
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${courseLevel === CourseLevel.BEGINNER
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${courseLevel === CourseLevel.INTERMEDIATE
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${courseLevel === CourseLevel.ADVANCED
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${courseLevel === CourseLevel.EXPERT
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Expert
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="mx-auto w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Đang tải khóa học...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-700 font-medium mb-1">Chưa có khóa học phù hợp</p>
            <p className="text-gray-500 text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
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
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => goTo(page - 1)}
              disabled={page <= 1}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i + 1)}
                className={`px-3 py-2 rounded-lg border ${page === i + 1 ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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