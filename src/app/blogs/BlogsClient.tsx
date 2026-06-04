"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { blogService } from "@/services/blog.service";
import { categoryService } from "@/services/category.service";
import { Blog } from "@/types/blog";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import PublicBlogCard from "@/components/blogs/PublicBlogCard";
import MotionWrapper from "@/components/MotionWrapper";
import SearchBar from "@/components/ui/SearchBar";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";

export default function BlogsPage() {
  const { t } = useI18n();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState<string | "ALL">("ALL");
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
      categorySlug?: string;
    } = {
      page,
      size: 20,
    };

    if (currentSearch && currentSearch.trim().length > 0) {
      paramObj.titleOrSummary = currentSearch.trim();
    }

    if (categorySlug !== "ALL") {
      paramObj.categorySlug = categorySlug;
    }

    return paramObj;
  }, [page, currentSearch, categorySlug]);

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
      setError((e as Error)?.message || (t("home.loadBlogsError") || "Không thể tải danh sách bài viết"));
      setBlogs([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [params, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll(CategoryType.BLOG);
        setCategories(res.data || []);
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      }
    };
    fetchCategories();
  }, []);

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages || 1, p));
    setPage(clamped);
  };

  const tagLabels = [
    t("blogsPage.tagTutorial"),
    t("blogsPage.tagExperience"),
    t("blogsPage.tagTips"),
    t("blogsPage.tagNews"),
    t("blogsPage.tagDiscussion")
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-r from-white to-blue-50 py-8 md:py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <div className="lg:col-span-7 text-gray-900">
                <div className="inline-block">
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                    {t("blogsPage.heroBadge")}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                  {t("blogsPage.heroTitleStart")} <span className="text-accent">{t("blogsPage.heroTitleAccent")}</span>
                </h1>

                <p className="mt-3 text-sm md:text-base text-gray-700 max-w-xl leading-relaxed">
                  {t("blogsPage.heroDesc")}
                </p>

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-3">
                  <Link
                    href="#list"
                    className="inline-flex items-center justify-center px-4 py-2 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-sm"
                  >
                    {t("blogsPage.exploreBtn")}
                  </Link>
                  <Link
                    href="/blogs"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-sm font-semibold"
                  >
                    {t("home.viewAllBlogs")}
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tagLabels.map((tLabel) => (
                    <span
                      key={tLabel}
                      className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700"
                    >
                      {tLabel}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <Image
                    src="/banners/banner-blog.jpg"
                    alt="Blog hero"
                    width={600}
                    height={400}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>
      <div id="list" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10">
        {/* Filter Section - Compact */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4">
            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar
                placeholder={t("blogsPage.searchPlaceholder")}
                value={searchText}
                onChange={setSearchText}
                onSearch={handleSearch}
              />
            </div>

            {/* Filters in one row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Category */}
              {categories.length > 0 && (
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap pt-1.5">{t("blogsPage.categoryLabel")}</span>
                  <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 pb-1">
                      <button
                        type="button"
                        onClick={() => { setCategorySlug("ALL"); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                          categorySlug === "ALL"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {t("blogsPage.filterAll")}
                      </button>
                      {categories.map((cat) => {
                        const active = categorySlug === cat.slug;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => { setCategorySlug(cat.slug); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                              active
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                            }`}
                          >
                            {cat.icon && <span className="mr-1">{cat.icon}</span>}
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 pt-1.5 whitespace-nowrap">
                    {totalElements} {t("blogsPage.postsCount")}
                  </div>
                </div>
              )}
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
                  {t("blogsPage.errorTitle")}
                </h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
                >
                  {t("blogsPage.retryBtn")}
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
                  {t("blogsPage.noBlogsTitle")}
                </h3>
                <p className="text-gray-500">
                  {t("blogsPage.noBlogsDesc")}
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
              {t("blogsPage.prevBtn")}
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
              {t("blogsPage.nextBtn")}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
