"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { apiClient } from "@/api/axios";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS, ja, ko } from "date-fns/locale";
import { PostDetail } from "@/types/post";
import { parseDate } from "@/utils/dateUtils";
import { useI18n } from "@/contexts/I18nContext";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Eye,
  Tag as TagIcon,
  MoreVertical,
  Edit3,
  Trash2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface PostListProps {
  posts?: PostDetail[];
  searchQuery?: string;
  sortBy?: string;
  filterTag?: string;
  statusFilter?: string; // "all", "resolved", "unanswered"
  pageSize?: number;
  showActions?: boolean;
  onEdit?: (post: PostDetail) => void;
  onDelete?: (post: PostDetail) => void;
}

function extractExcerpt(content?: string, maxLength: number = 180): string {
  if (!content) return "";
  const plainText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/#+\s+/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
}

export default function PostList({
  posts,
  searchQuery = "",
  sortBy = "newest",
  filterTag = "all",
  statusFilter = "all",
  pageSize = 10,
  showActions = false,
  onEdit,
  onDelete,
}: PostListProps) {
  const { locale, t } = useI18n();
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  const dateLocale = useMemo(() => {
    switch (locale) {
      case "en": return enUS;
      case "ja": return ja;
      case "ko": return ko;
      case "vi":
      default:
        return vi;
    }
  }, [locale]);

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
      if (!cardEl || (target && !cardEl.contains(target))) {
        setOpenMenuFor(null);
      }
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  const [fetchedPosts, setFetchedPosts] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState(posts === undefined);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (posts !== undefined) {
      setFetchedPosts(posts);
      setHasMore(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchedPosts([]);
    setPage(1);
    setHasMore(true);

    const timer = setTimeout(async () => {
      try {
        const params: Record<string, unknown> = { page: 1, size: pageSize };
        if (searchQuery) params.search = searchQuery;
        if (filterTag && filterTag !== "all") params.categoryName = filterTag;
        if (statusFilter === "resolved") params.isSolved = true;
        if (statusFilter === "unanswered") params.isSolved = false;
        if (sortBy) params.sortBy = sortBy;

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
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [posts, searchQuery, filterTag, statusFilter, sortBy, pageSize]);

  const loadMore = useCallback(async (nextPage: number) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const params: Record<string, unknown> = { page: nextPage, size: pageSize };
      if (searchQuery) params.search = searchQuery;
      if (filterTag && filterTag !== "all") params.categoryName = filterTag;
      if (statusFilter === "resolved") params.isSolved = true;
      if (statusFilter === "unanswered") params.isSolved = false;
      if (sortBy) params.sortBy = sortBy;

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
  }, [loadingMore, pageSize, searchQuery, filterTag, statusFilter, sortBy]);

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
      (q.categoryName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.tags ?? []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = filterTag === "all" || (q.categoryName ?? "") === filterTag;

    let matchesStatus = true;
    if (statusFilter === "resolved" || sortBy === "resolved") {
      matchesStatus = !!q.isSolved;
    } else if (statusFilter === "unanswered" || sortBy === "unanswered") {
      matchesStatus = (q.commentCount ?? 0) === 0;
    }

    return matchesSearch && matchesTag && matchesStatus;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "popular": {
        const scoreA = (a.viewCount ?? 0) + (a.commentCount ?? 0) * 3;
        const scoreB = (b.viewCount ?? 0) + (b.commentCount ?? 0) * 3;
        return scoreB - scoreA;
      }
      case "unanswered":
        return (a.commentCount ?? 0) - (b.commentCount ?? 0);
      case "resolved":
        return (b.isSolved ? 1 : 0) - (a.isSolved ? 1 : 0);
      case "oldest": {
        const aDate = parseDate(a.createdAt);
        const bDate = parseDate(b.createdAt);
        const aTime = aDate ? aDate.getTime() : 0;
        const bTime = bDate ? bDate.getTime() : 0;
        return aTime - bTime;
      }
      case "newest":
      default: {
        const aDate = parseDate(a.createdAt);
        const bDate = parseDate(b.createdAt);
        const aTime = aDate ? aDate.getTime() : 0;
        const bTime = bDate ? bDate.getTime() : 0;
        return bTime - aTime;
      }
    }
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 sm:p-6 animate-pulse space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20" />
                </div>
              </div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            </div>

            <div className="space-y-2 pt-1">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
            </div>

            <div className="flex gap-2 pt-1">
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-md w-16" />
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-md w-20" />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-700/60">
              <div className="flex gap-4">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-24" />
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-20" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((post) => {
        const isResolved = !!post.isSolved;
        const excerpt = extractExcerpt(post.content);
        const hasComments = (post.commentCount ?? 0) > 0;

        return (
          <div
            key={post.id}
            ref={(el) => {
              cardRefs.current[post.id] = el;
            }}
            className={`group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 ${
              isResolved
                ? "border-l-4 border-l-emerald-500"
                : "border-l-4 border-l-amber-500"
            }`}
          >
            {/* Action menu for admin/owner */}
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
                  className="w-8 h-8 inline-flex items-center justify-center bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors pointer-events-auto"
                  tabIndex={0}
                  role="button"
                  aria-label="More actions"
                  data-post-action={`post-${post.id}`}
                >
                  <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>

                {openMenuFor === post.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 w-36 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50 overflow-hidden"
                    style={{ position: "absolute", right: 0, top: "36px" }}
                    data-post-action={`post-${post.id}`}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onEdit) onEdit(post);
                        setOpenMenuFor(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-accent" />
                      {t("qnaPage.edit")}
                    </button>

                    <div className="border-t border-gray-100 dark:border-slate-700" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onDelete) onDelete(post);
                        setOpenMenuFor(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      {t("qnaPage.delete")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Header: User avatar, name, status badge, category */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pr-8 sm:pr-10">
              <div className="flex items-center gap-3">
                {post.avatar ? (
                  <Image
                    src={post.avatar}
                    alt={post.username ?? "avatar"}
                    width={38}
                    height={38}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-700 flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    {(post.username || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-accent transition-colors">
                      {post.username || "Khách"}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(() => {
                        const date = parseDate(post.createdAt);
                        return date
                          ? formatDistanceToNow(date, { addSuffix: true, locale: dateLocale })
                          : t("time.justNow");
                      })()}
                    </span>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2 mt-0.5">
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã giải quyết
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                        <Clock className="w-3 h-3" />
                        Đang chờ trả lời
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category pill */}
              {post.categoryName && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                  <TagIcon className="w-3 h-3" />
                  {post.categoryName}
                </span>
              )}
            </div>

            {/* Question Title */}
            <div className="mb-2">
              <Link
                href={`/qna/${post.slug}`}
                className="text-base sm:text-lg font-bold text-gray-900 dark:text-white hover:text-accent transition-colors line-clamp-2 leading-snug"
              >
                {post.title}
              </Link>
            </div>

            {/* Question Excerpt Teaser */}
            {excerpt && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed mb-3">
                {excerpt}
              </p>
            )}

            {/* Tag Pills */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Stats & View Details Link */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/60 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Comments / Answers Badge */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                    isResolved || hasComments
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentCount ?? 0}</span>
                  <span className="hidden xs:inline">{t("qnaPage.answersCount")}</span>
                </div>

                {/* View count Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.viewCount ?? 0}</span>
                  <span className="hidden xs:inline">{t("qnaPage.viewsCount")}</span>
                </div>
              </div>

              {/* View details */}
              <Link
                href={`/qna/${post.slug}`}
                className="inline-flex items-center gap-1 font-semibold text-accent hover:underline group-hover:translate-x-0.5 transition-all"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })}

      {/* Sentinel element for infinite scroll loading */}
      {hasMore && !loading && (
        <div id="qna-posts-sentinel" className="py-4 text-center">
          {loadingMore && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span>Đang tải thêm câu hỏi...</span>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Không tìm thấy câu hỏi nào
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery || filterTag !== "all"
              ? "Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc để thấy nhiều kết quả hơn."
              : t("qnaPage.emptyText")}
          </p>
        </div>
      )}
    </div>
  );
}
