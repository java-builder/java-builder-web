 "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, MessageSquare, Tag } from "lucide-react";
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Bài viết này không tồn tại."}</p>
            <Link href="/qna" className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
        <div className="max-w-4xl w-full mx-auto">
          {/* Post Header Section */}
          <div className="mb-8 space-y-4">
            {/* Title H1 */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            {/* Author & Metadata Bar */}
            <div className="flex items-center gap-3 border-y border-gray-200/80 dark:border-slate-700/80 py-3.5">
              {post.author?.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.username ?? "avatar"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-800"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm ring-2 ring-gray-100 dark:ring-slate-800">
                  {post.author?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  {post.author?.username || "JavaBuilder User"}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
                  <span>{formatLocaleString(post.createdAt) || "N/A"}</span>
                  {post.category?.name && (
                    <>
                      <span className="text-gray-300 dark:text-slate-600">•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-accent dark:text-accent-400">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{post.category.name}</span>
                      </span>
                    </>
                  )}
                  <span className="text-gray-300 dark:text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    <span>{post.viewCount ?? 0} lượt xem</span>
                  </span>
                  <span className="text-gray-300 dark:text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    <span>{post.commentCount ?? 0} bình luận</span>
                  </span>
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
    </div>
  );
}

 