"use client";

import Link from "next/link";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import CommentList from "@/components/blogs/CommentList";
import { useComments } from "@/hooks/useComments";
import toast from "react-hot-toast";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import LessonNotes from "@/components/learn/LessonNotes";
import DocsAiAssistant from "@/components/docs/DocsAiAssistant";
import {
  Check,
  X,
  FileText,
  Bot,
  Lock,
  Crown,
  ShoppingCart,
  UserPlus,
  Sparkles,
  Clock,
  Calendar,
  ChevronRight,
} from "lucide-react";

const READ_TIME_THRESHOLD_MS = 90 * 1000;

interface AdjacentLesson {
  id: string;
  title: string;
  chapterTitle?: string;
}

interface DocsArticleProps {
  title: string;
  description: string;
  readTime: string;
  lastUpdated: string;
  content: string;
  breadcrumbs: { label: string; href?: string; onClick?: () => void }[];
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
  prevLesson?: AdjacentLesson | null;
  nextLesson?: AdjacentLesson | null;
  onNavigateLesson?: (lessonId: string) => void;
  drawerState?: { isOpen: boolean; tab: "notes" | "ai" };
  onOpenDrawer?: (tab: "notes" | "ai") => void;
  onCloseDrawer?: () => void;
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
  courseSlug,
  completed = false,
  onToggleComplete,
  onAutoComplete,
  coursePrice,
  onEnrollClick,
  isEnrollingFree = false,
  drawerState,
  onOpenDrawer,
  onCloseDrawer,
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

  const [internalOpen, setInternalOpen] = useState(false);
  const [internalTab, setInternalTab] = useState<"notes" | "ai">("notes");

  const isNotesOpen = drawerState ? drawerState.isOpen : internalOpen;
  const activeTab = drawerState ? drawerState.tab : internalTab;

  const openDrawer = (tab: "notes" | "ai") => {
    if (onOpenDrawer) {
      onOpenDrawer(tab);
    } else {
      setInternalTab(tab);
      setInternalOpen(true);
    }
  };

  const closeDrawer = () => {
    if (onCloseDrawer) {
      onCloseDrawer();
    } else {
      setInternalOpen(false);
    }
  };

