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
          className="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          {/* actions menu positioned absolute in card corner */}
          {showActions && (
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4 z-30" data-post-action={`post-${post.id}`}>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onEdit) {
                        onEdit(post);
                      }
                      setOpenMenuFor(null);
                    }}
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Chỉnh sửa
                  </button>

                  <div className="border-t border-gray-100 dark:border-slate-700" />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onDelete) {
                        onDelete(post);
                      }
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

          <div className="flex flex-col space-y-3">
            {/* Header with avatar and user info */}
            <div className="flex items-start gap-3 pr-10">
              {post.avatar ? (
                <Image
                  src={post.avatar}
                  alt={post.username ?? "avatar"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-sm text-gray-600 flex-shrink-0">U</div>
              )}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/qna/${post.slug}`}
                  className="block text-base sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="truncate">{post.username}</span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="whitespace-nowrap">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.categoryName && (
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
                  {post.categoryName}
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">{post.commentCount ?? 0}</span>
                <span className="hidden xs:inline">câu trả lời</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">{post.viewCount ?? 0}</span>
                <span className="hidden xs:inline">lượt xem</span>
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


