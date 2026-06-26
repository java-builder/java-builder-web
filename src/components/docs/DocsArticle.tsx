"use client";

import Link from "next/link";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import CommentList from "@/components/blogs/CommentList";
import { useComments } from "@/hooks/useComments";
import toast from "react-hot-toast";

interface DocsArticleProps {
  title: string;
  description: string;
  readTime: string;
  lastUpdated: string;
  content: string;
  breadcrumbs: { label: string; href?: string }[];
  lessonId?: string;
  canAccess?: boolean;
  isFreePreview?: boolean;
  courseSlug?: string;
}

export default function DocsArticle({
  title,
  description,
  readTime,
  lastUpdated,
  content,
  breadcrumbs,
  lessonId,
  canAccess = true,
  isFreePreview = false,
  courseSlug
}: DocsArticleProps) {
  const {
    comments,
    isLoading: isLoadingComments,
    isSubmitting: isSubmittingComment,
    hasMore: hasMoreComments,
    loadReplies,
    addComment,
    replyToComment,
    deleteComment,
    loadMoreComments,
  } = useComments(lessonId || "", "DOCS");

  const handleAddComment = async (content: string) => {
    if (!lessonId) return;
    try {
      await addComment(content);
      toast.success("Đăng bình luận thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể đăng bình luận");
    }
  };

  const handleReplyComment = async (commentId: string, content: string) => {
    if (!lessonId) return;
    try {
      await replyToComment(commentId, content);
      toast.success("Đăng câu trả lời thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể gửi trả lời");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!lessonId) return;
    try {
      await deleteComment(commentId);
      toast.success("Xóa bình luận thành công");
    } catch {
      toast.error("Không thể xóa bình luận");
    }
  };

  const handleLoadMoreComments = async () => {
    try {
      await loadMoreComments();
    } catch (err) {
      console.error("Error loading more comments:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
      {/* Desktop breadcrumb - full */}
      <nav className="hidden sm:flex flex-wrap items-center text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
        {breadcrumbs.map((crumb, index) => {
          const isFirst = index === 0;
          const isLast = index === breadcrumbs.length - 1;
          const isIntermediate = !isFirst && !isLast;

          return (
            <div key={index} className="flex items-center min-w-0">
              {isFirst && (
                <svg className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              
              {crumb.href ? (
                <Link 
                  href={crumb.href} 
                  title={crumb.label}
                  className={`hover:text-accent dark:hover:text-accent-400 transition-colors duration-150 flex-shrink-0 ${
                    isIntermediate ? "max-w-[120px] md:max-w-[180px] lg:max-w-[240px] truncate" : ""
                  }`}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span 
                  title={crumb.label}
                  className={`min-w-0 ${
                    isLast 
                      ? "text-slate-800 dark:text-slate-200 font-semibold truncate" 
                      : "text-slate-500 dark:text-slate-400"
                  } ${
                    isIntermediate ? "max-w-[120px] md:max-w-[180px] lg:max-w-[240px] truncate flex-shrink-0" : ""
                  }`}
                >
                  {crumb.label}
                </span>
              )}

              {!isLast && (
                <svg className="w-3 h-3 text-slate-300 dark:text-slate-600 mx-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          );
        })}
      </nav>

      {/* Mobile breadcrumb - simplified */}
      <nav className="flex sm:hidden items-center text-xs text-slate-500 dark:text-slate-400 mb-6 min-w-0 font-medium">
        {breadcrumbs.length > 0 && (
          <>
            <svg className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {breadcrumbs[0].href ? (
              <Link href={breadcrumbs[0].href} className="hover:text-accent dark:hover:text-accent-400 flex-shrink-0 transition-colors duration-150">
                {breadcrumbs[0].label}
              </Link>
            ) : (
              <span className="flex-shrink-0">{breadcrumbs[0].label}</span>
            )}
            {breadcrumbs.length > 1 && (
              <>
                <svg className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600 mx-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-400 flex-shrink-0">...</span>
                <svg className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600 mx-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-800 dark:text-slate-200 font-semibold truncate min-w-0" title={breadcrumbs[breadcrumbs.length - 1].label}>
                  {breadcrumbs[breadcrumbs.length - 1].label}
                </span>
              </>
            )}
          </>
        )}
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Cập nhật: {lastUpdated}
          </span>
        </div>
      </header>

      <PublicMarkdownRenderer
        content={content}
        className="prose prose-lg dark:prose-invert max-w-none"
      />

      {!isFreePreview && canAccess === false && (
        <div className="mt-8 relative">
          <div className="relative text-center py-12 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nội dung bị khóa
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Bài học này yêu cầu mua khóa học hoặc gói Premium để truy cập toàn bộ nội dung.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {courseSlug && (
                <Link
                  href={`/courses/${courseSlug}`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Mua khóa học
                </Link>
              )}
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Nâng cấp Premium
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
                <span>Tài liệu độc quyền</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {lessonId && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Bình luận
          </h2>
          <CommentList
            comments={comments}
            onAddComment={handleAddComment}
            onReplyComment={handleReplyComment}
            onDeleteComment={handleDeleteComment}
            onLoadReplies={loadReplies}
            onLoadMore={handleLoadMoreComments}
            isLoading={isLoadingComments}
            isSubmitting={isSubmittingComment}
            hasMore={hasMoreComments}
          />
        </div>
      )}
    </div>
  );
}
