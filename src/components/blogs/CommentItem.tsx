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
        <div id={`comment-${comment.id}`} className="pb-6 last:pb-0 scroll-mt-24">
            <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
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
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
                                <span className="font-bold text-gray-900 text-sm sm:text-base">{comment.username}</span>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <time className="text-xs text-gray-500 font-medium whitespace-nowrap" dateTime={comment.createdAt}>
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

                        <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 mt-3">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-200 ${
                                showReplyForm 
                                    ? 'bg-orange-50 text-orange-600 border-orange-300' 
                                    : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>Trả lời</span>
                        </button>

                        {repliesCount > 0 && (
                            <button
                                onClick={handleLoadReplies}
                                disabled={isLoadingReplies}
                                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border border-gray-300 hover:border-orange-300 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingReplies ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang tải...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span>
                                            {showReplies ? (
                                                <>
                                                    Ẩn phản hồi
                                                    <svg className="w-3 h-3 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </>
                                            ) : (
                                                <>
                                                    Xem {repliesCount} phản hồi
                                                    <svg className="w-3 h-3 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </>
                                            )}
                                        </span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>


                    {/* Replies */}
                    {showReplies && comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-3 border-l border-gray-200 pl-4">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} id={`comment-${reply.id}`} className="flex items-start space-x-2 scroll-mt-24">
                                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                                        {reply.avatar ? (
                                            <Image
                                                src={reply.avatar}
                                                alt={reply.username}
                                                width={28}
                                                height={28}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            reply.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2 flex-wrap">
                                                    <span className="font-semibold text-gray-900 text-xs sm:text-sm">{reply.username}</span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <time className="text-xs text-gray-500 whitespace-nowrap" dateTime={reply.createdAt}>
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
                                            <p className="text-gray-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
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
                        <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start space-x-2">
                                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
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
                                            className={`w-full p-2 border rounded-lg resize-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm placeholder-gray-400 ${replyContent.length >= 250
                                                ? 'border-red-300 bg-red-50'
                                                : replyContent.length > 200
                                                    ? 'border-yellow-300 bg-yellow-50'
                                                    : 'border-gray-300 bg-white'
                                                }`}
                                            rows={2}
                                            maxLength={250}
                                            disabled={isSubmittingReply}
                                        />

                                        {/* Character Counter */}
                                        <div className={`absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded ${replyContent.length >= 250
                                            ? 'bg-red-100 text-red-600'
                                            : replyContent.length > 200
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {replyContent.length}/250
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end space-x-2 mt-2">
                                        <button
                                            onClick={() => {
                                                setShowReplyForm(false);
                                                setReplyContent('');
                                            }}
                                            className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            Hủy
                                        </button>

                                        <button
                                            onClick={handleReply}
                                            disabled={!replyContent.trim() || isSubmittingReply || replyContent.length >= 250}
                                            className={`px-3 py-1 rounded text-xs transition-colors ${!replyContent.trim() || isSubmittingReply || replyContent.length >= 250
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                                }`}
                                        >
                                            {isSubmittingReply ? (
                                                <span className="flex items-center space-x-1">
                                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Đang gửi...</span>
                                                </span>
                                            ) : (
                                                'Gửi'
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