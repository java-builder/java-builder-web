"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { apiClient } from "@/api/axios";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { PostDetail } from "@/types/post";

interface PostListProps {
  posts?: PostDetail[];
  searchQuery?: string;
  sortBy?: string;
  filterTag?: string;
  pageSize?: number;
  showActions?: boolean;
  onEdit?: (post: PostDetail) => void;
  onDelete?: (post: PostDetail) => void;
}

export default function PostList({
  posts,
  searchQuery = "",
  sortBy = "newest",
  filterTag = "all",
  pageSize = 10,
  showActions = false,
  onEdit,
  onDelete,
}: PostListProps) {
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openMenuForRef = useRef<string | null>(null);

  useEffect(() => {
    openMenuForRef.current = openMenuFor;
  }, [openMenuFor]);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const currentOpen = openMenuForRef.current;
      if (!currentOpen) return;
      const target = e.target as Node | null;
      const cardEl = cardRefs.current[currentOpen];
      // if we don't have the element or the click is outside it, close the menu
      if (!cardEl || (target && !cardEl.contains(target))) {
        setOpenMenuFor(null);
      }
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);
  const [fetchedPosts, setFetchedPosts] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);


  useEffect(() => {
    let mounted = true;

    // If parent provided `posts` prop (even an empty array), respect it and do not fetch here.
    if (posts !== undefined) {
      setFetchedPosts(posts);
      setHasMore(false);
      setLoading(false);
      return;
    }

    setFetchedPosts([]);
    setPage(1);
    setHasMore(true);

    (async () => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = { page: 1, size: pageSize };
        if (searchQuery) params.search = searchQuery;
        if (filterTag && filterTag !== "all") params.categoryName = filterTag;

        const resp = await apiClient.get("/api/v1/posts", { params });
        const pageData = resp.data?.data;
        const items: PostDetail[] = Array.isArray(pageData?.data) ? pageData.data : [];
        if (!mounted) return;
        setFetchedPosts(items);
        setHasMore(items.length === pageSize);
      } catch (e) {
        console.error("Failed to load posts for Q&A", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [posts, searchQuery, filterTag, pageSize]);

  const loadMore = useCallback(async (nextPage: number) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const params: Record<string, unknown> = { page: nextPage, size: pageSize };
      if (searchQuery) params.search = searchQuery;
      if (filterTag && filterTag !== "all") params.categoryName = filterTag;

      const resp = await apiClient.get("/api/v1/posts", { params });
      const pageData = resp.data?.data;
      const items: PostDetail[] = Array.isArray(pageData?.data) ? pageData.data : [];
      setFetchedPosts((prev) => [...prev, ...items]);
      setHasMore(items.length === pageSize);
      setPage(nextPage);
    } catch (e) {
      console.error("Failed to load more posts for Q&A", e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pageSize, searchQuery, filterTag]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
            loadMore(page + 1);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    );

    const el = document.getElementById("qna-posts-sentinel");
    if (el) observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore, page, loadMore]);

  const displayPosts = posts && posts.length > 0 ? posts : fetchedPosts ?? [];

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
        return 0;
      case "unanswered":
        return 0;
      case "resolved":
        return 0;
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
          ref={(el) => { cardRefs.current[post.id] = el; }}
          className="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row items-start justify-between">
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start">
                {post.avatar ? (
                  <Image
                    src={post.avatar}
                    alt={post.username ?? "avatar"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-sm text-gray-600">U</div>
                )}
                <div className="ml-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/qna/${post.slug}`}
                      className="block text-lg font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors truncate max-w-[32rem]"
                    >
                      {post.title}
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                    </div>
                    {showActions && null}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{post.username}</div>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {(post.categoryName ? [post.categoryName] : []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* actions menu positioned absolute in card corner */}
              {showActions && (
                <div className="absolute right-4 top-4 z-30" data-post-action={`post-${post.id}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuFor(openMenuFor === post.id ? null : post.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuFor(openMenuFor === post.id ? null : post.id);
                      }
                    }}
                    aria-haspopup="true"
                    aria-expanded={openMenuFor === post.id}
                    className="w-8 h-8 inline-flex items-center justify-center bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors pointer-events-auto"
                    tabIndex={0}
                    role="button"
                    aria-label="More actions"
                    data-post-action={`post-${post.id}`}
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                    </svg>
                  </button>

                  {openMenuFor === post.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-50"
                      style={{ position: "absolute", right: 0, top: "36px" }}
                      data-post-action={`post-${post.id}`}
                    >
                      <button
                        onClick={() => {
                          void (onEdit && onEdit(post));
                          setOpenMenuFor(null);
                        }}
                        className="w-full text-left px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Chỉnh sửa
                      </button>

                      <div className="border-t border-gray-100 dark:border-slate-700" />

                      <button
                        onClick={() => {
                          void (onDelete && onDelete(post));
                          setOpenMenuFor(null);
                        }}
                        className="w-full text-left px-4 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 sm:mt-0 ml-0 sm:ml-4 pr-12 flex-shrink-0 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{post.commentCount ?? 0}</div>
                <div>câu trả lời</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{post.viewCount ?? 0}</div>
                <div>lượt xem</div>
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


