"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { useFavorites } from "@/hooks/useFavorites";
import { formatShortDate } from "@/utils/dateUtils";
import toast from "react-hot-toast";

export default function FavoriteBlogsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
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

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bài viết yêu thích</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {blogs.length > 0
                ? `${blogs.length} bài viết`
                : "Chưa có bài viết yêu thích"}
            </p>
          </div>
          {blogs.length > 0 && (
            <Link
              href="/blogs"
              className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Khám phá thêm →
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
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
            {/* Blog Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-500 transition-all duration-200"
                >
                  {/* Blog Cover */}
                  <div className="relative w-full h-48 bg-white dark:bg-slate-600 border-b border-gray-100 dark:border-slate-600">
                    {blog.thumbnailUrl ? (
                      <div className="relative w-full h-full p-4">
                        <Image
                          src={blog.thumbnailUrl}
                          alt={blog.targetTitle}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600">
                        <svg
                          className="w-16 h-16 text-gray-300 dark:text-gray-500"
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
                    {/* Favorite Badge */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleRemoveFavorite(blog.targetId)}
                        className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all shadow-md border border-gray-200"
                        title="Xóa khỏi yêu thích"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Blog Info */}
                  <div className="p-4">
                    <Link href={`/blogs/${blog.targetId}`}>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-accent transition-colors min-h-[3rem]">
                        {blog.targetTitle}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 min-h-[2.5rem]">
                      {blog.targetDescription}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-600">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatShortDate(blog.addedAt)}
                      </span>
                      <Link
                        href={`/blogs/${blog.targetId}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                      >
                        Xem chi tiết
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
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
