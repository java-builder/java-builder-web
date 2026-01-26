 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/axios";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { PostDetail } from "@/types/post";

interface PostListProps {
  posts?: PostDetail[];
  searchQuery?: string;
  sortBy?: string;
  filterTag?: string;
}

export default function PostList({
  posts,
  searchQuery = "",
  sortBy = "newest",
  filterTag = "all",
}: PostListProps) {
  const [fetchedPosts, setFetchedPosts] = useState<PostDetail[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (posts) return;

    (async () => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = { page: 1, size: 50 };
        if (searchQuery) params.search = searchQuery;
        if (filterTag && filterTag !== "all") params.categoryName = filterTag;

        const resp = await apiClient.get("/api/v1/posts", { params });
        const page = resp.data?.data;
        const items: PostDetail[] = Array.isArray(page?.data) ? page.data : [];
        if (mounted) setFetchedPosts(items);
      } catch (e) {
        console.error("Failed to load posts for Q&A", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [posts, searchQuery, filterTag]);

  const displayPosts = posts ?? fetchedPosts ?? [];

  let filtered = displayPosts.filter((q) => {
    const matchesSearch =
      searchQuery === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.content ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.categoryName ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = filterTag === "all" || (q.categoryName ?? "") === filterTag;
    return matchesSearch && matchesTag;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return 0; // backend doesn't provide viewCount in PostDetailResponse
      case "unanswered":
        return 0; // backend doesn't provide commentCount in PostDetailResponse
      case "resolved":
        return 0; // backend doesn't provide isSolved in PostDetailResponse
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      {filtered.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link
                href={`/qna/${post.id}`}
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors"
              >
                {post.title}
              </Link>

              <div className="mt-2 flex flex-wrap gap-2">
                {(post.categoryName ? [post.categoryName] : []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}</span>
              </div>
            </div>

              <div className="ml-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">0</div>
                  <div>câu trả lời</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">0</div>
                  <div>lượt xem</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">0</div>
                  <div>bình chọn</div>
                </div>
              </div>
          </div>

 
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        </div>
      )}
    </div>
  );
}

 
