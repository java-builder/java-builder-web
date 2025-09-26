"use client";

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import CourseCard, { Course } from '@/components/courses/CourseCard';
import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';

// const USE_MOCK = true; // keep for future API integration

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'React & Next.js Mastery 2025',
    description: 'Xây dựng ứng dụng web hiện đại với React 19 và Next.js 15, tối ưu hiệu năng và SEO.',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    category: 'Frontend',
    level: 'Intermediate',
    rating: 4.8,
    reviews: 124,
    price: 899000,
    oldPrice: 1299000,
    duration: '32 giờ',
    lessons: 120,
    author: 'Lê Khánh Đức',
  },
  {
    id: 'c2',
    title: 'Java Spring Boot thực chiến',
    description: 'Thiết kế API, bảo mật JWT, làm việc với database, và triển khai production.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    category: 'Backend',
    level: 'Intermediate',
    rating: 4.7,
    reviews: 98,
    price: 949000,
    oldPrice: 1399000,
    duration: '28 giờ',
    lessons: 96,
    author: 'F Learning Team',
  },
  {
    id: 'c3',
    title: 'Data Structures & Algorithms chuyên sâu',
    description: 'Nắm vững DSA để phỏng vấn, luyện LeetCode, tối ưu tư duy giải thuật.',
    thumbnail: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
    category: 'CS Fundamentals',
    level: 'Advanced',
    rating: 4.9,
    reviews: 210,
    price: 1099000,
    oldPrice: 1699000,
    duration: '40 giờ',
    lessons: 150,
    author: 'F Learning Team',
  },
  {
    id: 'c4',
    title: 'TypeScript từ A đến Z',
    description: 'Học TS hiện đại, generic, utility types, narrowing và best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop',
    category: 'Frontend',
    level: 'Beginner',
    rating: 4.6,
    reviews: 75,
    price: 599000,
    oldPrice: 899000,
    duration: '18 giờ',
    lessons: 72,
    author: 'F Learning Team',
  },
  {
    id: 'c5',
    title: 'Database Design & SQL thực tiễn',
    description: 'Chuẩn hóa dữ liệu, quan hệ, chỉ mục, transaction và tối ưu truy vấn.',
    thumbnail: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1200&auto=format&fit=crop',
    category: 'Database',
    level: 'Intermediate',
    rating: 4.5,
    reviews: 63,
    price: 649000,
    duration: '22 giờ',
    lessons: 88,
    author: 'F Learning Team',
  },
  {
    id: 'c6',
    title: 'Docker & CI/CD cho Developer',
    description: 'Container hóa, compose, pipeline CI/CD, deploy hiệu quả.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    category: 'DevOps',
    level: 'Intermediate',
    rating: 4.7,
    reviews: 82,
    price: 799000,
    duration: '20 giờ',
    lessons: 64,
    author: 'F Learning Team',
  },
];

export default function CoursesPage() {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [level, setLevel] = useState<'ALL' | 'Beginner' | 'Intermediate' | 'Advanced'>('ALL');
  const [category, setCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [visible, setVisible] = useState<Course[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 350);
    return () => clearTimeout(t);
  }, [searchText]);

  const categories = useMemo(() => {
    const set = new Set<string>(['ALL']);
    MOCK_COURSES.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, []);

  useEffect(() => {
    // client filter/sort/paginate
    const keyword = (debouncedSearch || '').toLowerCase();
    let list = [...MOCK_COURSES];

    if (level !== 'ALL') list = list.filter((c) => c.level === level);
    if (category !== 'ALL') list = list.filter((c) => c.category === category);
    if (keyword) list = list.filter((c) => `${c.title} ${c.description}`.toLowerCase().includes(keyword));

    switch (sortBy) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        list.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }

    const tp = Math.max(1, Math.ceil(list.length / size));
    const start = (page - 1) * size;
    const paged = list.slice(start, start + size);

    setTotalPages(tp);
    setVisible(paged);
  }, [debouncedSearch, level, category, sortBy, page, size]);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[80vh]">
        {/* Background Image like Home */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/hero-background.jpg)', filter: 'brightness(0.4) contrast(1.1)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white flex items-center min-h-[60vh]">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            {/* Badge */}
            <div className="inline-block">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">Course & Training</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Khóa học <span className="text-emerald-400">chất lượng</span>
            </h1>

            {/* Sub text */}
            <p className="mt-4 text-base md:text-lg text-gray-100 max-w-3xl">
              Lộ trình thực tiễn, mentor giàu kinh nghiệm, nội dung cập nhật xu hướng.
            </p>

            {/* CTA */}
            <div className="pt-6">
              <Link
                href="#list"
                className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 blur-xl" />
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
                      className="w-full h-12 rounded-full border border-gray-300 pl-11 pr-12 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm focus:shadow-md transition"
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
                    className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={level}
                    onChange={(e) => { setLevel(e.target.value as 'ALL' | 'Beginner' | 'Intermediate' | 'Advanced'); setPage(1); }}
                  >
                    {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((lv) => (
                      <option key={lv} value={lv}>{lv === 'ALL' ? 'Tất cả level' : lv}</option>
                    ))}
                  </select>

                  <select
                    className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c === 'ALL' ? 'Tất cả lĩnh vực' : c}</option>
                    ))}
                  </select>

                  <select
                    className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className={`px-3 py-1.5 rounded-full border text-sm transition ${category === c ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500">Hiển thị {visible.length} / {MOCK_COURSES.length} khóa học</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
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
            {visible.map((c) => (
              <CourseCard key={c.id} course={c} />
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
                className={`px-3 py-2 rounded-lg border ${page === i + 1 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
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
    </div>
  );
}