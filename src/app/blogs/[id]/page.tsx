"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import { blogService } from "@/services/blog.service";
import { useComments } from "@/hooks/useComments";
import { formatApiDate, formatApiDateOnly } from "@/utils/dateUtils";
import BlogTypeIcon from "@/components/admin/blogs/BlogTypeIcon";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { authApi } from "@/services/auth.service";
import toast from "react-hot-toast";
import MotionWrapper from "@/components/MotionWrapper";
import CommentList from "@/components/blogs/CommentList";

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const hasIncrementedViewRef = useRef(false);

  const {
    comments,
    isLoading: isLoadingComments,
    isSubmitting: isSubmittingComment,
    hasMore: hasMoreComments,
    loadRootComments,
    loadReplies,
    addComment,
    replyToComment,
    deleteComment,
    loadMoreComments,
  } = useComments(blogId);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const blogData = await blogService.getBlogById(blogId);
        setBlog(blogData);

        const relatedData = await blogService.getBlogs({
          page: 1,
          blogType: blogData.blogType,
        });

        const filtered = relatedData.result
          .filter((b) => b.id !== blogId)
          .slice(0, 3);
        setRelatedBlogs(filtered);

        await loadRootComments(1, false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) {
      fetchBlogDetail();
    }
  }, [blogId, loadRootComments]);

  // Increment view once when page loads
  useEffect(() => {
    const incrementView = async () => {
      if (!blogId || hasIncrementedViewRef.current) return;
      try {
        hasIncrementedViewRef.current = true;
        const newCount = await blogService.incrementView(blogId);
        setBlog((prev) =>
          prev
            ? {
                ...prev,
                viewCount:
                  typeof newCount === "number" ? newCount : prev.viewCount + 1,
              }
            : prev,
        );
      } catch {
        // fail silently; do not block UX
      }
    };
    incrementView();
  }, [blogId]);

  useEffect(() => {
    let isCancelled = false;
    let isLoadingSequence = false;

    const tryScrollToHash = async () => {
      if (typeof window === "undefined" || isCancelled || isLoadingSequence)
        return;
      const hash = window.location.hash;
      if (!hash) return;
      const targetId = hash.slice(1);

      const scrollToEl = (el: HTMLElement) => {
        setTimeout(() => {
          if (!isCancelled) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 0);
      };

      let el = document.getElementById(targetId);
      if (el) {
        scrollToEl(el);
        return;
      }

      // Try loading replies for current roots to reveal a target reply
      const tryLoadRepliesForTarget = async () => {
        for (const root of comments) {
          if (isCancelled) return false;
          if (document.getElementById(targetId)) return true;
          const needLoad =
            (root.repliesCount || 0) > 0 &&
            (!root.replies || root.replies.length === 0);
          if (needLoad) {
            await loadReplies(root.id).catch(() => {});
            await new Promise((resolve) => setTimeout(resolve, 0));
            if (document.getElementById(targetId)) return true;
          }
        }
        return !!document.getElementById(targetId);
      };

      if (await tryLoadRepliesForTarget()) {
        const found = document.getElementById(targetId);
        if (found) {
          scrollToEl(found as HTMLElement);
          return;
        }
      }

      isLoadingSequence = true;
      const MAX_TRIES = 10;
      for (let i = 0; i < MAX_TRIES && !isCancelled; i++) {
        await loadMoreComments().catch(() => {});
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (await tryLoadRepliesForTarget()) {
          el = document.getElementById(targetId);
          if (el) {
            scrollToEl(el as HTMLElement);
            break;
          }
        }
      }
      isLoadingSequence = false;
    };

    tryScrollToHash();
    window.addEventListener("hashchange", tryScrollToHash);
    return () => {
      isCancelled = true;
      window.removeEventListener("hashchange", tryScrollToHash);
    };
  }, [comments, loadMoreComments, loadReplies]);

  useEffect(() => {
    if (!blogId) return;
    try {
      const liked = localStorage.getItem(`liked_blog_${blogId}`);
      setIsLiked(liked === "1");
    } catch {}
  }, [blogId]);

  const handleAddComment = async (content: string) => {
    try {
      await addComment(content);
      setBlog((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev,
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleReplyComment = async (commentId: string, content: string) => {
    try {
      await replyToComment(commentId, content);
      // Optimistically update local comment count on successful reply
      setBlog((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev,
      );
    } catch (err) {
      console.error("Error replying to comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log("Attempting to delete comment:", commentId);
    try {
      await deleteComment(commentId);
      console.log("Comment deleted successfully:", commentId);
      // Optimistically decrease local comment count after deletion
      setBlog((prev) => {
        if (!prev) return prev;
        const nextCount = prev.commentCount > 0 ? prev.commentCount - 1 : 0;
        return { ...prev, commentCount: nextCount };
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleLoadMoreComments = async () => {
    try {
      await loadMoreComments();
    } catch (err) {
      console.error("Error loading more comments:", err);
    }
  };

  const shareTo = (network: "facebook" | "linkedin") => {
    try {
      const currentUrl =
        typeof window !== "undefined" ? window.location.href : "";
      const encodedUrl = encodeURIComponent(currentUrl);
      let shareUrl = "";

      if (network === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      } else if (network === "linkedin") {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="aspect-video bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Không tìm thấy bài viết
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "Bài viết này không tồn tại hoặc đã bị xóa."}
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại danh sách bài viết
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 sm:static">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <style jsx>{`
            .breadcrumb-nav::-webkit-scrollbar {
              display: none;
            }
            .breadcrumb-nav {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          `}</style>
          <nav className="breadcrumb-nav flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <Link
              href="/"
              className="text-gray-500 hover:text-accent-500 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Trang chủ
            </Link>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              href="/blogs"
              className="text-gray-500 hover:text-accent-500 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Blog
            </Link>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900 font-medium whitespace-nowrap flex-shrink-0 min-w-0">
              <span className="block truncate max-w-[200px] sm:max-w-none">
                {blog.title}
              </span>
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 order-1">
            <MotionWrapper animation="fadeInUp" duration={0.6} mode="mount">
              <article className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Featured Image */}
                {blog.featuredImage && (
                  <div className="aspect-[16/10] sm:aspect-[4/2] w-full overflow-hidden relative bg-gray-100">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                      className="object-scale-down"
                      priority
                    />
                  </div>
                )}

                <div className="p-3 sm:p-5 md:p-6 lg:p-8">
                  {/* Header */}
                  <div className="mb-3 sm:mb-4 md:mb-5">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <div className="p-1 sm:p-1.5 bg-blue-100 rounded-md">
                        <BlogTypeIcon
                          blogType={blog.blogType}
                          className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-blue-700">
                        {BlogTypeDisplayNames[blog.blogType]}
                      </span>
                    </div>

                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                      {blog.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-600 mb-3 sm:mb-4">
                      {blog.author && (
                        <div className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="truncate max-w-[100px] sm:max-w-none">
                            {blog.author}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <time
                          dateTime={blog.createdAt}
                          className="whitespace-nowrap text-[10px] sm:text-xs"
                        >
                          {formatApiDate(blog.createdAt)}
                        </time>
                      </div>
                      <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100 text-xs">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
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
                        <span className="font-semibold text-emerald-900">
                          {blog.viewCount}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
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
                      </div>
                      <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100 text-xs">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
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
                        <span className="font-semibold">
                          {blog.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {blog.summary && (
                    <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <h3 className="font-medium text-blue-900 mb-2 text-xs sm:text-sm">
                        Tóm tắt
                      </h3>
                      <PublicMarkdownRenderer
                        content={blog.summary}
                        className="text-blue-800 text-xs sm:text-sm leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="max-w-none prose prose-sm sm:prose lg:prose-lg">
                    <PublicMarkdownRenderer content={blog.content} />
                  </div>

                  {/* Tags & Actions */}
                  <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                        <button
                          onClick={async () => {
                            const isAuthed = authApi.isAuthenticated();
                            if (!isAuthed) {
                              setShowLoginModal(true);
                              return;
                            }
                            if (isLiked) {
                              toast("Bạn đã thích bài viết này", {
                                icon: "❤️",
                              });
                              return;
                            }
                            try {
                              const newCount =
                                await blogService.incrementLike(blogId);
                              setBlog((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      likeCount:
                                        typeof newCount === "number"
                                          ? newCount
                                          : prev.likeCount + 1,
                                    }
                                  : prev,
                              );
                              setIsLiked(true);
                              try {
                                localStorage.setItem(
                                  `liked_blog_${blogId}`,
                                  "1",
                                );
                              } catch {}
                            } catch (err) {
                              console.error("Error incrementing like:", err);
                            }
                          }}
                          className={`relative flex items-center justify-center space-x-1.5 px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm font-medium ${isLiked ? "bg-red-600 text-white hover:bg-red-700 shadow-sm" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                        >
                          {isLiked && (
                            <span className="absolute -left-1 -top-1 inline-flex h-3 w-3 rounded-full bg-red-300 opacity-75 animate-ping"></span>
                          )}
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill={isLiked ? "currentColor" : "none"}
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
                          <span>
                            {isLiked ? "Bỏ thích" : "Thích"} ({blog.likeCount})
                          </span>
                        </button>
                        
                        {/* Share Buttons */}
                        <div className="flex gap-2 sm:gap-3">
                          <button
                            onClick={() => shareTo("facebook")}
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 sm:py-2.5 bg-[#1877F2]/10 text-[#1877F2] rounded-lg hover:bg-[#1877F2]/20 transition-colors text-sm font-medium"
                            aria-label="Chia sẻ Facebook"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.314h3.59l-.467 3.622h-3.123V24h6.127C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z" />
                            </svg>
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => shareTo("linkedin")}
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 sm:py-2.5 bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/20 transition-colors text-sm font-medium"
                            aria-label="Chia sẻ LinkedIn"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M20.451 20.451h-3.554v-5.569c0-1.328-.025-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.355V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.37-1.852 3.604 0 4.269 2.372 4.269 5.455v6.287zM5.337 7.433a2.063 2.063 0 11.001-4.126 2.063 2.063 0 01-.001 4.126zM7.114 20.451H3.56V9h3.554v11.451zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.555C0 23.228.792 24 1.771 24h20.451C23.2 24 24 23.228 24 22.277V1.723C24 .771 23.2 0 22.222 0z" />
                            </svg>
                            <span>LinkedIn</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Update Date */}
                      <div className="text-xs sm:text-sm text-gray-500 pt-2 border-t border-gray-100">
                        Cập nhật: {formatApiDateOnly(blog.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </MotionWrapper>

            <MotionWrapper
              animation="fadeInUp"
              duration={0.6}
              delay={0.3}
              mode="mount"
            >
              <div className="mt-4 sm:mt-6 lg:mt-8 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-6">
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
            </MotionWrapper>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-2">
            <MotionWrapper
              animation="fadeInRight"
              duration={0.8}
              delay={0.2}
              mode="mount"
            >
              <div className="space-y-3 sm:space-y-4">
                {/* Author Info */}
                {blog.author && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                      Về tác giả
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {blog.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900">
                          {blog.author}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          Tác giả bài viết
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                      Bài viết liên quan
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {relatedBlogs.map((relatedBlog) => (
                        <Link
                          key={relatedBlog.id}
                          href={`/blogs/${relatedBlog.id}`}
                          className="block group"
                        >
                          <div className="flex space-x-2">
                            {relatedBlog.featuredImage && (
                              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden">
                                <Image
                                  src={relatedBlog.featuredImage}
                                  alt={relatedBlog.title}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-accent-500 transition-colors line-clamp-2 leading-tight">
                                {relatedBlog.title}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                                {formatApiDateOnly(relatedBlog.createdAt)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <Link
                        href="/blogs"
                        className="text-xs sm:text-sm text-accent-500 hover:text-accent-600 font-medium"
                      >
                        Xem tất cả →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                    Hành động nhanh
                  </h3>
                  <div className="space-y-1 sm:space-y-2">
                    <Link
                      href="/blogs"
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
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
                      <span className="text-xs sm:text-sm text-gray-700">
                        Tất cả bài viết
                      </span>
                    </Link>
                    <Link
                      href={`/blogs?blogType=${blog.blogType}`}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <BlogTypeIcon
                        blogType={blog.blogType}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        {BlogTypeDisplayNames[blog.blogType]}
                      </span>
                    </Link>
                    <Link
                      href="/courses"
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
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
                      <span className="text-xs sm:text-sm text-gray-700">Khóa học</span>
                    </Link>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowLoginModal(false)}
          ></div>
          <div className="relative w-full max-w-sm rounded-xl sm:rounded-2xl bg-white shadow-xl border border-gray-100 p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Cần đăng nhập
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Vui lòng đăng nhập để thích bài viết này.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Để sau
              </button>
              <Link
                href="/login"
                className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent-600 transition-colors text-center"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
