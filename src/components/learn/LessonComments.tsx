"use client";

import { useState } from "react";
import Image from "next/image";
import { CommentResponse } from "@/types/comment";

// Mock data
const mockComments: CommentResponse[] = [
  {
    id: "1",
    content: "Thầy ơi cho em hỏi, khi nào nên dùng @Query với native query và khi nào dùng JPQL ạ? Em thấy cả 2 đều cho kết quả giống nhau.",
    username: "Nguyễn Văn A",
    avatar: "",
    createdAt: "2 giờ trước",
    repliesCount: 2,
    replies: [
      {
        id: "1-1",
        content: "JPQL là chuẩn JPA, portable giữa các database. Native query dùng khi cần tối ưu performance hoặc dùng function đặc thù của database như MySQL's MATCH AGAINST. Khuyến khích dùng JPQL trước, chỉ chuyển native khi thực sự cần.",
        username: "Giảng viên",
        createdAt: "1 giờ trước",
        repliesCount: 0,
      },
      {
        id: "1-2",
        content: "Cảm ơn thầy, em hiểu rồi ạ!",
        username: "Nguyễn Văn A",
        avatar: "",
        createdAt: "30 phút trước",
        repliesCount: 0,
      },
    ],
  },
  {
    id: "2",
    content: "Ở phút 8:20, tại sao lại dùng FetchType.LAZY thay vì EAGER ạ? Em thấy dùng EAGER tiện hơn vì không cần gọi thêm query.",
    username: "Trần Thị B",
    createdAt: "5 giờ trước",
    repliesCount: 1,
    replies: [
      {
        id: "2-1",
        content: "EAGER sẽ load tất cả data liên quan ngay cả khi không cần, gây ra N+1 problem và tốn memory. LAZY chỉ load khi thực sự access, performance tốt hơn nhiều. Luôn dùng LAZY và fetch khi cần bằng JOIN FETCH hoặc EntityGraph nhé.",
        username: "Giảng viên",
        avatar: "",
        createdAt: "4 giờ trước",
        repliesCount: 0,
      },
    ],
  },
];

interface LessonCommentsProps {
  lessonId: string;
}

export default function LessonComments({ lessonId }: LessonCommentsProps) {
  const [comments] = useState<CommentResponse[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  console.log("LessonComments for lesson:", lessonId);

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    // TODO: Call API
    console.log("Submit comment:", newComment);
    setNewComment("");
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    // TODO: Call API
    console.log("Submit reply to:", parentId, replyContent);
    setReplyContent("");
    setReplyingTo(null);
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
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết câu hỏi hoặc bình luận của bạn..."
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-accent hover:bg-accent-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                Gửi bình luận
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isExpanded={expandedReplies.has(comment.id)}
            isReplying={replyingTo === comment.id}
            replyContent={replyContent}
            onToggleReplies={() => toggleReplies(comment.id)}
            onStartReply={() => setReplyingTo(comment.id)}
            onCancelReply={() => { setReplyingTo(null); setReplyContent(""); }}
            onReplyContentChange={setReplyContent}
            onSubmitReply={() => handleSubmitReply(comment.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: CommentResponse;
  isExpanded: boolean;
  isReplying: boolean;
  replyContent: string;
  onToggleReplies: () => void;
  onStartReply: () => void;
  onCancelReply: () => void;
  onReplyContentChange: (value: string) => void;
  onSubmitReply: () => void;
  isReply?: boolean;
}

function CommentItem({
  comment,
  isExpanded,
  isReplying,
  replyContent,
  onToggleReplies,
  onStartReply,
  onCancelReply,
  onReplyContentChange,
  onSubmitReply,
  isReply = false,
}: CommentItemProps) {
  return (
    <div className={isReply ? "ml-12" : ""}>
      <div className="flex gap-3">
        {/* Avatar */}
        {comment.avatar ? (
          <Image
            src={comment.avatar}
            alt={comment.username}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
            comment.username === "Giảng viên" 
              ? "bg-green-500" 
              : "bg-gradient-to-br from-accent to-accent-600"
          }`}>
            <span className="text-white text-sm font-medium">
              {comment.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium text-sm ${
              comment.username === "Giảng viên" 
                ? "text-green-600 dark:text-green-400" 
                : "text-gray-900 dark:text-white"
            }`}>
              {comment.username}
            </span>
            {comment.username === "Giảng viên" && (
              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                Giảng viên
              </span>
            )}
            <span className="text-xs text-gray-500">{comment.createdAt}</span>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!isReply && (
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
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">U</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => onReplyContentChange(e.target.value)}
                  placeholder={`Trả lời ${comment.username}...`}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                  rows={2}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={onCancelReply}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={onSubmitReply}
                    disabled={!replyContent.trim()}
                    className="px-3 py-1.5 bg-accent hover:bg-accent-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {isExpanded && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isExpanded={false}
                  isReplying={false}
                  replyContent=""
                  onToggleReplies={() => {}}
                  onStartReply={() => {}}
                  onCancelReply={() => {}}
                  onReplyContentChange={() => {}}
                  onSubmitReply={() => {}}
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
