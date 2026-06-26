"use client";

import Link from "next/link";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import CommentList from "@/components/blogs/CommentList";
import { useComments } from "@/hooks/useComments";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
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
          <div className="relative text-center py-10 px-6 sm:px-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 dark:bg-accent/20 rounded-2xl text-accent mb-4 border border-accent/20 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Nội dung này đã được khóa
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                Bài học này thuộc chương trình đào tạo chuyên sâu. Vui lòng đăng ký mua khóa học để mở khóa toàn bộ nội dung lý thuyết, bài tập thực hành, mã nguồn dự án mẫu và nhận sự hỗ trợ 1-1 từ giảng viên.
              </p>
              <div className="flex justify-center items-center">
                {courseSlug && (
                  <Link
                    href={`/courses/${courseSlug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Mua khóa học để truy cập
                  </Link>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sở hữu trọn đời</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Hỗ trợ học tập 24/7</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mã nguồn & Tài liệu đi kèm</span>
                </div>
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
