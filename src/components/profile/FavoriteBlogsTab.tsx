"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteResponse, FavoriteTargetType } from "@/types/favorite";
import { useFavorites } from "@/hooks/useFavorites";
import { formatShortDate } from "@/utils/dateUtils";
import toast from "react-hot-toast";

export default function FavoriteBlogsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { favorites: blogs, isLoading, totalPages, refetch } = useFavorites(currentPage, pageSize, FavoriteTargetType.BLOG);

  const handleRemoveFavorite = async (targetId: string) => {
    try {
      await favoriteService.toggle({ targetId, targetType: FavoriteTargetType.BLOG });
      toast.success("Đã xóa khỏi danh sách yêu thích");
      refetch();
    } catch (error) {
      console.error("Failed to remove favorite", error);
      toast.error("Không thể xóa khỏi danh sách yêu thích");
    }
  };

  const getBlogUrl = (blog: FavoriteResponse) => {
    return `/blogs/${blog.targetSlug || blog.targetId}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-black/30 border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/95 rounded-2xl shadow-sm dark:shadow-black/30 border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-950/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-950 dark:text-slate-50">Thư viện đã lưu</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {blogs.length > 0
                ? `${blogs.length} bài viết đang được lưu để đọc lại`
                : "Chưa có bài viết nào trong thư viện"}
            </p>
          </div>
          {blogs.length > 0 && (
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm text-accent hover:bg-accent/10 font-medium transition-colors"
            >
              Khám phá thêm →
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có bài viết yêu thích
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Khám phá và lưu các bài viết bạn quan tâm để đọc sau
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Khám phá bài viết
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group flex flex-col sm:flex-row gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <Link
                    href={getBlogUrl(blog)}
                    className="relative h-32 sm:h-28 sm:w-44 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  >
                    {blog.thumbnailUrl ? (
                      <Image
                        src={blog.thumbnailUrl}
                        alt={blog.targetTitle}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
                        <svg
                          className="w-10 h-10 text-gray-300 dark:text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mb-2">
                      <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-950/50 px-2 py-0.5 font-medium text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900">
                        Đã lưu
                      </span>
                      <span>{formatShortDate(blog.addedAt)}</span>
                    </div>

                    <Link href={getBlogUrl(blog)}>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-950 dark:text-slate-50 line-clamp-2 group-hover:text-accent transition-colors">
                        {blog.targetTitle}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mt-2">
                      {blog.targetDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <Link
                        href={getBlogUrl(blog)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                      >
                        Đọc bài viết
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite(blog.targetId)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                        title="Xóa khỏi yêu thích"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Bỏ lưu
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-800"
                >
                  ← Trước
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-accent text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-800"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
