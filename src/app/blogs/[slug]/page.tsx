"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/types/blog";
import { blogService } from "@/services/blog.service";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { useComments } from "@/hooks/useComments";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { authApi } from "@/services/auth.service";
import toast from "react-hot-toast";
import CommentList from "@/components/blogs/CommentList";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import BlogHeader from "@/components/blogs/BlogHeader";
import BlogContent from "@/components/blogs/BlogContent";
import BlogActions from "@/components/blogs/BlogActions";
import BlogSidebar from "@/components/blogs/BlogSidebar";

export default function BlogDetailPage() {
  const params = useParams();
  const blogSlug = params.slug as string;
  const { data: currentUser } = useCurrentUser();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const hasIncrementedViewRef = useRef(false);

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

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
  } = useComments(blog?.id || "");

  // Fetch blog data
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setIsLoading(true);
        setIsLoadingRelated(true);
        setError(null);

        const blogData = await blogService.getBlogBySlug(blogSlug);
        setBlog(blogData);
        setIsLoading(false);

        // Load related blogs separately to avoid blocking main content
        const relatedData = await blogService.getBlogs({
          page: 1,
          blogType: blogData.blogType,
        });

        const filtered = relatedData.data?.data
          ?.filter((b) => b.slug !== blogSlug)
          ?.slice(0, 3) || [];
        setRelatedBlogs(filtered);
        setIsLoadingRelated(false);
      } catch {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setIsLoading(false);
        setIsLoadingRelated(false);
      }
    };

    if (!blogSlug) return;

    const isAuthed = authApi.isAuthenticated();
    if (!isAuthed) {
      setIsLoading(false);
      setError(null);
      setBlog(null);
      setAuthModal({
        isOpen: true,
        title: "Đăng nhập để đọc bài viết",
        message: "Bạn cần đăng nhập để đọc bài viết này. Vui lòng đăng nhập để tiếp tục.",
      });
      return;
    }

    fetchBlogDetail();
  }, [blogSlug, currentUser]);

  // Increment view count
  useEffect(() => {
    const incrementView = async () => {
      if (!blogSlug || hasIncrementedViewRef.current) return;
      try {
        hasIncrementedViewRef.current = true;
        const newCount = await blogService.incrementView(blogSlug);
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
      }
    };
    incrementView();
  }, [blogSlug]);

  // Check favorite status
  useEffect(() => {
    if (!blog?.id) return;

    const checkFavorite = async () => {
      if (!authApi.isAuthenticated()) return;
      try {
        const result = await favoriteService.check(blog.id, FavoriteTargetType.BLOG);
        if (result && result.data !== undefined) {
          setIsFavorite(result.data);
        }
      } catch {
        // Silent fail
      }
    };
    checkFavorite();
  }, [blog?.id]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to hash
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

      const tryLoadRepliesForTarget = async () => {
        for (const root of comments) {
          if (isCancelled) return false;
          if (document.getElementById(targetId)) return true;
          const needLoad =
            (root.repliesCount || 0) > 0 &&
            (!root.replies || root.replies.length === 0);
          if (needLoad) {
            await loadReplies(root.id).catch(() => { });
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
        await loadMoreComments().catch(() => { });
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

  // Comment handlers
  const handleAddComment = async (content: string) => {
    try {
      await addComment(content);
      setBlog((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev,
      );
      toast.success("Đăng bình luận thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể đăng bình luận");
    }
  };

  const handleReplyComment = async (commentId: string, content: string) => {
    try {
      await replyToComment(commentId, content);
      setBlog((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev,
      );
      toast.success("Đăng câu trả lời phần bình luận thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể gửi trả lời");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setBlog((prev) => {
        if (!prev) return prev;
        const nextCount = prev.commentCount > 0 ? prev.commentCount - 1 : 0;
        return { ...prev, commentCount: nextCount };
      });
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

  // Share handlers
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

  const handleFavoriteToggle = (newFavoriteState: boolean) => {
    setIsFavorite(newFavoriteState);
    setFavoriteLoading(false);
  };

  const handleAuthRequired = () => {
    setAuthModal({
      isOpen: true,
      title: "Đăng nhập để yêu thích",
      message: "Bạn cần đăng nhập để thêm bài viết vào danh sách yêu thích.",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
            <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    if (authModal.isOpen) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
          <Header />
          <AuthRequiredModal
            isOpen={authModal.isOpen}
            onClose={() => setAuthModal({ ...authModal, isOpen: false })}
            title={authModal.title}
            message={authModal.message}
          />
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500 dark:text-red-400"
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Không tìm thấy bài viết
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10 sm:static">
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
              className="text-gray-500 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Trang chủ
            </Link>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
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
              className="text-gray-500 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Blog
            </Link>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
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
            <span className="text-gray-900 dark:text-white font-medium whitespace-nowrap flex-shrink-0 min-w-0">
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
            <article className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Featured Image */}
                {blog.thumbnailUrl && (
                  <div className="aspect-[16/9] w-full overflow-hidden relative bg-gray-100 rounded-lg">
                    <Image
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="p-3 sm:p-5 md:p-6 lg:p-8">
                  {/* Header with meta info */}
                  <BlogHeader
                    blog={blog}
                    isFavorite={isFavorite}
                    favoriteLoading={favoriteLoading}
                    onFavoriteToggle={handleFavoriteToggle}
                    onAuthRequired={handleAuthRequired}
                    isAuthenticated={!!currentUser}
                  />

                  {/* Content */}
                  <BlogContent blog={blog} />

                  {/* Actions */}
                  <BlogActions
                    createdAt={blog.createdAt}
                    onShareFacebook={() => shareTo("facebook")}
                    onShareLinkedIn={() => shareTo("linkedin")}
                  />
                </div>
              </article>

            {/* Comments */}
            <div className="mt-4 sm:mt-6 lg:mt-8 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-3 sm:p-5 md:p-6">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-2">
            <BlogSidebar 
              blog={blog} 
              relatedBlogs={relatedBlogs}
              isLoadingRelated={isLoadingRelated}
            />
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

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-accent hover:bg-accent-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <Footer />
    </div>
  );
}
