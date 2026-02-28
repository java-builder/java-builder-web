"use client";

import Link from "next/link";
import { Blog } from "@/types/blog";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface BlogContentProps {
  blog: Blog;
}

export default function BlogContent({ blog }: BlogContentProps) {
  return (
    <>
      {/* Summary */}
      {blog.summary && (
        <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-xs sm:text-sm">
            Tóm tắt
          </h3>
          <PublicMarkdownRenderer
            content={blog.summary}
            className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm leading-relaxed"
          />
        </div>
      )}

      {/* Category and Tags */}
      {(blog.categoryName || (blog.tags && blog.tags.length > 0)) && (
        <div className="mb-4 sm:mb-5 md:mb-6 flex flex-wrap gap-2">
          {blog.categoryName && (
            <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium border border-purple-200 dark:border-purple-800">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {blog.categoryName}
            </span>
          )}
          {blog.tags && blog.tags.map((tag, index) => (
            <span key={typeof tag === 'string' ? tag : tag.id || index} className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
              #{typeof tag === 'string' ? tag : tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="max-w-none prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
        <PublicMarkdownRenderer content={blog.content} />
      </div>

      {/* Premium Content Blocker */}
      {blog.isPremium && blog.canAccess === false && (
        <div className="mt-8 relative">
          <div className="relative text-center py-12 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nội dung Premium
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Bài viết này yêu cầu gói Premium để đọc toàn bộ nội dung. Nâng cấp ngay để truy cập không giới hạn!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Nâng cấp Premium
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors border border-gray-300 dark:border-slate-600"
              >
                Xem các gói
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Truy cập không giới hạn</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Nội dung độc quyền</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
