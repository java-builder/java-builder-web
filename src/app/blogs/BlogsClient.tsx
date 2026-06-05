"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { blogService } from "@/services/blog.service";
import { categoryService } from "@/services/category.service";
import { Blog } from "@/types/blog";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import PublicBlogCard from "@/components/blogs/PublicBlogCard";
import {
  BlogsEmptyState,
  BlogsErrorState,
  BlogsFilterBar,
  BlogsHero,
  BlogsLoadingState,
} from "@/components/blogs/page";
import { Pagination } from "@/components/ui/Pagination";
import { useI18n } from "@/contexts/I18nContext";

const PAGE_SIZE = 20;

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

  const handleSearchSubmit = () => {
    setCurrentSearch(searchText.trim());
    setPage(1);
  };

  const handleCategoryChange = (slug: string | "ALL") => {
    setCategorySlug(slug);
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
      size: PAGE_SIZE,
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
      const content: Blog[] = Array.isArray(data?.data?.data)
        ? data.data.data
        : [];

      setBlogs(content);
      const tp = Number.isFinite(data?.data?.totalPages)
        ? data.data!.totalPages
        : 1;
      const te = Number.isFinite(data?.data?.totalElements)
        ? data.data!.totalElements
        : content?.length || 0;

      setTotalPages(tp);
      setTotalElements(te);
    } catch (e: unknown) {
      setError(
        (e as Error)?.message ||
          t("home.loadBlogsError") ||
          "Không thể tải danh sách bài viết"
      );
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

  const tagLabels = [
    t("blogsPage.tagTutorial"),
    t("blogsPage.tagExperience"),
    t("blogsPage.tagTips"),
    t("blogsPage.tagNews"),
    t("blogsPage.tagDiscussion"),
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <BlogsHero
        badgeLabel={t("blogsPage.heroBadge")}
        titleStart={t("blogsPage.heroTitleStart")}
        titleAccent={t("blogsPage.heroTitleAccent")}
        description={t("blogsPage.heroDesc")}
        exploreLabel={t("blogsPage.exploreBtn")}
        tagLabels={tagLabels}
      />

      <section
        id="blogs-list"
        className="mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6 lg:px-8"
      >
        <BlogsFilterBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          categorySlug={categorySlug}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          totalElements={totalElements}
          filterLabel={t("blogsPage.filterLabel")}
          searchPlaceholder={t("blogsPage.searchPlaceholder")}
          totalLabel={t("blogsPage.postsCount")}
          allLabel={t("blogsPage.filterAll")}
        />

        {isLoading ? (
          <BlogsLoadingState />
        ) : error ? (
          <BlogsErrorState
            title={t("blogsPage.errorTitle")}
            description={error}
            retryLabel={t("blogsPage.retryBtn")}
            onRetry={fetchData}
          />
        ) : blogs.length === 0 ? (
          <BlogsEmptyState
            title={t("blogsPage.noBlogsTitle")}
            description={t("blogsPage.noBlogsDesc")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => (
              <PublicBlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}

        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            itemName={t("blogsPage.postsCount")}
          />
        )}
      </section>
    </main>
  );
}
