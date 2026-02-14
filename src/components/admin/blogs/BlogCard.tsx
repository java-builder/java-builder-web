import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import Image from "next/image";
import BlogTypeIcon from "./BlogTypeIcon";
import MarkdownRenderer from "./MarkdownRenderer";
import { formatApiDate } from "@/utils/dateUtils";

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string, title: string) => void;
  onPreview?: (blog: Blog) => void;
  isDeleting?: boolean;
}

export default function BlogCard({
  blog,
  onEdit,
  onDelete,
  onPreview,
  isDeleting,
}: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Featured Image */}
      {blog.thumbnailUrl ? (
        <div className="w-full h-28 sm:h-32 md:h-32 lg:h-36 overflow-hidden relative bg-gray-50 flex items-center justify-center">
          <Image
            src={blog.thumbnailUrl}
            alt={blog.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain w-full h-full transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-28 sm:h-32 md:h-32 lg:h-36 overflow-hidden bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M7 7l5 5 5-5" />
              </svg>
            </div>
            <div className="text-sm text-gray-500">No image</div>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BlogTypeIcon
                blogType={blog.blogType}
                className="w-4 h-4 text-blue-600"
              />
            </div>
            <div>
              <span className="text-xs font-medium text-blue-600">
                {BlogTypeDisplayNames[blog.blogType]}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-accent-600 transition-colors duration-200">
          {blog.title}
        </h3>

        {/* Summary */}
        {blog.summary && (
          <div className="mb-4">
            <MarkdownRenderer
              content={blog.summary}
              className="text-sm text-gray-600 line-clamp-2"
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-3 mb-3 text-sm text-gray-500">
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-400"
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
              className="w-5 h-5 mr-1 text-gray-400"
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
              className="w-5 h-5 mr-1 text-gray-400"
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

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Tạo lúc: {formatApiDate(blog.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
          {onPreview && (
            <button
              onClick={() => onPreview(blog)}
              className="inline-flex items-center px-3 py-2 text-sm font-semibold !text-sky-700 dark:!text-sky-300 bg-accent-100 dark:bg-accent-900/30 hover:bg-accent-200 dark:hover:bg-accent-800/40 rounded-md transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              Xem
            </button>
          )}
          <button
            onClick={() => onEdit(blog)}
            className="inline-flex items-center px-2 py-1.5 text-sm font-semibold !text-gray-700 dark:!text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Sửa
          </button>
          <button
            onClick={() => onDelete(blog.id, blog.title)}
            disabled={isDeleting}
            className="inline-flex items-center px-2 py-1.5 text-sm font-semibold !text-red-700 dark:!text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xóa...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Xóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
