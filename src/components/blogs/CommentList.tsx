"use client";

import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { CommentDetailResponse } from "@/types/comment";

interface CommentListProps {
  comments: CommentDetailResponse[];
  onAddComment: (content: string) => void;
  onReplyComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLoadReplies?: (commentId: string) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  hasMore?: boolean;
}

export default function CommentList({
  comments,
  onAddComment,
  onReplyComment,
  onDeleteComment,
  onLoadReplies,
  onLoadMore,
  isLoading = false,
  isSubmitting = false,
  hasMore = false,
}: CommentListProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [hashReplyId, setHashReplyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#comment-")) {
        const id = hash.replace("#comment-", "").trim();
        setHashReplyId(id || undefined);
      } else {
        setHashReplyId(undefined);
      }
    };
    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (isLoading && comments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded-lg w-24 animate-pulse" />
        </div>
        <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-11 h-11 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-16 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Bình luận</h3>
            <p className="text-sm text-gray-500">{comments.length} bình luận</p>
          </div>
        </div>

        {comments.length > 1 && (
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSortBy("newest")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                sortBy === "newest"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mới nhất
            </button>
            <button
              onClick={() => setSortBy("oldest")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                sortBy === "oldest"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Cũ nhất
            </button>
          </div>
        )}
      </div>

      {/* Comment Form */}
      <CommentForm onSubmit={onAddComment} isSubmitting={isSubmitting} />

      {/* Divider */}
      {comments.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">
              {comments.length} bình luận
            </span>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bình luận</h4>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Hãy là người đầu tiên chia sẻ suy nghĩ của bạn về bài viết này!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onReplyComment}
              onDelete={onDeleteComment}
              onLoadReplies={onLoadReplies}
              repliesCount={comment.repliesCount || 0}
              expandReplyId={hashReplyId}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {comments.length > 0 && hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="group flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>Xem thêm bình luận</span>
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
