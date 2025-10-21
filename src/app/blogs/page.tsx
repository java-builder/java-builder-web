"use client";

import { useEffect, useMemo, useState } from 'react';
import { blogService } from '@/services/blog.service';
import { Blog, BlogType, BlogTypeDisplayNames } from '@/types/blog';
import PublicBlogCard from '@/components/blogs/PublicBlogCard';
import Header from '@/components/Header';
import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';


export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
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
      page,
      search: debouncedSearch || undefined,
      blogType: blogType !== 'ALL' ? blogType : undefined,
      status: 'PUBLISHED',
    };
  }, [page, debouncedSearch, blogType]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await blogService.getBlogs(params);
        if (!mounted) return;

        const content: Blog[] = Array.isArray(data?.result)
          ? data.result
          : [];

        setBlogs(content);

        const tp = Number.isFinite(data?.totalPages) ? data.totalPages : 1;
        const te = Number.isFinite(data?.totalElements) ? data.totalElements : (content?.length || 0);

        setTotalPages(tp);
        setTotalElements(te);
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
  }, [params, blogType, debouncedSearch, page]);

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

      <section className="relative min-h-[70vh] bg-gray-900">
        {/* Background with code snippets */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative overflow-hidden bg-gray-900">
            {/* Code snippets overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 text-orange-400 font-mono text-xs">
                <div>const blog = {`{`}</div>
                <div>&nbsp;&nbsp;title: &quot;Learning&quot;,</div>
                <div>&nbsp;&nbsp;content: &quot;Knowledge&quot;</div>
                <div>{`}`};</div>
              </div>
              <div className="absolute top-40 right-20 text-blue-400 font-mono text-xs">
                <div>function share() {`{`}</div>
                <div>&nbsp;&nbsp;return &quot;wisdom&quot;;</div>
                <div>{`}`}</div>
              </div>
              <div className="absolute bottom-40 left-20 text-purple-400 font-mono text-xs">
                <div>if (learning) {`{`}</div>
                <div>&nbsp;&nbsp;grow();</div>
                <div>{`}`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex items-center min-h-[70vh]">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="text-white">
              {/* Badge */}
              <div className="inline-block">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">Blog & Knowledge</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Chia sẻ <span className="text-orange-400">kiến thức</span> eLearning
              </h1>

              {/* Sub text */}
              <p className="mt-4 text-base md:text-lg text-gray-100 max-w-3xl">
                Nơi tổng hợp bài viết chất lượng từ cộng đồng học tập, cập nhật xu hướng và kinh nghiệm thực tế.
              </p>

              {/* CTA */}
              <div className="pt-5">
                <Link
                  href="#list"
                  className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/15 via-orange-500/15 to-orange-500/15 blur-xl" />

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
                      className="w-full h-12 rounded-full border border-gray-300 pl-11 pr-12 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm focus:shadow-md transition"
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
                      className="h-12 rounded-full border border-gray-300 px-4 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        className={`px-3 py-1.5 rounded-full border text-sm transition ${active ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
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
            {Array.from({ length: 9 }).map((_, i) => (
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
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
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