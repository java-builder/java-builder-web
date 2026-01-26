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
import { PostDetail } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { comments, isLoading: isLoadingComments, addComment, replyToComment, deleteComment, loadReplies, loadMoreComments, hasMore } =
    useComments(post?.id || "");

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{post.title}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">{post.categoryName} • {new Date(post.createdAt).toLocaleString()}</div>

          {post.thumbnail && (
            <div className="mb-6">
              <div className="aspect-[16/9] w-full overflow-hidden relative bg-gray-100 rounded-lg">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="prose max-w-none dark:prose-invert break-words mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
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

 