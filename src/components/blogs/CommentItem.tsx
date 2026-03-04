"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { formatRelativeTime } from "@/utils/dateUtils";
import { CommentResponse } from "@/types/comment";
import CommentPlaceholder from "./CommentPlaceholder";

interface CommentItemProps {
  comment: CommentResponse;
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
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplyMenu, setShowReplyMenu] = useState<{ [key: string]: boolean }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const hasLoadedRepliesRef = useRef(false);

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
    if (!showReplies) {
      // Load replies if not already loaded
      if (onLoadReplies && (!comment.replies || comment.replies.length === 0)) {
        setIsLoadingReplies(true);
        try {
          await onLoadReplies(comment.id);
        } finally {
          setIsLoadingReplies(false);
        }
      }
      setShowReplies(true);
    } else {
      setShowReplies(false);
    }
  };

  useEffect(() => {
    if (!expandReplyId || hasLoadedRepliesRef.current) return;
    
    const hasTargetReply = comment.replies?.some(r => r.id === expandReplyId);
    if (!hasTargetReply) return;

    hasLoadedRepliesRef.current = true;
    setShowReplies(true);
    
    if (onLoadReplies && (!comment.replies || comment.replies.length === 0)) {
      onLoadReplies(comment.id);
    }
  }, [expandReplyId, comment.id, comment.replies, onLoadReplies]);

  // Generate avatar gradient based on username
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-emerald-500 to-emerald-600",
      "bg-gradient-to-br from-violet-500 to-violet-600",
      "bg-gradient-to-br from-rose-500 to-rose-600",
      "bg-gradient-to-br from-amber-500 to-amber-600",
      "bg-gradient-to-br from-cyan-500 to-cyan-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-pink-500 to-pink-600"
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div id={`comment-${comment.id}`} className="group scroll-mt-24">
      <div className="flex gap-2">
        {/* Avatar */}
        <div className={`w-8 h-8 ${getAvatarGradient(comment.username)} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {comment.avatar ? (
            <Image
              src={comment.avatar}
              alt={comment.username}
              width={32}
              height={32}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            comment.username.charAt(0).toUpperCase()
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Comment Box */}
          <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-3 py-2 inline-block max-w-full">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {comment.username}
              </span>

              {/* Menu */}
              {onDelete && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-7 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-50">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="w-full px-3 py-1.5 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
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

            {/* Content */}
            <p className="text-gray-900 dark:text-gray-100 text-sm leading-snug whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {/* Actions - Horizontal layout like Facebook */}
          <div className="mt-1 ml-3">
            <div className="flex items-center gap-3 text-xs">
              <time className="text-gray-500 dark:text-gray-400 font-medium" dateTime={comment.createdAt}>
                {formatRelativeTime(comment.createdAt)}
              </time>
              <button
                onClick={() => {
                  // Toggle reply form, không xóa content
                  setShowReplyForm(!showReplyForm);
                }}
                className={`font-semibold transition-colors ${
                  showReplyForm
                    ? "text-accent"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Trả lời
              </button>
            </div>

            {repliesCount > 0 && (
              <button
                onClick={handleLoadReplies}
                disabled={isLoadingReplies}
                className="mt-2 font-semibold text-accent dark:text-accent hover:text-accent-600 dark:hover:text-accent-400 text-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isLoadingReplies && (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isLoadingReplies ? "Đang tải..." : showReplies ? "Ẩn phản hồi" : `Xem ${repliesCount} phản hồi`}
              </button>
            )}
          </div>

          {/* Replies */}
          {showReplies && (
            <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
              {/* Loading placeholder */}
              {isLoadingReplies && (!comment.replies || comment.replies.length === 0) && (
                <CommentPlaceholder />
              )}
              
              {/* Actual replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-10 space-y-2 relative">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[-24px] top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-slate-600" />
                  
                  {comment.replies.map((reply) => (
                <div key={reply.id} id={`comment-${reply.id}`} className="flex gap-2 group/reply scroll-mt-24 relative">
                  {/* Horizontal connecting line */}
                  <div className="absolute left-[-24px] top-4 w-6 h-0.5 bg-gray-300 dark:bg-slate-600" />
                  
                  <div className={`w-7 h-7 ${getAvatarGradient(reply.username)} rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                    {reply.avatar ? (
                      <Image src={reply.avatar} alt={reply.username} width={28} height={28} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      reply.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-3 py-2 inline-block max-w-full">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{reply.username}</span>
                        {onDelete && (
                          <div className="relative">
                            <button
                              onClick={() => setShowReplyMenu(prev => ({ ...prev, [reply.id]: !prev[reply.id] }))}
                              className="opacity-0 group-hover/reply:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </button>
                            {showReplyMenu[reply.id] && (
                              <div className="absolute right-0 top-7 w-28 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-50">
                                <button
                                  onClick={() => handleDelete(reply.id)}
                                  className="w-full px-3 py-1.5 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
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
                      <p className="text-gray-900 dark:text-gray-100 text-sm leading-snug whitespace-pre-wrap break-words">
                        {reply.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-3 text-xs">
                      <time className="text-gray-500 dark:text-gray-400 font-medium" dateTime={reply.createdAt}>
                        {formatRelativeTime(reply.createdAt)}
                      </time>
                      <button
                        onClick={() => {
                          const mentionText = `@${reply.username} `;
                          setReplyContent(mentionText);
                          setShowReplyForm(true);
                          // Scroll to reply form after a short delay
                          setTimeout(() => {
                            if (replyTextareaRef.current) {
                              replyTextareaRef.current.focus();
                              // Set cursor position at the end
                              replyTextareaRef.current.selectionStart = mentionText.length;
                              replyTextareaRef.current.selectionEnd = mentionText.length;
                              replyTextareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 150);
                        }}
                        className="font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Trả lời
                      </button>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              )}
            </div>
          )}

          {/* Reply Form - Below replies */}
          {showReplyForm && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <textarea
                    ref={replyTextareaRef}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Trả lời ${comment.username}...`}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    rows={2}
                    maxLength={500}
                    disabled={isSubmittingReply}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{replyContent.length}/500</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowReplyForm(false); setReplyContent(""); }}
                        disabled={isSubmittingReply}
                        className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyContent.trim() || isSubmittingReply}
                        className="px-5 py-2 text-sm font-medium bg-accent text-white hover:bg-accent-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-slate-600"
                      >
                        {isSubmittingReply ? "Đang gửi..." : "Gửi"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
