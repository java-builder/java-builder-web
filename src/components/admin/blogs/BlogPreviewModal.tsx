"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import BlogTypeIcon from "./BlogTypeIcon";
import MarkdownRenderer from "./MarkdownRenderer";
import { formatApiDate } from "@/utils/dateUtils";

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}

export default function BlogPreviewModal({
  isOpen,
  onClose,
  blog,
}: BlogPreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden dark:bg-slate-900 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 dark:bg-slate-900 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BlogTypeIcon
                  blogType={blog.blogType}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Preview Bài viết
                </h2>
                <p className="text-sm text-gray-600">
                  {BlogTypeDisplayNames[blog.blogType]} •{" "}
                  {formatApiDate(blog.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800"
            >
              <svg
                className="w-6 h-6 text-gray-400 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <article className="p-6 text-gray-700 dark:text-gray-200">
              {/* Featured Image */}
              {blog.thumbnailUrl && (
                <div className="mb-6 relative w-full h-64">
                  <Image
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    fill
                    sizes="100vw"
                  className="object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 pb-4 border-b border-gray-200">
                {blog.author && (
                  <>
                    <span>Tác giả: {blog.author}</span>
                    <span>•</span>
                  </>
                )}
                <span>{formatApiDate(blog.createdAt)}</span>
                <span>•</span>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {blog.viewCount}
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {blog.likeCount}
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {blog.commentCount}
                  </span>
                </div>
              </div>

              {/* Summary */}
              {blog.summary && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg dark:bg-slate-800 dark:border-slate-700">
                  <h3 className="font-medium text-blue-900 mb-2 dark:text-white">Tóm tắt</h3>
                  {mounted ? (
                    <MarkdownRenderer
                      content={blog.summary}
                      className="text-blue-800 dark:text-gray-200"
                    />
                  ) : (
                    <p className="text-blue-800 dark:text-gray-200">{blog.summary}</p>
                  )}
                </div>
              )}

              {/* Content */}
              {mounted ? (
                <MarkdownRenderer content={blog.content} className="text-gray-700 dark:text-gray-200" />
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              )}
            </article>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 dark:bg-slate-900 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Bài viết này sẽ hiển thị như thế này khi được xuất bản
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
