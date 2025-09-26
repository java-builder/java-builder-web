"use client";

import { useEffect, useMemo, useState } from 'react';
import { blogService } from '@/services/blog.service';
import { Blog, BlogType, BlogTypeDisplayNames } from '@/types/blog';
import PublicBlogCard from '@/components/blogs/PublicBlogCard';
import Header from '@/components/Header';
import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';

const USE_MOCK = true;

const MOCK_BLOGS: Blog[] = [
  {
    id: 'mock-1',
    title: '10 mẹo học lập trình hiệu quả cho người mới bắt đầu',
    content: 'Nội dung chi tiết 1',
    summary:
      'Tổng hợp 10 mẹo học lập trình hiệu quả: đặt mục tiêu, chia nhỏ vấn đề, luyện tập qua dự án nhỏ, và cách duy trì động lực lâu dài.',
    blogType: BlogType.TIPS,
    featuredImage:
      'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop',
    viewCount: 1240,
    likeCount: 86,
    author: 'F Learning Team',
    status: 'PUBLISHED',
    publishedAt: '2024-05-10T08:00:00.000Z',
    createdAt: '2024-05-09T08:00:00.000Z',
    updatedAt: '2024-05-10T08:00:00.000Z',
  },
  {
    id: 'mock-2',
    title: 'Hướng dẫn dựng dự án Next.js 15 + TailwindCSS từ A đến Z',
    content: 'Nội dung chi tiết 2',
    summary:
      'Bài viết chi tiết cách khởi tạo dự án Next.js 15, cấu hình TailwindCSS 4, tối ưu cấu trúc folder và tổ chức component theo best practices.',
    blogType: BlogType.TUTORIAL,
    featuredImage:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    viewCount: 980,
    likeCount: 64,
    author: 'Lê Khánh Đức',
    status: 'PUBLISHED',
    publishedAt: '2024-06-20T09:30:00.000Z',
    createdAt: '2024-06-19T09:30:00.000Z',
    updatedAt: '2024-06-20T09:30:00.000Z',
  },
  {
    id: 'mock-3',
    title: 'Chia sẻ kinh nghiệm tự học Data Structures & Algorithms',
    content: 'Nội dung chi tiết 3',
    summary:
      'Kinh nghiệm thực tế khi tự học DSA: chọn giáo trình, lộ trình luyện LeetCode, và cách cân bằng giữa lý thuyết và thực hành.',
    blogType: BlogType.EXPERIENCE,
    featuredImage:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    viewCount: 1560,
    likeCount: 112,
    author: 'F Learning Team',
    status: 'PUBLISHED',
    publishedAt: '2024-07-05T10:00:00.000Z',
    createdAt: '2024-07-04T10:00:00.000Z',
    updatedAt: '2024-07-05T10:00:00.000Z',
  },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(USE_MOCK ? MOCK_BLOGS.slice(0, 9) : []);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(USE_MOCK ? Math.max(1, Math.ceil(MOCK_BLOGS.length / 9)) : 0);
  const [totalElements, setTotalElements] = useState(USE_MOCK ? MOCK_BLOGS.length : 0);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [blogType, setBlogType] = useState<BlogType | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 400);
    return () => clearTimeout(t);
  }, [searchText]);

  const params = useMemo(() => {
    return {
      page: Math.max(0, page - 1),
      size,
      search: debouncedSearch || undefined,
      blogType: blogType !== 'ALL' ? blogType : undefined,
      status: 'PUBLISHED',
    };
  }, [page, size, debouncedSearch, blogType]);

  useEffect(() => {
    let mounted = true;

    if (USE_MOCK) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        if (!mounted) return;
        const keyword = (debouncedSearch || '').toLowerCase();
        const filtered = MOCK_BLOGS.filter((b) => {
          const matchType = blogType === 'ALL' ? true : b.blogType === blogType;
          const base = `${b.title} ${b.summary ?? ''} ${b.content}`.toLowerCase();
          const matchText = keyword ? base.includes(keyword) : true;
          return matchType && matchText;
        });

        const tp = Math.max(1, Math.ceil(filtered.length / (size || 1)));
        const start = Math.max(0, (page - 1) * size);
        const paged = filtered.slice(start, start + size);

        setBlogs(paged);
        setTotalElements(filtered.length);
        setTotalPages(tp);
        setIsLoading(false);
      }, 250);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await blogService.getBlogs(params);
        if (!mounted) return;

        const content: Blog[] = Array.isArray(data?.content)
          ? data.content
          : [];

        setBlogs(content);

        const tp = Number.isFinite(data?.totalPages) ? data.totalPages : Math.max(1, Math.ceil((content?.length || 0) / (params.size || size || 1)));
        const te = Number.isFinite(data?.totalElements) ? data.totalElements : (content?.length || 0);

        setTotalPages(tp);
        setTotalElements(te);
        setSize(Number.isFinite(data?.size) && data.size > 0 ? data.size : size);
      } catch (e: unknown) {
        if (!mounted) return;
        setError((e as Error)?.message || 'Không thể tải danh sách bài viết');
        setBlogs([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [params, blogType, debouncedSearch, page, size]);

  const blogTypeOptions: Array<{ value: BlogType | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Tất cả loại bài viết' },
    ...Object.values(BlogType).map((bt) => ({ value: bt, label: BlogTypeDisplayNames[bt] })),
  ];

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages || 1, p));
    setPage(clamped);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex items-center min-h-[60vh]">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="text-white">
              {/* Badge */}
              <div className="inline-block">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">Blog & Knowledge</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Chia sẻ <span className="text-emerald-400">kiến thức</span> eLearning
              </h1>

              {/* Sub text */}
              <p className="mt-4 text-base md:text-lg text-gray-100 max-w-3xl">
                Nơi tổng hợp bài viết chất lượng từ cộng đồng học tập, cập nhật xu hướng và kinh nghiệm thực tế.
              </p>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  href="#list"
                  className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Khám phá bài viết
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['Hướng dẫn', 'Kinh nghiệm', 'Tips & Tricks', 'Tin tức', 'Thảo luận'].map((t) => (
                  <span key={t} className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>
      <div id="list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 blur-xl" />

          <div className="relative bg-white/90 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <label className="sr-only" htmlFor="blog-search">Tìm kiếm</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      id="blog-search"
                      type="text"
                      placeholder="Tìm theo tiêu đề, nội dung..."
                      className="w-full h-12 rounded-full border border-gray-300 pl-11 pr-12 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm focus:shadow-md transition"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setPage(1);
                      }}
                    />
                    {searchText && (
                      <button
                        type="button"
                        aria-label="Xóa từ khóa"
                        onClick={() => {
                          setSearchText('');
                          setPage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <div>
                    <label className="sr-only" htmlFor="blog-type">Loại bài viết</label>
                    <select
                      id="blog-type"
                      className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={blogType}
                      onChange={(e) => {
                        setBlogType(e.target.value as BlogType | 'ALL');
                        setPage(1);
                      }}
                    >
                      {blogTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="page-size">Số bài/trang</label>
                    <select
                      id="page-size"
                      className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={size}
                      onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      {[6, 9, 12, 18].map((s) => (
                        <option key={s} value={s}>{s} / trang</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {(['ALL', BlogType.TUTORIAL, BlogType.EXPERIENCE, BlogType.TIPS, BlogType.NEWS] as Array<BlogType | 'ALL'>).map((t) => {
                    const active = blogType === t;
                    const label = t === 'ALL' ? 'Tất cả' : BlogTypeDisplayNames[t as BlogType];
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setBlogType(t); setPage(1); }}
                        className={`px-3 py-1.5 rounded-full border text-sm transition ${active ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {isLoading ? 'Đang tải...' : `Tìm thấy ${totalElements} bài viết`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: size }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-5/6 h-4 bg-gray-200 rounded" />
                  <div className="w-2/3 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết phù hợp</h3>
            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <PublicBlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center flex-wrap gap-2">
            <button
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }).slice(0, 7).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-2 rounded-lg border ${p === page
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  disabled={isLoading}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}