"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { formatApiDateOnly } from "@/utils/dateUtils";
import { CommentDetailResponse } from "@/types/comment";

interface CommentItemProps {
  comment: CommentDetailResponse;
  onReply?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onLoadReplies?: (commentId: string) => void;
  repliesCount?: number;
  expandReplyId?: string;
}

export default function CommentItem({
  comment,
  onReply,
  onDelete,
  onLoadReplies,
  repliesCount = 0,
  expandReplyId,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReplies, setShowReplies] = useState(!!expandReplyId);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplyMenu, setShowReplyMenu] = useState<{ [key: string]: boolean }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowReplyMenu({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus reply textarea
  useEffect(() => {
    if (showReplyForm && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [showReplyForm]);

  const handleReply = async () => {
    if (replyContent.trim() && onReply) {
      setIsSubmittingReply(true);
      try {
        await onReply(comment.id, replyContent.trim());
        setReplyContent("");
        setShowReplyForm(false);
        setShowReplies(true);
        if (onLoadReplies && (!comment.replies || comment.replies.length === 0)) {
          await onLoadReplies(comment.id);
        }
      } finally {
        setIsSubmittingReply(false);
      }
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!onDelete) return;
    try {
      await onDelete(commentId);
      setShowMenu(false);
      setShowReplyMenu({});
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleLoadReplies = async () => {
    if (!showReplies && onLoadReplies) {
      setIsLoadingReplies(true);
      try {
        await onLoadReplies(comment.id);
        setShowReplies(true);
      } finally {
        setIsLoadingReplies(false);
      }
    } else {
      setShowReplies(!showReplies);
    }
  };

  useEffect(() => {
    if (expandReplyId) setShowReplies(true);
  }, [expandReplyId]);

  // Generate avatar color based on username
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-rose-500",
      "bg-amber-500", "bg-cyan-500", "bg-indigo-500", "bg-pink-500"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div id={`comment-${comment.id}`} className="group scroll-mt-24">
      <div className="flex gap-3 sm:gap-4">
        {/* Avatar */}
        <div className={`w-10 h-10 sm:w-11 sm:h-11 ${getAvatarColor(comment.username)} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm`}>
          {comment.avatar ? (
            <Image
              src={comment.avatar}
              alt={comment.username}
              width={44}
              height={44}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            comment.username.charAt(0).toUpperCase()
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Comment Box */}
          <div className="bg-gray-50 rounded-2xl px-4 py-3 hover:bg-gray-100/80 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {comment.username}
                </span>
                <span className="text-gray-300">•</span>
                <time className="text-xs sm:text-sm text-gray-500" dateTime={comment.createdAt}>
                  {formatApiDateOnly(comment.createdAt)}
                </time>
              </div>

              {/* Menu */}
              {onDelete && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fadeIn">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Xóa bình luận</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 mt-2 ml-2">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all ${
                showReplyForm
                  ? "bg-accent/10 text-accent"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>Trả lời</span>
            </button>

            {repliesCount > 0 && (
              <button
                onClick={handleLoadReplies}
                disabled={isLoadingReplies}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-all disabled:opacity-50"
              >
                {isLoadingReplies ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className={`w-4 h-4 transition-transform ${showReplies ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                <span>{showReplies ? "Ẩn" : `${repliesCount}`} phản hồi</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 ml-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <textarea
                    ref={replyTextareaRef}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Trả lời ${comment.username}...`}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm placeholder-gray-400 transition-all"
                    rows={2}
                    maxLength={500}
                    disabled={isSubmittingReply}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{replyContent.length}/500</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowReplyForm(false); setReplyContent(""); }}
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyContent.trim() || isSubmittingReply}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                          !replyContent.trim() || isSubmittingReply
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-accent text-white hover:bg-accent-600"
                        }`}
                      >
                        {isSubmittingReply ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                        <span>Gửi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-2 space-y-3 relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-4 w-0.5 bg-gradient-to-b from-gray-200 to-transparent" />
              
              {comment.replies.map((reply) => (
                <div key={reply.id} id={`comment-${reply.id}`} className="flex gap-3 pl-6 group/reply scroll-mt-24">
                  <div className={`w-8 h-8 ${getAvatarColor(reply.username)} rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0 shadow-sm`}>
                    {reply.avatar ? (
                      <Image src={reply.avatar} alt={reply.username} width={32} height={32} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      reply.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 hover:border-gray-200 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">{reply.username}</span>
                          <span className="text-gray-300">•</span>
                          <time className="text-xs text-gray-500" dateTime={reply.createdAt}>
                            {formatApiDateOnly(reply.createdAt)}
                          </time>
                        </div>
                        {onDelete && (
                          <div className="relative">
                            <button
                              onClick={() => setShowReplyMenu(prev => ({ ...prev, [reply.id]: !prev[reply.id] }))}
                              className="opacity-0 group-hover/reply:opacity-100 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </button>
                            {showReplyMenu[reply.id] && (
                              <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                                <button
                                  onClick={() => handleDelete(reply.id)}
                                  className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Xóa</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
