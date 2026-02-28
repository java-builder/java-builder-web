"use client";

import Image from "next/image";
import Link from "next/link";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import { formatApiDateOnly } from "@/utils/dateUtils";
import BlogTypeIcon from "@/components/admin/blogs/BlogTypeIcon";

interface BlogSidebarProps {
  blog: Blog;
  relatedBlogs: Blog[];
  isLoadingRelated?: boolean;
}

export default function BlogSidebar({ blog, relatedBlogs, isLoadingRelated = false }: BlogSidebarProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Author Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
          Về tác giả
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-full">
            <Image
              src="/logos/java-logo.png"
              alt="JavaBuilder"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              JavaBuilder
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Tác giả bài viết
            </p>
          </div>
        </div>
      </div>

      {/* Related Blogs */}
      {(isLoadingRelated || relatedBlogs.length > 0) && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Bài viết liên quan
          </h3>
          {isLoadingRelated ? (
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-2 animate-pulse">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-gray-200 dark:bg-slate-700"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-2 sm:space-y-3">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blogs/${relatedBlog.slug}`}
                    className="block group"
                  >
                    <div className="flex space-x-2">
                      {relatedBlog.thumbnailUrl && (
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-slate-700">
                          <Image
                            src={relatedBlog.thumbnailUrl}
                            alt={relatedBlog.title}
                            width={56}
                            height={56}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors line-clamp-2 leading-tight">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                          {formatApiDateOnly(relatedBlog.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-slate-700">
                <Link
                  href="/blogs"
                  className="text-xs sm:text-sm text-accent-500 hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300 font-medium"
                >
                  Xem tất cả →
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
          Hành động nhanh
        </h3>
        <div className="space-y-1 sm:space-y-2">
          <Link
            href="/blogs"
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
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
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Tất cả bài viết
            </span>
          </Link>
          <Link
            href={`/blogs?blogType=${blog.blogType}`}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <BlogTypeIcon
              blogType={blog.blogType}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {BlogTypeDisplayNames[blog.blogType]}
            </span>
          </Link>
          <Link
            href="/courses"
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Khóa học</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
