"use client";

import Link from "next/link";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import CommentList from "@/components/blogs/CommentList";
import { useComments } from "@/hooks/useComments";
import toast from "react-hot-toast";
import { useState, useRef, useEffect, useCallback } from "react";
import LessonNotes from "@/components/learn/LessonNotes";
import DocsAiAssistant from "@/components/docs/DocsAiAssistant";
import { Check, X, FileText, Bot } from "lucide-react";

const READ_TIME_THRESHOLD_MS = 90 * 1000; // 1 minute 30 seconds (90,000 ms)

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
  completed?: boolean;
  onToggleComplete?: () => void;
  onAutoComplete?: () => void;
  coursePrice?: number;
  onEnrollClick?: () => void;
  isEnrollingFree?: boolean;
}

export default function DocsArticle({
  title,
  description,
  readTime,
  lastUpdated,
  content,
  lessonId,
  canAccess = true,
  isFreePreview = false,
  courseSlug,
  completed = false,
  onToggleComplete,
  onAutoComplete,
  coursePrice,
  onEnrollClick,
  isEnrollingFree = false,
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

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "ai">("notes");

  const completionRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const hasAutoCompletedRef = useRef<boolean>(false);
  const isAtBottomRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tryTriggerAutoComplete = useCallback(() => {
    if (completed || hasAutoCompletedRef.current || !lessonId || canAccess === false) {
      return;
    }

    const elapsedTime = Date.now() - startTimeRef.current;
    if (elapsedTime >= READ_TIME_THRESHOLD_MS && isAtBottomRef.current) {
      hasAutoCompletedRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (onAutoComplete) {
        onAutoComplete();
      } else if (onToggleComplete) {
        onToggleComplete();
      }
    } else if (isAtBottomRef.current && elapsedTime < READ_TIME_THRESHOLD_MS) {
      const remainingTime = READ_TIME_THRESHOLD_MS - elapsedTime;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        tryTriggerAutoComplete();
      }, remainingTime + 100);
    }
  }, [completed, lessonId, canAccess, onAutoComplete, onToggleComplete]);

  useEffect(() => {
    if (!lessonId || completed || canAccess === false) return;

    startTimeRef.current = Date.now();
    hasAutoCompletedRef.current = false;
    isAtBottomRef.current = false;

    const twoMinTimer = setTimeout(() => {
      tryTriggerAutoComplete();
    }, READ_TIME_THRESHOLD_MS + 100);

    const checkScrollBottom = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const bodyHeight = document.documentElement.scrollHeight;
      return windowHeight + scrollY >= bodyHeight - 200;
    };

    const handleScroll = () => {
      const atBottom = checkScrollBottom();
      if (atBottom !== isAtBottomRef.current) {
        isAtBottomRef.current = atBottom;
        if (atBottom) {
          tryTriggerAutoComplete();
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let observer: IntersectionObserver | null = null;
    const currentRef = completionRef.current;
    if (currentRef) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            isAtBottomRef.current = true;
            tryTriggerAutoComplete();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(twoMinTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", handleScroll);
      if (observer && currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [lessonId, completed, canAccess, tryTriggerAutoComplete]);

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

      {/* Lesson Completion Action Button */}
      {lessonId && canAccess !== false && (
        <div
          ref={completionRef}
          className="mt-8 flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-gray-50/50 to-white dark:from-slate-900/30 dark:to-slate-800/10 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl animate-in fade-in duration-300"
        >
          <div className="text-left min-w-0 pr-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {completed ? "Bạn đã hoàn thành bài học này" : "Hoàn thành bài học?"}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {completed 
                ? "Bài học này đã được ghi nhận trong tiến độ học tập của bạn." 
                : "Đánh dấu bài học này để lưu tiến độ và hiển thị dấu hoàn thành ở danh mục."}
            </p>
          </div>
          <button
            onClick={onToggleComplete}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 cursor-pointer flex-shrink-0 group ${
              completed
                ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30"
                : "bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-350 border-gray-200 dark:border-slate-700 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-xs hover:shadow-sm"
            }`}
          >
            {completed ? (
              <Check className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Check className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" strokeWidth={2} />
            )}
            <span>{completed ? "Đã hoàn thành" : "Hoàn thành bài học"}</span>
          </button>
        </div>
      )}

      {!isFreePreview && canAccess === false && (
        <div className="mt-8 relative">
          <div className="relative text-center py-10 px-6 sm:px-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            {!coursePrice || coursePrice === 0 ? (
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-500/20 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Tham gia khóa học miễn phí
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                  Khóa học này hoàn toàn miễn phí. Vui lòng đăng ký tham gia khóa học để mở khóa toàn bộ nội dung lý thuyết, bài tập thực hành, mã nguồn dự án mẫu và nhận sự hỗ trợ 1-1 từ giảng viên.
                </p>
                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={onEnrollClick}
                    disabled={isEnrollingFree}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer disabled:opacity-50"
                  >
                    {isEnrollingFree ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    )}
                    <span>{isEnrollingFree ? "Đang đăng ký..." : "Tham gia miễn phí"}</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Miễn phí 100%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hỗ trợ học tập 24/7</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mã nguồn & Tài liệu đi kèm</span>
                  </div>
                </div>
              </div>
            ) : (
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
                  {onEnrollClick ? (
                    <button
                      type="button"
                      onClick={onEnrollClick}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Mua khóa học để truy cập
                    </button>
                  ) : courseSlug ? (
                    <Link
                      href={`/courses/${courseSlug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Mua khóa học để truy cập
                    </Link>
                  ) : null}
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
            )}
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

      {/* Floating Action Button for Notes */}
      {lessonId && canAccess !== false && (
        <button
          onClick={() => setIsNotesOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
          title="Ghi chú cá nhân"
        >
          <FileText className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 dark:bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
          </span>
        </button>
      )}

      {/* Slide-over Notes Drawer */}
      {lessonId && canAccess !== false && (
        <>
          {/* Backdrop overlay */}
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
              isNotesOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsNotesOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[600px] lg:w-[680px] xl:w-[750px] max-w-[92vw] bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-150 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-out transform ${
              isNotesOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Drawer Header with Tabs */}
            <div className="flex items-center justify-between px-6 border-b border-gray-150 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/20">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "notes"
                      ? "border-accent text-accent dark:text-sky-400"
                      : "border-transparent text-gray-450 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Ghi chú
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "ai"
                      ? "border-accent text-accent dark:text-sky-400"
                      : "border-transparent text-gray-450 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Hỏi đáp AI
                </button>
              </div>
              <button
                onClick={() => setIsNotesOpen(false)}
                className="p-1.5 text-gray-450 hover:text-gray-750 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className={`flex-1 flex flex-col min-h-0 ${activeTab === "notes" ? "overflow-y-auto px-6 pb-6" : "px-0 pb-0"}`}>
              {isNotesOpen && (activeTab === "notes" ? (
                <LessonNotes lessonId={lessonId} showTimestamp={false} />
              ) : (
                <DocsAiAssistant lessonId={lessonId} lessonName={title} lessonDescription={description} isInline={true} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
