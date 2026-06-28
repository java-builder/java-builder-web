"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType, FavoriteResponse } from "@/types/favorite";
import { CourseLevel } from "@/types/course";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { formatShortDate } from "@/utils/dateUtils";
import { useI18n } from "@/contexts/I18nContext";

interface CacheState {
  data: FavoriteResponse[];
  totalPages: number;
  totalElements: number;
  hasFetched: boolean;
  page: number;
}

export default function FavoritesPage() {
  const { t } = useI18n();
  const PAGE_SIZE = 12;

  const [activeTab, setActiveTab] = useState<FavoriteTargetType>(FavoriteTargetType.COURSE);
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState<Record<FavoriteTargetType, number>>({
    [FavoriteTargetType.COURSE]: 1,
    [FavoriteTargetType.BLOG]: 1,
  });

  const [cache, setCache] = useState<Record<FavoriteTargetType, CacheState>>({
    [FavoriteTargetType.COURSE]: { data: [], totalPages: 1, totalElements: 0, hasFetched: false, page: 1 },
    [FavoriteTargetType.BLOG]: { data: [], totalPages: 1, totalElements: 0, hasFetched: false, page: 1 },
  });

  const currentPage = pages[activeTab];
  const activeCache = cache[activeTab];
  const { data: favorites, totalPages, totalElements } = activeCache;
  const hasFetched = activeCache.hasFetched;
  const cachedPage = activeCache.page;

  useEffect(() => {
    if (hasFetched && cachedPage === currentPage) {
      // Data is already cached for this tab and page, do not call API.
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await favoriteService.getMyFavorites(currentPage, PAGE_SIZE, activeTab);
        const pageData = result.data;
        if (pageData) {
          setCache(prev => ({
            ...prev,
            [activeTab]: {
              data: pageData.data || [],
              totalPages: pageData.totalPages || 1,
              totalElements: pageData.totalElements || 0,
              hasFetched: true,
              page: currentPage
            }
          }));
        }
      } catch (error) {
        toast.error(t("favoritesPage.loadError"));
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab, currentPage, hasFetched, cachedPage, t]);

  const handleTabChange = (tab: FavoriteTargetType) => {
    setActiveTab(tab);
  };

  const handlePageChange = (newPage: number) => {
    setPages(prev => ({
      ...prev,
      [activeTab]: newPage
    }));
  };

  const handleRemoveFavorite = async (targetId: string, targetType: FavoriteTargetType) => {
    try {
      await favoriteService.toggle({ targetId, targetType });
      
      // Force refetch current page for active tab to sync UI
      setIsLoading(true);
      const result = await favoriteService.getMyFavorites(currentPage, PAGE_SIZE, activeTab);
      const pageData = result.data;
      if (pageData) {
        setCache(prev => ({
          ...prev,
          [activeTab]: {
            data: pageData.data || [],
            totalPages: pageData.totalPages || 1,
            totalElements: pageData.totalElements || 0,
            hasFetched: true,
            page: currentPage
          }
        }));
      }
      toast.success(t("favoritesPage.removedSuccess"));
    } catch {
      toast.error(t("favoritesPage.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return t("courseDetail.freePreview") || "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getLevelStyle = (level?: string) => {
    if (!level) return { label: "", className: "" };
    switch (level as CourseLevel) {
      case CourseLevel.BEGINNER:
        return {
          label: t("courseDetail.beginner"),
          className: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40",
        };
      case CourseLevel.INTERMEDIATE:
        return {
          label: t("courseDetail.intermediate"),
          className: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40",
        };
      case CourseLevel.ADVANCED:
        return {
          label: t("courseDetail.advanced"),
          className: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40",
        };
      case CourseLevel.EXPERT:
        return {
          label: t("courseDetail.expert") || "Chuyên sâu",
          className: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900/40",
        };
      default:
        return {
          label: level,
          className: "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-slate-700",
        };
    }
  };

  const getItemUrl = (item: typeof favorites[0]) => {
    const slug = item.targetSlug || item.targetId;
    return item.targetType === FavoriteTargetType.COURSE 
      ? `/courses/${slug}` 
      : `/blogs/${slug}`;
  };

  const getItemIcon = (targetType: FavoriteTargetType) => {
    return targetType === FavoriteTargetType.COURSE ? (
      <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ) : (
      <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("favoritesPage.title") },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {t("favoritesPage.title")}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t("favoritesPage.subtitle")}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex gap-8">
            <button
              onClick={() => handleTabChange(FavoriteTargetType.COURSE)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === FavoriteTargetType.COURSE
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t("favoritesPage.coursesTab")}
              </div>
            </button>
            <button
              onClick={() => handleTabChange(FavoriteTargetType.BLOG)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === FavoriteTargetType.BLOG
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {t("favoritesPage.blogsTab")}
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {activeTab === FavoriteTargetType.COURSE ? t("favoritesPage.emptyCoursesTitle") : t("favoritesPage.emptyBlogsTitle")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {activeTab === FavoriteTargetType.COURSE 
                ? t("favoritesPage.emptyCoursesDesc")
                : t("favoritesPage.emptyBlogsDesc")}
            </p>
            <Link 
              href={activeTab === FavoriteTargetType.COURSE ? "/courses" : "/blogs"} 
              className="inline-flex items-center px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors text-sm shadow-sm"
            >
              {activeTab === FavoriteTargetType.COURSE ? t("favoritesPage.exploreCourses") : t("favoritesPage.exploreBlogs")}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-gray-200/80 dark:border-slate-700/60 hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden group flex flex-col h-full">
                  <Link href={getItemUrl(item)}>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 dark:bg-slate-900/50">
                      {item.thumbnailUrl ? (
                        <Image 
                          src={item.thumbnailUrl} 
                          alt={item.targetTitle} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/70 via-accent to-indigo-650 flex items-center justify-center">
                          {getItemIcon(item.targetType)}
                        </div>
                      )}
                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.targetType === FavoriteTargetType.COURSE 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-purple-500 text-white'
                        }`}>
                          {item.targetType === FavoriteTargetType.COURSE ? t("favoritesPage.coursesTab") : t("favoritesPage.blogsTab")}
                        </span>
                      </div>
                      {/* Favorite Button */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFavorite(item.targetId, item.targetType);
                          }}
                          className="flex h-8 w-8 p-0 items-center justify-center bg-white/95 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full shadow-md transition-colors dark:bg-slate-900/90 dark:text-rose-450 dark:hover:text-rose-400"
                          title={t("favoritesPage.removedSuccess") || "Xóa khỏi yêu thích"}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      {item.courseLevel && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getLevelStyle(item.courseLevel).className}`}>
                          {getLevelStyle(item.courseLevel).label}
                        </span>
                      )}
                      {item.courseDuration && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ⏱️ {item.courseDuration} {t("courseDetail.hours") || "giờ"}
                        </span>
                      )}
                    </div>
                    <Link href={getItemUrl(item)}>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200 leading-snug">
                        {item.targetTitle}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed flex-grow">
                      {item.targetDescription}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700/60 mt-auto">
                      {item.targetType === FavoriteTargetType.COURSE ? (
                        <>
                          <span className="text-base font-bold text-accent">
                            {formatPrice(item.coursePrice)}
                          </span>
                          <Link
                            href={getItemUrl(item)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-accent transition-transform duration-200 hover:translate-x-0.5"
                          >
                            <span>{t("favoritesPage.viewDetails")}</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t("favoritesPage.savedAt")}: {formatShortDate(item.addedAt)}
                          </span>
                          <Link
                            href={getItemUrl(item)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-accent transition-transform duration-200 hover:translate-x-0.5"
                          >
                            <span>{t("favoritesPage.viewDetails")}</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
                itemName={t("favoritesPage.itemUnit").toLowerCase()}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
