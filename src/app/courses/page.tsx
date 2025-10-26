"use client";

import { useEffect, useMemo, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/courses/CourseCard';
import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import { courseApi } from '@/services/course.service';
import { CourseDetailResponse } from '@/types/course';

export default function CoursesPage() {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [level, setLevel] = useState<'ALL' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('ALL');
  const [category, setCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 350);
    return () => clearTimeout(t);
  }, [searchText]);

  const categories = useMemo(() => {
    const set = new Set<string>(['ALL']);
    if (Array.isArray(courses)) {
      courses.forEach((c) => {
        if (c.title.toLowerCase().includes('react') || c.title.toLowerCase().includes('frontend')) {
          set.add('Frontend');
        } else if (c.title.toLowerCase().includes('java') || c.title.toLowerCase().includes('spring') || c.title.toLowerCase().includes('backend')) {
          set.add('Backend');
        } else if (c.title.toLowerCase().includes('database') || c.title.toLowerCase().includes('sql')) {
          set.add('Database');
        } else if (c.title.toLowerCase().includes('docker') || c.title.toLowerCase().includes('devops')) {
          set.add('DevOps');
        } else {
          set.add('CS Fundamentals');
        }
      });
    }
    return Array.from(set);
  }, [courses]);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await courseApi.getCourses(page, size);

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
  }, [page, size]);

  useEffect(() => {
    fetchCourses();
  }, [page, fetchCourses]);

  const filteredCourses = useMemo(() => {
    const keyword = (debouncedSearch || '').toLowerCase();
    let filtered = Array.isArray(courses) ? [...courses] : [];

    if (level !== 'ALL') {
      filtered = filtered.filter((c) => {
        const courseLevel = c.level === 'BEGINNER' ? 'Beginner' :
          c.level === 'INTERMEDIATE' ? 'Intermediate' :
            c.level === 'ADVANCED' ? 'Advanced' :
              c.level === 'EXPERT' ? 'Expert' : 'Beginner';
        return courseLevel === level;
      });
    }

    if (category !== 'ALL') {
      filtered = filtered.filter((c) => {
        if (category === 'Frontend') {
          return c.title.toLowerCase().includes('react') || c.title.toLowerCase().includes('frontend');
        } else if (category === 'Backend') {
          return c.title.toLowerCase().includes('java') || c.title.toLowerCase().includes('spring') || c.title.toLowerCase().includes('backend');
        } else if (category === 'Database') {
          return c.title.toLowerCase().includes('database') || c.title.toLowerCase().includes('sql');
        } else if (category === 'DevOps') {
          return c.title.toLowerCase().includes('docker') || c.title.toLowerCase().includes('devops');
        } else if (category === 'CS Fundamentals') {
          return c.title.toLowerCase().includes('algorithm') || c.title.toLowerCase().includes('data structure');
        }
        return true;
      });
    }

    if (keyword) {
      filtered = filtered.filter((c) =>
        `${c.title} ${c.description}`.toLowerCase().includes(keyword)
      );
    }

    switch (sortBy) {
      case 'rating':
        // Since we don't have rating in API, sort by title
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        // Sort by creation date if available
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Default sort by title
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [courses, debouncedSearch, level, category, sortBy]);

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
                className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Khám phá khóa học
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <div id="list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & filters */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/15 via-orange-500/15 to-orange-500/15 blur-xl" />
          <div className="relative bg-white/90 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* search */}
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
                      className="w-full h-12 rounded-full border border-gray-300 pl-11 pr-12 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm focus:shadow-md transition"
                      value={searchText}
                      onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                    />
                    {searchText && (
                      <button
                        type="button"
                        onClick={() => { setSearchText(''); setPage(1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Xóa từ khóa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* selects */}
                <div className="flex gap-3">
                  <select
                    className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={level}
                    onChange={(e) => { setLevel(e.target.value as 'ALL' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'); setPage(1); }}
                  >
                    {['ALL', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lv) => (
                      <option key={lv} value={lv}>{lv === 'ALL' ? 'Tất cả level' : lv}</option>
                    ))}
                  </select>

                  <select
                    className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c === 'ALL' ? 'Tất cả lĩnh vực' : c}</option>
                    ))}
                  </select>

                  <select
                    className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'popular' | 'new' | 'rating' | 'price-asc' | 'price-desc')}
                  >
                    <option value="popular">Phổ biến</option>
                    <option value="new">Mới nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                  </select>
                </div>
              </div>

              {/* quick chips */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {['Frontend', 'Backend', 'Database', 'DevOps', 'CS Fundamentals'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCategory(c); setPage(1); }}
                      className={`px-3 py-1.5 rounded-full border text-sm transition ${category === c ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500">Hiển thị {filteredCourses.length} / {courses.length} khóa học</div>
              </div>
            </div>
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
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học phù hợp</h3>
            <p className="text-gray-500">Thử thay đổi từ khóa hoặc bộ lọc</p>
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