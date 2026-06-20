"use client";

import { useState } from "react";
import Image from "next/image";
import { formatRelativeTime } from "@/utils/dateUtils";
import { commentApi } from "@/services/comment.service";
import { CommentDetailResponse } from "@/types/comment";

interface Reply {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  createdAt: string;
  isAdmin?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  status: "ACTIVE" | "DELETED";
  createdAt: string;
  likes: number;
  blogTitle?: string;
  blogSlug?: string;
  courseTitle?: string;
  lessonTitle?: string;
  targetId?: string;
  targetType?: "BLOG" | "LESSON" | "POST" | "QUESTION";
  replies?: Reply[];
}

interface CommentCardProps {
  comment: Comment;
  repliesCount?: number;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onReply: (id: string) => void;
}

export default function CommentCard({
  comment,
  onDelete,
  onRestore,
  onReply,
  repliesCount = 0,
}: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentDetailResponse[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const handleToggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      setLoadingReplies(true);
      try {
        const response = await commentApi.getRepliesByParentId(comment.id, { page: 1, size: 50 });
        if (response.data) {
          setReplies(response.data.data);
        }
      } catch (error) {
        console.error("Error loading replies:", error);
      } finally {
        setLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm transition-all duration-200 ${
      comment.status === "DELETED" 
        ? "border-destructive/30 bg-destructive/5" 
        : "hover:shadow-md"
    }`}>
      {/* Main Comment */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-muted">
              <Image
                src={comment.authorAvatar}
                alt={comment.author}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {comment.author}
                </h4>
                {comment.status === "ACTIVE" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400">
                    Hiển thị
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400">
                    Đã xóa
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>

            {/* Comment Content */}
            <p className="text-sm text-foreground/90 leading-relaxed mb-3 break-words overflow-wrap-anywhere">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {repliesCount > 0 && (
                <button
                  onClick={handleToggleReplies}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                >
                  {loadingReplies ? "Đang tải..." : showReplies ? `Ẩn ${repliesCount} phản hồi` : `Xem ${repliesCount} phản hồi`}
                </button>
              )}
              
              <button
                onClick={() => onReply(comment.id)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Trả lời
              </button>

              {comment.status === "ACTIVE" ? (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-xs font-medium text-destructive hover:text-destructive/90 transition-colors"
                >
                  Xóa
                </button>
              ) : (
                <button
                  onClick={() => onRestore(comment.id)}
                  className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Khôi phục
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      {showReplies && replies.length > 0 && (
        <div className="border-t border-border bg-muted/20">
          <div className="p-4 pl-8 sm:pl-16 space-y-3">
            {replies.map((reply, index) => (
              <div key={reply.id} className="relative">
                {/* Vertical line connecting to parent */}
                <div className="absolute -left-6 sm:-left-12 top-0 bottom-0 w-px bg-border" />
                
                {/* Horizontal line to reply */}
                <div className="absolute -left-6 sm:-left-12 top-5 w-4 sm:w-8 h-px bg-border" />
                
                {/* Last reply - end the vertical line */}
                {index === replies.length - 1 && (
                  <div className="absolute -left-6 sm:-left-12 top-0 h-5 w-px bg-border" />
                )}
                
                <div className="flex items-start gap-2.5">
                  {/* Reply Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-muted">
                      <Image
                        src={reply.avatar || `https://i.pravatar.cc/150?u=${reply.username}`}
                        alt={reply.username}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Reply Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {reply.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed break-words overflow-wrap-anywhere">
                      {reply.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
