 "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { postService } from "@/services/post.service";
import { useComments } from "@/hooks/useComments";
import CommentList from "@/components/blogs/CommentList";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { PostDetail } from "@/types/post";
import { formatLocaleString } from "@/utils/dateUtils";

export default function PostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { comments, isLoading: isLoadingComments, addComment, replyToComment, deleteComment, loadReplies, loadMoreComments, hasMore } =
    useComments(post?.id || "", "POST");

  useEffect(() => {
    const fetch = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await postService.getBySlug(slug);
        setPost(data);
      } catch (e) {
        console.error("Failed to load post by slug", e);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Bài viết này không tồn tại."}</p>
            <Link href="/qna" className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200">
              Quay lại danh sách
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
            {post.avatar ? (
              <Image
                src={post.avatar}
                alt={post.username ?? "avatar"}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-sm text-gray-600">U</div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white leading-tight">{post.title}</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {post.username} • {post.categoryName} • {formatLocaleString(post.createdAt) || 'N/A'}
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  <span>{post.viewCount ?? 0} lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  <span>{post.commentCount ?? 0} bình luận</span>
                </div>
              </div>
            </div>
          </div>

          {post.thumbnailUrl && (
            <div className="mb-8">
              <div className="aspect-[16/9] w-full overflow-hidden relative bg-gray-100 rounded-lg">
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="mb-10 w-full">
            <PublicMarkdownRenderer content={post.content} className="prose-sm sm:prose lg:prose-lg max-w-full break-words dark:prose-invert" />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mt-6">
            <CommentList
              comments={comments}
              onAddComment={async (c: string) => await addComment(c)}
              onReplyComment={async (id: string, content: string) => await replyToComment(id, content)}
              onDeleteComment={async (id: string) => await deleteComment(id)}
              onLoadReplies={loadReplies}
              onLoadMore={loadMoreComments}
              isLoading={isLoadingComments}
              isSubmitting={false}
              hasMore={hasMore}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

 