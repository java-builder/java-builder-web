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
    <div className={`bg-white rounded-lg border shadow-sm transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 ${
      comment.status === "DELETED" 
        ? "border-red-200 bg-red-50/30 dark:border-red-700 dark:bg-red-900/30" 
        : "border-gray-200 hover:shadow-md"
    }`}>
      {/* Main Comment */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
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
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {comment.author}
                </h4>
                {comment.status === "ACTIVE" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                    Hiển thị
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                    Đã xóa
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>

            {/* Comment Content */}
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
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
                className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Trả lời
              </button>

              {comment.status === "ACTIVE" ? (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
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
        <div className="border-t border-gray-200 bg-gray-50/50 dark:border-slate-700 dark:bg-transparent">
          <div className="p-4 pl-16 space-y-3">
            {replies.map((reply, index) => (
              <div key={reply.id} className="relative">
                {/* Vertical line connecting to parent */}
                <div className="absolute -left-12 top-0 bottom-0 w-px bg-gray-300 dark:bg-slate-600" />
                
                {/* Horizontal line to reply */}
                <div className="absolute -left-12 top-5 w-8 h-px bg-gray-300 dark:bg-slate-600" />
                
                {/* Last reply - end the vertical line */}
                {index === replies.length - 1 && (
                  <div className="absolute -left-12 top-0 h-5 w-px bg-gray-300 dark:bg-slate-600" />
                )}
                
                <div className="flex items-start gap-2.5">
                  {/* Reply Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-slate-700">
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {reply.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
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
