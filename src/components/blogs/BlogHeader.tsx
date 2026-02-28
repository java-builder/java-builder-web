"use client";

import Image from "next/image";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import { formatApiDate } from "@/utils/dateUtils";
import BlogTypeIcon from "@/components/admin/blogs/BlogTypeIcon";
import toast from "react-hot-toast";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";

interface BlogHeaderProps {
  blog: Blog;
  isFavorite: boolean;
  favoriteLoading: boolean;
  onFavoriteToggle: (isFavorite: boolean) => void;
  onAuthRequired: () => void;
  isAuthenticated: boolean;
}

export default function BlogHeader({
  blog,
  isFavorite,
  favoriteLoading,
  onFavoriteToggle,
  onAuthRequired,
  isAuthenticated,
}: BlogHeaderProps) {
  const handleFavoriteClick = async () => {
    if (!blog?.id) return;
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    try {
      const result = await favoriteService.toggle({
        targetId: blog.id,
        targetType: FavoriteTargetType.BLOG,
      });
      if (result.code === 200) {
        onFavoriteToggle(result.data ?? false);
        toast.success(result.data ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích");
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="mb-3 sm:mb-4 md:mb-5">
      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
        <div className="p-1 sm:p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
          <BlogTypeIcon
            blogType={blog.blogType}
            className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400"
          />
        </div>
        <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">
          {BlogTypeDisplayNames[blog.blogType]}
        </span>
      </div>

      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight flex-1 mb-3 sm:mb-4">
        {blog.title}
      </h1>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs">
          <Image
            src="/logos/java-logo.png"
            alt="JavaBuilder"
            width={14}
            height={14}
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 object-contain"
          />
          <span className="truncate max-w-[100px] sm:max-w-none font-medium">
            JavaBuilder
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs">
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <time
            dateTime={blog.createdAt}
            className="whitespace-nowrap text-[10px] sm:text-xs"
          >
            {formatApiDate(blog.createdAt)}
          </time>
        </div>
        <div className="flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800 text-xs">
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="font-semibold text-emerald-900 dark:text-emerald-300">
            {blog.viewCount}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-md border border-red-100 dark:border-red-800/50 text-xs">
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="font-semibold">{blog.likeCount}</span>
        </div>
        <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-800/50 text-xs">
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="font-semibold">{blog.commentCount}</span>
        </div>
        <button
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs transition-all duration-200 disabled:opacity-50 ${
            isFavorite
              ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/50"
              : "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-slate-600"
          }`}
          aria-label={isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
        >
          {favoriteLoading ? (
            <svg className="animate-spin w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isFavorite ? 0 : 2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
          <span className="hidden sm:inline font-semibold">
            {isFavorite ? "Đã thích" : "Yêu thích"}
          </span>
        </button>
      </div>
    </div>
  );
}
