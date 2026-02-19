import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import BlogTypeIcon from "@/components/admin/blogs/BlogTypeIcon";
import { formatApiDateOnly } from "@/utils/dateUtils";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface PublicBlogCardProps {
  blog: Blog;
}

export default function PublicBlogCard({ blog }: PublicBlogCardProps) {
  const { data: currentUser } = useCurrentUser();

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleReadMoreClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      setAuthModal({
        isOpen: true,
        title: "Đăng nhập để đọc bài viết",
        message: "Bạn cần đăng nhập để đọc đầy đủ nội dung bài viết này.",
      });
      return;
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {blog.thumbnailUrl && (
        <Link href={`/blogs/${blog.slug}`} className="block">
          <div className="aspect-[16/10] w-full overflow-hidden relative">
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      )}

      <div className="p-4 flex flex-col flex-grow">
        {/* Header với type và date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md">
              <BlogTypeIcon
                blogType={blog.blogType}
                className="w-3.5 h-3.5 text-blue-600"
              />
            </div>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
              {BlogTypeDisplayNames[blog.blogType]}
            </span>
          </div>
          <time className="text-xs text-gray-500" dateTime={blog.createdAt}>
            {formatApiDateOnly(blog.createdAt)}
          </time>
        </div>

        {/* Title */}
        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200 leading-tight">
            {blog.title}
          </h3>
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {blog.summary}
          </p>
        )}

        {/* Category and Tags */}
        {(blog.categoryName || (blog.tags && blog.tags.length > 0)) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {blog.categoryName && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {blog.categoryName}
              </span>
            )}
            {blog.tags && blog.tags.slice(0, 3).map((tag, index) => (
              <span key={typeof tag === 'string' ? tag : tag.id || index} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
                #{typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {blog.tags && blog.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer với stats và author */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              <span className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                <svg
                  className="w-3.5 h-3.5 text-gray-600"
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
                <span className="font-semibold text-gray-900">
                  {blog.viewCount}
                </span>
              </span>
              <span className="flex items-center space-x-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800/50">
                <svg
                  className="w-3.5 h-3.5"
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
              </span>
              <span className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                <svg
                  className="w-3.5 h-3.5"
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
              </span>
            </div>

            <Link
              href={`/blogs/${blog.slug}`}
              onClick={handleReadMoreClick}
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-accent to-accent-600 text-white text-xs font-medium rounded-md hover:from-accent-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Đọc tiếp
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Author (show system logo + JavaBuilder instead of blog.author) */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder"
                width={20}
                height={20}
                className="rounded-sm"
              />
              <span className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">JavaBuilder</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        title={authModal.title}
        message={authModal.message}
      />
    </article>
  );
}
