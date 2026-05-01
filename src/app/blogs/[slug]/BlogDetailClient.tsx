"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useComments } from "@/hooks/useComments";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { useBlogFavorite } from "@/hooks/useBlogFavorite";
import { useBlogComments } from "@/hooks/useBlogComments";
import { useBackToTop } from "@/hooks/useBackToTop";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authApi } from "@/services/auth.service";
import { commentApi } from "@/services/comment.service";
import CommentList from "@/components/blogs/CommentList";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import BlogHeader from "@/components/blogs/BlogHeader";
import BlogContent from "@/components/blogs/BlogContent";
import BlogActions from "@/components/blogs/BlogActions";
import BlogSidebar from "@/components/blogs/BlogSidebar";

export default function BlogDetailPage() {
  const params = useParams();
  const blogSlug = params.slug as string;
  const { data: currentUser } = useCurrentUser();

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const { blog, setBlog, relatedBlogs, isLoading, isLoadingRelated, error } = useBlogDetail(blogSlug);
  const { isFavorite, favoriteLoading, handleFavoriteToggle } = useBlogFavorite(blog?.id);
  const { showBackToTop, scrollToTop } = useBackToTop();

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

  const { handleAddComment, handleReplyComment, handleDeleteComment } = useBlogComments(
    addComment,
    replyToComment,
    deleteComment,
    setBlog
  );

  useScrollToHash(
    isLoadingComments, 
    comments, 
    loadReplies, 
    loadMoreComments, 
    hasMoreComments,
    commentApi.getById
  );

  const shareTo = (network: "facebook" | "linkedin") => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const encodedUrl = encodeURIComponent(currentUrl);
    const shareUrl = network === "facebook"
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      : `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
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

  if (!authApi.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <AuthRequiredModal
          isOpen={true}
          onClose={() => {}}
          title="Đăng nhập để đọc bài viết"
          message="Bạn cần đăng nhập để đọc bài viết này. Vui lòng đăng nhập để tiếp tục."
        />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Bài viết này không tồn tại hoặc đã bị xóa."}</p>
            <Link href="/blogs" className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10 sm:static">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
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
        <style jsx global>{`
          @keyframes highlight-pulse {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(59, 130, 246, 0.1); }
          }
          
          .highlight-comment {
            animation: highlight-pulse 2s ease-in-out;
          }
        `}</style>
        
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
            <div id="comments-section" className="mt-4 sm:mt-6 lg:mt-8 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-3 sm:p-5 md:p-6">
                <CommentList
                  comments={comments}
                  onAddComment={handleAddComment}
                  onReplyComment={handleReplyComment}
                  onDeleteComment={handleDeleteComment}
                  onLoadReplies={loadReplies}
                  onLoadMore={loadMoreComments}
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

    </div>
  );
}
