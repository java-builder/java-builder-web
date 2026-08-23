import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import BlogTypeIcon from "@/components/admin/blogs/BlogTypeIcon";
import { formatRelativeTime } from "@/utils/dateUtils";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useI18n } from "@/contexts/I18nContext";

interface PublicBlogCardProps {
  blog: Blog;
}

export default function PublicBlogCard({ blog }: PublicBlogCardProps) {
  const { t } = useI18n();
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
    <article className="bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-gray-200/80 dark:border-slate-700/60 hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {blog.thumbnailUrl && (
        <Link href={`/blogs/${blog.slug}`} onClick={handleReadMoreClick} className="block">
          <div className="aspect-[16/10] w-full overflow-hidden relative bg-gray-50 dark:bg-slate-900/50">
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
            <div className="p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700/60 rounded-md">
              <BlogTypeIcon
                blogType={blog.blogType}
                className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
              />
            </div>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-full border border-blue-100/50 dark:border-blue-900/30">
              {BlogTypeDisplayNames[blog.blogType]}
            </span>
          </div>
          <time className="text-xs text-gray-500 dark:text-slate-400" dateTime={blog.createdAt}>
            {formatRelativeTime(blog.createdAt, t)}
          </time>
        </div>

        {/* Title */}
        <Link href={`/blogs/${blog.slug}`} onClick={handleReadMoreClick}>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200 leading-snug">
            {blog.title}
          </h3>
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
            {blog.summary}
          </p>
        )}

        {/* Category and Tags */}
        {(blog.categoryName || (blog.tags && blog.tags.length > 0)) && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {blog.categoryName && (
              <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/30 rounded-md text-xs font-medium">
                <svg className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {blog.categoryName}
              </span>
            )}
            {blog.tags && blog.tags.slice(0, 3).map((tag, index) => (
              <span key={typeof tag === 'string' ? tag : tag.id || index} className="inline-flex items-center px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/20 rounded-md text-xs font-medium">
                #{typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {blog.tags && blog.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-md text-xs font-medium">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer với stats và author */}
        <div className="mt-auto pt-3 border-t border-gray-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            {/* Stats section */}
            <div className="flex items-center space-x-3.5 text-xs text-gray-500 dark:text-slate-400">
              {/* Views */}
              <span className="flex items-center space-x-1" title="Lượt xem">
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-slate-500"
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
                <span className="font-medium">{blog.viewCount}</span>
              </span>

              {/* Likes */}
              <span className="flex items-center space-x-1" title="Lượt thích">
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
                <span className="font-medium">{blog.likeCount}</span>
              </span>

              {/* Comments */}
              <span className="flex items-center space-x-1" title="Bình luận">
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-slate-500"
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
                <span className="font-medium">{blog.commentCount}</span>
              </span>
            </div>

            <Link
              href={`/blogs/${blog.slug}`}
              onClick={handleReadMoreClick}
              className="inline-flex items-center px-3 py-1.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Đọc tiếp
              <svg
                className="w-3.5 h-3.5 ml-1"
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

          {/* Author */}
          <div className="mt-3.5 pt-3 border-t border-gray-200/80 dark:border-slate-700/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder"
                width={18}
                height={18}
                className="rounded-sm"
              />
              <span className="text-xs text-gray-500 dark:text-slate-400">
                Tác giả: <span className="font-semibold text-gray-700 dark:text-slate-300">JavaBuilder</span>
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
