"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { blogService } from "@/services/blog.service";
import { Blog, BlogType, BlogTypeDisplayNames } from "@/types/blog";
import PublicBlogCard from "@/components/blogs/PublicBlogCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import SearchBar from "@/components/ui/SearchBar";
import Link from "next/link";
import Image from "next/image";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [blogType, setBlogType] = useState<BlogType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    const trimmed = searchText.trim();
    setCurrentSearch(trimmed);
    setPage(1);
  };

  const params = useMemo(() => {
    const paramObj: {
      page: number;
      size: number;
      titleOrSummary?: string;
      blogType?: string;
    } = {
      page,
      size: 20,
    };

    if (currentSearch && currentSearch.trim().length > 0) {
      paramObj.titleOrSummary = currentSearch.trim();
    }

    if (blogType !== "ALL") {
      paramObj.blogType = blogType;
    }

    return paramObj;
  }, [page, currentSearch, blogType]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlogs(params);

      const content: Blog[] = Array.isArray(data?.data?.data) ? data.data.data : [];

      setBlogs(content);

      const tp = Number.isFinite(data?.data?.totalPages) ? data.data!.totalPages : 1;
      const te = Number.isFinite(data?.data?.totalElements)
        ? data.data!.totalElements
        : content?.length || 0;

      setTotalPages(tp);
      setTotalElements(te);
    } catch (e: unknown) {
      setError((e as Error)?.message || "Không thể tải danh sách bài viết");
      setBlogs([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages || 1, p));
    setPage(clamped);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative bg-gradient-to-r from-white to-blue-50 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 text-gray-900">
                <div className="inline-block">
                  <span className="bg-accent text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    Blog & Knowledge
                  </span>
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Chia sẻ <span className="text-accent">kiến thức</span>
                </h1>

                <p className="mt-3 text-base md:text-lg text-gray-700 max-w-2xl">
                  Nơi tôi (
                  <span className="text-accent font-semibold">
                    JavaBuilder
                  </span>
                  ) chia sẻ kiến thức, cập nhật xu hướng và kinh nghiệm thực tế.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                  <Link
                    href="#list"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    Khám phá bài viết
                  </Link>
                  <Link
                    href="/blogs"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    Xem tất cả
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Hướng dẫn",
                    "Kinh nghiệm",
                    "Tips & Tricks",
                    "Tin tức",
                    "Thảo luận",
                  ].map((t) => (
                    <span
                      key={t}
                      className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-200/50">
                  <Image
                    src="/hero-background.jpg"
                    alt="Blog hero"
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
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/15 via-accent/15 to-accent/15 blur-xl" />

          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              <SearchBar
                placeholder="Tìm theo tiêu đề, nội dung..."
                value={searchText}
                onChange={setSearchText}
                onSearch={handleSearch}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "ALL",
                      BlogType.TUTORIAL,
                      BlogType.EXPERIENCE,
                      BlogType.TIPS,
                      BlogType.NEWS,
                    ] as Array<BlogType | "ALL">
                  ).map((t) => {
                    const active = blogType === t;
                    const label =
                      t === "ALL"
                        ? "Tất cả"
                        : BlogTypeDisplayNames[t as BlogType];
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setBlogType(t);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full border text-sm transition ${active ? "bg-accent text-white border-accent shadow" : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {isLoading
                    ? "Đang tải..."
                    : `Tìm thấy ${totalElements} bài viết`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
              >
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
            {error ? (
              <>
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-red-500"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Có lỗi xảy ra
                </h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
                >
                  Thử lại
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có bài viết phù hợp
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </>
            )}
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
            {Array.from({ length: totalPages })
              .slice(0, 7)
              .map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`px-3 py-2 rounded-lg border ${
                      p === page
                        ? "border-accent bg-blue-50 text-accent"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
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

      <Footer />
    </div>
  );
}
