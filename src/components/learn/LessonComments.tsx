"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CommentResponse } from "@/types/comment";
import { useLessonComments } from "@/hooks/useLessonComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatRelativeTime } from "@/utils/dateUtils";
import toast from "react-hot-toast";

interface LessonCommentsProps {
  lessonId: string;
}

export default function LessonComments({ lessonId }: LessonCommentsProps) {
  const { data: currentUser } = useCurrentUser();
  const {
    comments,
    isLoading,
    isSubmitting,
    hasMore,
    loadRootComments,
    loadReplies,
    addComment,
    replyToComment,
    deleteComment,
    loadMoreComments,
  } = useLessonComments(lessonId);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRootComments(1, false);
  }, [lessonId, loadRootComments]);

  const toggleReplies = async (commentId: string) => {
    const newSet = new Set(expandedReplies);
    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
      const comment = comments.find((c) => c.id === commentId);
      if (comment && (!comment.replies || comment.replies.length === 0) && (comment.repliesCount || 0) > 0) {
        await loadReplies(commentId);
      }
    }
    setExpandedReplies(newSet);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    try {
      await addComment(newComment);
      setNewComment("");
      toast.success("Bình luận thành công");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(error instanceof Error ? error.message : "Gửi bình luận thất bại");
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !currentUser) return;
    try {
      await replyToComment(parentId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
      if (!expandedReplies.has(parentId)) {
        setExpandedReplies((prev) => new Set(prev).add(parentId));
      }
      toast.success("Trả lời thành công");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error(error instanceof Error ? error.message : "Gửi trả lời thất bại");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success("Xóa bình luận thành công");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error instanceof Error ? error.message : "Xóa bình luận thất bại");
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Hỏi đáp ({comments.length})
      </h3>

      {/* New Comment Input */}
      {currentUser ? (
        <div className="mb-6">
          <div className="flex gap-3">
            {currentUser.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.username}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {currentUser.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 bg-white dark:bg-slate-900/30 border border-gray-200/80 dark:border-slate-700/80 rounded-xl overflow-hidden focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 transition-all shadow-xs">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết câu hỏi hoặc bình luận của bạn..."
                className="w-full px-4 py-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 resize-none min-h-[80px] leading-relaxed"
                rows={3}
              />
              <div className="h-px bg-gray-100 dark:bg-slate-800" />
              <div className="flex justify-end px-4 py-2.5 bg-gray-50/60 dark:bg-slate-800/30">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 text-xs bg-accent hover:bg-accent/90 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-xs hover:shadow active:scale-98 cursor-pointer"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vui lòng <a href="/login" className="text-accent hover:underline">đăng nhập</a> để bình luận
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && comments.length === 0 && (
        <div className="space-y-4 py-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3.5 bg-muted rounded w-full" />
                <div className="h-3.5 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            isExpanded={expandedReplies.has(comment.id)}
            isReplying={replyingTo === comment.id}
            replyContent={replyContent}
            onToggleReplies={() => toggleReplies(comment.id)}
            onStartReply={() => setReplyingTo(comment.id)}
            onCancelReply={() => { setReplyingTo(null); setReplyContent(""); }}
            onReplyContentChange={setReplyContent}
            onSubmitReply={() => handleSubmitReply(comment.id)}
            onDelete={() => handleDeleteComment(comment.id)}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMoreComments}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-accent hover:text-accent-600 disabled:opacity-50"
          >
            {isLoading ? "Đang tải..." : "Xem thêm bình luận"}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && comments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </p>
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: CommentResponse;
  currentUser: { id: string; username: string; avatar?: string } | null | undefined;
  isExpanded: boolean;
  isReplying: boolean;
  replyContent: string;
  onToggleReplies: () => void;
  onStartReply: () => void;
  onCancelReply: () => void;
  onReplyContentChange: (value: string) => void;
  onSubmitReply: () => void;
  onDelete: () => void;
  isReply?: boolean;
}

function CommentItem({
  comment,
  currentUser,
  isExpanded,
  isReplying,
  replyContent,
  onToggleReplies,
  onStartReply,
  onCancelReply,
  onReplyContentChange,
  onSubmitReply,
  onDelete,
  isReply = false,
}: CommentItemProps) {
  const isOwner = currentUser?.username === comment.username;

  return (
    <div className="relative">
      {isReply && (
        <div className="absolute -left-[30px] top-[18px] w-[30px] h-px bg-gray-200 dark:bg-slate-700" />
      )}
      <div className="flex gap-3">
        {comment.avatar ? (
          <Image
            src={comment.avatar}
            alt={comment.username}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-accent to-accent-600">
            <span className="text-white text-sm font-medium">
              {comment.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {comment.username}
            </span>
            <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2">
            {comment.content}
          </p>

          <div className="flex items-center gap-4">
            {!isReply && currentUser && (
              <button
                onClick={onStartReply}
                className="text-xs text-gray-500 hover:text-accent transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Trả lời
              </button>
            )}
            {(comment.repliesCount ?? 0) > 0 && !isReply && (
              <button
                onClick={onToggleReplies}
                className="text-xs text-accent hover:text-accent-600 transition-colors flex items-center gap-1"
              >
                <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isExpanded ? "Ẩn" : "Xem"} {comment.repliesCount} phản hồi
              </button>
            )}
            {isOwner && (
              <button
                onClick={onDelete}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3 flex gap-3">
              {currentUser?.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1 bg-white dark:bg-slate-900/30 border border-gray-200/80 dark:border-slate-700/80 rounded-xl overflow-hidden focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 transition-all shadow-xs">
                <textarea
                  value={replyContent}
                  onChange={(e) => onReplyContentChange(e.target.value)}
                  placeholder={`Trả lời ${comment.username}...`}
                  className="w-full px-4 py-2.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 resize-none min-h-[64px] leading-relaxed"
                  rows={2}
                  autoFocus
                />
                <div className="h-px bg-gray-100 dark:bg-slate-800" />
                <div className="flex justify-end gap-2 px-3 py-2 bg-gray-50/60 dark:bg-slate-800/30">
                  <button
                    onClick={onCancelReply}
                    className="px-3 py-1.5 text-xs text-gray-505 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={onSubmitReply}
                    disabled={!replyContent.trim()}
                    className="px-3 py-1.5 bg-accent hover:bg-accent/90 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-650 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all shadow-xs hover:shadow active:scale-98 cursor-pointer"
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
          )}

          {isExpanded && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 -ml-[30px] pl-[30px] border-l border-gray-200 dark:border-slate-700 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  isExpanded={false}
                  isReplying={false}
                  replyContent=""
                  onToggleReplies={() => { }}
                  onStartReply={() => { }}
                  onCancelReply={() => { }}
                  onReplyContentChange={() => { }}
                  onSubmitReply={() => { }}
                  onDelete={() => { }}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
