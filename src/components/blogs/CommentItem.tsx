'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatApiDateOnly } from '@/utils/dateUtils';
import { CommentDetailResponse } from '@/types/comment';

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
    expandReplyId
}: CommentItemProps) {
    console.log('CommentItem rendered for comment:', comment.id, 'onDelete exists:', !!onDelete);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showReplies, setShowReplies] = useState(!!expandReplyId);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [showReplyMenu, setShowReplyMenu] = useState<{ [key: string]: boolean }>({});

    const handleReply = async () => {
        if (replyContent.trim() && onReply) {
            setIsSubmittingReply(true);
            try {
                await onReply(comment.id, replyContent.trim());
                setReplyContent('');
                setShowReplyForm(false);

                setShowReplies(true);

                if (onLoadReplies && (!comment.replies || comment.replies.length === 0)) {
                    try {
                        await onLoadReplies(comment.id);
                    } catch (err) {
                        console.error('Error loading replies after creating new reply:', err);
                    }
                }
            } finally {
                setIsSubmittingReply(false);
            }
        }
    };

    const handleDelete = async (commentId: string) => {
        console.log('🗑️ DELETING COMMENT:', commentId);

        if (!onDelete) {
            console.error('❌ onDelete function not provided');
            return;
        }

        try {
            await onDelete(commentId);
            setShowMenu(false);
            setShowReplyMenu({});
        } catch (error) {
            console.error('❌ Delete failed:', error);
        }
    };

    const handleLoadReplies = async () => {
        if (!showReplies && onLoadReplies) {
            setIsLoadingReplies(true);
            try {
                await onLoadReplies(comment.id);
                setShowReplies(true);
            } catch (err) {
                console.error('Error loading replies:', err);
            } finally {
                setIsLoadingReplies(false);
            }
        } else {
            setShowReplies(!showReplies);
        }
    };

    const toggleReplyMenu = (replyId: string) => {
        setShowReplyMenu(prev => ({
            ...prev,
            [replyId]: !prev[replyId]
        }));
    };

    // If deep-linking to a reply, ensure replies are expanded when data arrives
    useEffect(() => {
        if (expandReplyId) {
            setShowReplies(true);
        }
    }, [expandReplyId]);

    return (
        <div id={`comment-${comment.id}`} className="border-b border-gray-100 pb-6 last:border-b-0 scroll-mt-24">
            <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg ring-2 ring-blue-100">
                    {comment.avatar ? (
                        <Image
                            src={comment.avatar}
                            alt={comment.username}
                            width={40}
                            height={40}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        comment.username.charAt(0).toUpperCase()
                    )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-gray-900 text-sm">{comment.username}</span>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <time className="text-xs text-gray-500 font-medium" dateTime={comment.createdAt}>
                                    {formatApiDateOnly(comment.createdAt)}
                                </time>
                            </div>

                            {/* Menu for root comment - Đơn giản */}
                            {onDelete && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Xóa</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-6 mt-3 ml-2">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center space-x-2 text-xs text-gray-500 hover:text-orange-500 transition-colors duration-200 font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>Trả lời</span>
                        </button>

                        {repliesCount > 0 && (
                            <button
                                onClick={handleLoadReplies}
                                disabled={isLoadingReplies}
                                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-50"
                            >
                                {isLoadingReplies ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang tải...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span>
                                            {showReplies ? 'Ẩn phản hồi' : `Xem tất cả ${repliesCount} phản hồi`}
                                        </span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>


                    {/* Replies */}
                    {showReplies && comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} id={`comment-${reply.id}`} className="flex items-start space-x-2 scroll-mt-24">
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                        {reply.avatar ? (
                                            <Image
                                                src={reply.avatar}
                                                alt={reply.username}
                                                width={24}
                                                height={24}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            reply.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-gray-900 text-xs">{reply.username}</span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <time className="text-xs text-gray-500" dateTime={reply.createdAt}>
                                                        {formatApiDateOnly(reply.createdAt)}
                                                    </time>
                                                </div>

                                                {/* Menu for reply - Đơn giản */}
                                                {onDelete && (
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => toggleReplyMenu(reply.id)}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                            </svg>
                                                        </button>

                                                        {showReplyMenu[reply.id] && (
                                                            <div className="absolute right-0 top-6 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                                                <button
                                                                    onClick={() => handleDelete(reply.id)}
                                                                    className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    <span>Xóa</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap">
                                                {reply.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reply Form - Hiển thị ở dưới cùng */}
                    {showReplyForm && (
                        <div className="mt-4">
                            <div className="flex items-start space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="relative">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Viết trả lời..."
                                            className={`w-full p-2 border rounded resize-none focus:ring-1 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 text-sm ${replyContent.length >= 250
                                                ? 'border-red-300 bg-red-50'
                                                : replyContent.length > 200
                                                    ? 'border-yellow-300 bg-yellow-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                            rows={2}
                                            maxLength={250}
                                            disabled={isSubmittingReply}
                                        />

                                        {/* Character Counter */}
                                        <div className={`absolute bottom-1 right-1 text-xs px-1 py-0.5 rounded ${replyContent.length >= 250
                                            ? 'bg-red-100 text-red-600'
                                            : replyContent.length > 200
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {replyContent.length}/250
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end space-x-1 mt-1">
                                        <button
                                            onClick={() => {
                                                setShowReplyForm(false);
                                                setReplyContent('');
                                            }}
                                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                                        >
                                            Hủy
                                        </button>

                                        <button
                                            onClick={handleReply}
                                            disabled={!replyContent.trim() || isSubmittingReply || replyContent.length >= 250}
                                            className={`px-3 py-1 rounded text-xs transition-all duration-200 flex items-center space-x-1 ${!replyContent.trim() || isSubmittingReply || replyContent.length >= 250
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                                }`}
                                        >
                                            {isSubmittingReply ? (
                                                <>
                                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Gửi...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                                                    </svg>
                                                    <span>Gửi</span>
                                                </>
                                            )}
                                        </button>
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