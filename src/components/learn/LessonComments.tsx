"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CommentResponse } from "@/types/comment";
import { useLessonComments } from "@/hooks/useLessonComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatRelativeTime } from "@/utils/dateUtils";
import { ChevronDown, CornerDownRight, MessageSquare, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface LessonCommentsProps {
  lessonId: string;
}

function CommentAvatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md";
}) {
  const [imgError, setImgError] = useState(false);
  const initial = (name || "U").trim().charAt(0).toUpperCase();
  const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm";
  const pxSize = size === "sm" ? 32 : 36;

  if (!src || imgError) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center shrink-0 border border-primary/15 select-none`}
      >
        {initial}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name || "User"}
      width={pxSize}
      height={pxSize}
      unoptimized
      onError={() => setImgError(true)}
      className={`${sizeClasses} rounded-full object-cover shrink-0 border border-border`}
    />
  );
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
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );

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
      if (
        comment &&
        (!comment.replies || comment.replies.length === 0) &&
        (comment.repliesCount || 0) > 0
      ) {
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
      toast.error(
        error instanceof Error ? error.message : "Gửi bình luận thất bại"
      );
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
      toast.error(
        error instanceof Error ? error.message : "Gửi trả lời thất bại"
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success("Xóa bình luận thành công");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(
        error instanceof Error ? error.message : "Xóa bình luận thất bại"
      );
    }
  };

  return (
    <div>
      <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
        <MessageSquare className="w-4.5 h-4.5 text-primary" />
        <span>Hỏi đáp & Thảo luận</span>
        {comments.length > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 bg-primary-soft text-primary rounded-full">
            {comments.length}
          </span>
        )}
      </h3>

      {/* New Comment Input */}
      {currentUser ? (
        <div className="mb-6">
          <div className="flex gap-3">
            <CommentAvatar
              src={currentUser.avatar}
              name={currentUser.username}
            />
            <div className="flex-1 bg-surface border border-border rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-xs">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết câu hỏi hoặc bình luận của bạn..."
                className="w-full px-4 py-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-text-muted resize-none min-h-[84px] leading-relaxed"
                rows={3}
              />
              <div className="h-px bg-border" />
              <div className="flex justify-end px-4 py-2.5 bg-muted/30">
                <button
                  type="button"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-5 py-2 text-xs bg-primary hover:bg-primary-hover disabled:bg-muted disabled:text-text-muted disabled:cursor-not-allowed text-white font-bold rounded-full transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-background border border-border rounded-2xl text-center">
          <p className="text-sm text-text-muted">
            Vui lòng{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              đăng nhập
            </Link>{" "}
            để tham gia bình luận.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && comments.length === 0 && (
        <div className="space-y-4 py-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
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
            onCancelReply={() => {
              setReplyingTo(null);
              setReplyContent("");
            }}
            onReplyContentChange={setReplyContent}
            onSubmitReply={() => handleSubmitReply(comment.id)}
            onDelete={() => handleDeleteComment(comment.id)}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={loadMoreComments}
            disabled={isLoading}
            className="px-5 py-2 text-xs font-bold rounded-full border border-border bg-background hover:bg-muted text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Đang tải..." : "Xem thêm bình luận"}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && comments.length === 0 && (
        <div className="text-center py-10 border border-dashed border-border rounded-2xl bg-background/50">
          <p className="text-sm text-text-muted">
            Chưa có bình luận nào. Hãy là người đầu tiên đặt câu hỏi!
          </p>
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: CommentResponse;
  currentUser:
    | { id: string; username: string; avatar?: string }
    | null
    | undefined;
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
      <div className="flex gap-3">
        <CommentAvatar
          src={comment.avatar}
          name={comment.username}
          size={isReply ? "sm" : "md"}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-foreground">
              {comment.username}
            </span>
            <span className="text-xs text-text-muted">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm text-foreground/90 whitespace-pre-wrap mb-2 leading-relaxed">
            {comment.content}
          </p>

          <div className="flex items-center gap-4">
            {!isReply && currentUser && (
              <button
                type="button"
                onClick={onStartReply}
                className="text-xs font-semibold text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Trả lời</span>
              </button>
            )}
            {(comment.repliesCount ?? 0) > 0 && !isReply && (
              <button
                type="button"
                onClick={onToggleReplies}
                className="text-xs font-semibold text-primary hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
                <span>
                  {isExpanded ? "Ẩn" : "Xem"} {comment.repliesCount} phản hồi
                </span>
              </button>
            )}
            {isOwner && (
              <button
                type="button"
                onClick={onDelete}
                className="text-xs font-semibold text-text-muted hover:text-error transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa</span>
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3 flex gap-3">
              <CommentAvatar
                src={currentUser?.avatar}
                name={currentUser?.username}
                size="sm"
              />
              <div className="flex-1 bg-surface border border-border rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-xs">
                <textarea
                  value={replyContent}
                  onChange={(e) => onReplyContentChange(e.target.value)}
                  placeholder={`Trả lời ${comment.username}...`}
                  className="w-full px-4 py-2.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-text-muted resize-none min-h-[64px] leading-relaxed"
                  rows={2}
                  autoFocus
                />
                <div className="h-px bg-border" />
                <div className="flex justify-end gap-2 px-3 py-2 bg-muted/30">
                  <button
                    type="button"
                    onClick={onCancelReply}
                    className="px-3.5 py-1.5 text-xs text-text-muted hover:text-foreground cursor-pointer font-bold rounded-full hover:bg-muted transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={onSubmitReply}
                    disabled={!replyContent.trim()}
                    className="px-4 py-1.5 bg-primary hover:bg-primary-hover disabled:bg-muted disabled:text-text-muted disabled:cursor-not-allowed text-white text-xs font-bold rounded-full transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
          )}

          {isExpanded && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-border space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  isExpanded={false}
                  isReplying={false}
                  replyContent=""
                  onToggleReplies={() => {}}
                  onStartReply={() => {}}
                  onCancelReply={() => {}}
                  onReplyContentChange={() => {}}
                  onSubmitReply={() => {}}
                  onDelete={() => {}}
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