  // Strip duplicate leading H1 markdown heading if present
  const cleanedContent = useMemo(() => {
    if (!content) return "";
    return content.replace(/^\s*#\s+[^\n]+\n*/, "").trim();
  }, [content]);

  const completionRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const hasAutoCompletedRef = useRef<boolean>(false);
  const isAtBottomRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tryTriggerAutoComplete = useCallback(() => {
    if (
      completed ||
      hasAutoCompletedRef.current ||
      !onAutoComplete ||
      canAccess === false
    )
      return;

    const timeSpent = Date.now() - startTimeRef.current;
    if (timeSpent >= READ_TIME_THRESHOLD_MS && isAtBottomRef.current) {
      hasAutoCompletedRef.current = true;
      onAutoComplete();
    }
  }, [completed, onAutoComplete, canAccess]);

  useEffect(() => {
    if (!lessonId || completed || canAccess === false) return;

    startTimeRef.current = Date.now();
    hasAutoCompletedRef.current = false;
    isAtBottomRef.current = false;

    const remainingTime = READ_TIME_THRESHOLD_MS;
    timerRef.current = setTimeout(() => {
      tryTriggerAutoComplete();
    }, remainingTime + 100);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          isAtBottomRef.current = true;
          tryTriggerAutoComplete();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = completionRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [lessonId, completed, canAccess, tryTriggerAutoComplete]);

  const handleAddComment = async (commentContent: string) => {
    if (!lessonId) return;
    try {
      await addComment(commentContent);
      toast.success("Đăng bình luận thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể đăng bình luận");
    }
  };

  const handleReplyComment = async (
    commentId: string,
    replyContent: string
  ) => {
    if (!lessonId) return;
    try {
      await replyToComment(commentId, replyContent);
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
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
      {/* Breadcrumb bar */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-text-muted mb-5">
          {breadcrumbs.map((bc, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={idx} className="inline-flex items-center gap-1.5 min-w-0">
                {bc.onClick ? (
                  <button
                    type="button"
                    onClick={bc.onClick}
                    className="hover:text-primary transition-colors truncate max-w-[200px] cursor-pointer"
                  >
                    {bc.label}
                  </button>
                ) : bc.href ? (
                  <Link
                    href={bc.href}
                    className="hover:text-primary transition-colors truncate max-w-[200px]"
                  >
                    {bc.label}
                  </Link>
                ) : (
                  <span
                    className={`truncate max-w-[260px] ${
                      isLast ? "text-foreground font-semibold" : ""
                    }`}
                  >
                    {bc.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-border shrink-0" />}
              </span>
            );
          })}
        </nav>
      )}

      {/* Article Header */}
      <header className="mb-8 pb-6 border-b border-border">
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-foreground tracking-tight leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-text-muted mt-3 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted mt-4">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {readTime}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Cập nhật: {lastUpdated}
          </span>
        </div>
      </header>

      {/* Free Preview Banner */}
      {isFreePreview && canAccess === false && (
        <div className="mb-8 rounded-2xl border border-warning/30 bg-warning/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-warning border border-warning/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xem trước miễn phí</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground">
              Bạn đang xem bài học thử. Đăng ký khóa học hoặc gói Premium để mở
              khóa toàn bộ nội dung.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {coursePrice && coursePrice > 0 ? (
              <button
                type="button"
                onClick={onEnrollClick}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm active:scale-95 transition cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Mua ngay ({coursePrice.toLocaleString("vi-VN")} đ)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onEnrollClick}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm active:scale-95 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tham gia miễn phí</span>
              </button>
            )}
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground transition"
            >
              <Crown className="w-3.5 h-3.5 text-warning" />
              <span>Gói Premium</span>
            </Link>
          </div>
        </div>
      )}

      {/* Markdown Content */}
      <PublicMarkdownRenderer
        content={cleanedContent}
        className="prose prose-slate dark:prose-invert max-w-none"
      />

      {/* Lesson Completion Card */}
      {lessonId && canAccess !== false && (
        <div
          ref={completionRef}
          className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-background border border-border rounded-2xl"
        >
          <div className="text-left min-w-0">
            <h4 className="text-sm font-bold text-foreground">
              {completed
                ? "Bạn đã hoàn thành bài học này"
                : "Đánh dấu hoàn thành bài học?"}
            </h4>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              {completed
                ? "Bài học đã được ghi nhận vào tiến độ học tập của bạn."
                : "Lưu tiến độ để dễ dàng theo dõi các bài đã học trong chương trình."}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleComplete}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-200 cursor-pointer shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${
              completed
                ? "bg-success-soft text-success border-success/30 hover:bg-success/15 focus-visible:ring-success/30"
                : "bg-primary hover:bg-primary/90 text-white border-primary shadow-sm focus-visible:ring-primary/30"
            }`}
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            <span>{completed ? "Đã hoàn thành" : "Hoàn thành bài học"}</span>
          </button>
        </div>
      )}

      {/* Locked Lesson Prompt */}
      {!isFreePreview && canAccess === false && (
        <div className="mt-8">
          <div className="text-center py-10 px-6 sm:px-8 bg-background rounded-2xl border border-border shadow-sm max-w-2xl mx-auto">
            {!coursePrice || coursePrice === 0 ? (
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-success/10 rounded-full text-success mb-4 border border-success/25">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Tham gia khóa học miễn phí
                </h3>
                <p className="text-text-muted mb-6 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
                  Khóa học này hoàn toàn miễn phí. Đăng ký tham gia ngay để mở
                  khóa toàn bộ nội dung lý thuyết, bài tập thực hành và mã nguồn
                  mẫu.
                </p>
                <button
                  type="button"
                  onClick={onEnrollClick}
                  disabled={isEnrollingFree}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold rounded-full transition-all shadow-sm text-sm cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {isEnrollingFree ? "Đang đăng ký..." : "Tham gia miễn phí"}
                  </span>
                </button>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-soft rounded-full text-primary mb-4 border border-primary/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Nội dung bài học đang được khóa
                </h3>
                <p className="text-text-muted mb-6 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
                  Bạn có thể{" "}
                  <strong className="font-semibold text-foreground">
                    mua lẻ khóa học để sở hữu vĩnh viễn
                  </strong>{" "}
                  hoặc{" "}
                  <strong className="font-semibold text-primary">
                    nâng cấp gói Premium
                  </strong>{" "}
                  để mở khóa toàn bộ khóa học & câu hỏi phỏng vấn.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                  {onEnrollClick ? (
                    <button
                      type="button"
                      onClick={onEnrollClick}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold rounded-full transition-all shadow-sm text-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        Mua ngay{" "}
                        {coursePrice
                          ? `(${coursePrice.toLocaleString("vi-VN")} đ)`
                          : ""}
                      </span>
                    </button>
                  ) : courseSlug ? (
                    <Link
                      href={`/courses/${courseSlug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold rounded-full transition-all shadow-sm text-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        Mua ngay{" "}
                        {coursePrice
                          ? `(${coursePrice.toLocaleString("vi-VN")} đ)`
                          : ""}
                      </span>
                    </Link>
                  ) : null}
                  <Link
                    href="/pricing"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-warning/10 border border-warning/30 text-warning font-semibold rounded-full transition-all text-sm"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Đăng ký gói Premium</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments Section */}
      {lessonId && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-6">
            Bình luận & Thảo luận
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

      {/* Slide-over Notes & AI Drawer */}
      {lessonId && canAccess !== false && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
              isNotesOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={closeDrawer}
          />

          <div
            className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[560px] lg:w-[640px] max-w-[92vw] bg-surface shadow-2xl border-l border-border flex flex-col transition-transform duration-300 ease-out transform ${
              isNotesOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-6 border-b border-border bg-background/60">
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => openDrawer("notes")}
                  className={`py-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "notes"
                      ? "border-primary text-primary"
                      : "border-transparent text-text-muted hover:text-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Ghi chú
                </button>
                <button
                  type="button"
                  onClick={() => openDrawer("ai")}
                  className={`py-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "ai"
                      ? "border-primary text-primary"
                      : "border-transparent text-text-muted hover:text-foreground"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Hỏi đáp AI
                </button>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1.5 text-text-muted hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`flex-1 flex flex-col min-h-0 ${
                activeTab === "notes"
                  ? "overflow-y-auto px-6 pb-6"
                  : "px-0 pb-0"
              }`}
            >
              {isNotesOpen &&
                (activeTab === "notes" ? (
                  <LessonNotes lessonId={lessonId} showTimestamp={false} />
                ) : (
                  <DocsAiAssistant
                    lessonId={lessonId}
                    lessonName={title}
                    lessonDescription={description}
                    isInline={true}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
