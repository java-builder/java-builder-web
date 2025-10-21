'use client';

import { useState } from 'react';
import { formatApiDateOnly } from '@/utils/dateUtils';
import { Comment } from '@/types/comment';

interface CommentItemProps {
    comment: Comment;
    onLike?: (commentId: string) => void;
    onReply?: (commentId: string, content: string) => void;
    onDelete?: (commentId: string) => void;
    isOwner?: boolean;
}

export default function CommentItem({
    comment,
    onLike,
    onReply,
    onDelete,
    isOwner = false
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const handleReply = async () => {
        if (replyContent.trim() && onReply) {
            setIsSubmittingReply(true);
            try {
                await onReply(comment.id, replyContent.trim());
                setReplyContent('');
                setShowReplyForm(false);
            } finally {
                setIsSubmittingReply(false);
            }
        }
    };

    return (
        <div className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {comment.author.charAt(0).toUpperCase()}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
                                    {formatApiDateOnly(comment.createdAt)}
                                </time>
                            </div>
                            {isOwner && onDelete && (
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 mt-2 ml-3">
                        <button
                            onClick={() => onLike?.(comment.id)}
                            className={`flex items-center space-x-1 text-xs transition-colors ${comment.isLiked
                                ? 'text-red-500 hover:text-red-600'
                                : 'text-gray-500 hover:text-red-500'
                                }`}
                        >
                            <svg className="w-4 h-4" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{comment.likeCount}</span>
                        </button>

                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>Trả lời</span>
                        </button>
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3 ml-3">
                            <div className="flex items-start space-x-2">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Viết trả lời..."
                                    className="flex-1 p-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                    rows={2}
                                    maxLength={300}
                                    disabled={isSubmittingReply}
                                />
                                <div className="flex flex-col space-y-1">
                                    <button
                                        onClick={handleReply}
                                        disabled={!replyContent.trim() || isSubmittingReply}
                                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs"
                                    >
                                        {isSubmittingReply ? 'Gửi...' : 'Gửi'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReplyForm(false);
                                            setReplyContent('');
                                        }}
                                        className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-xs"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                        {reply.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-semibold text-gray-900 text-xs">{reply.author}</span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <time className="text-xs text-gray-500" dateTime={reply.createdAt}>
                                                    {formatApiDateOnly(reply.createdAt)}
                                                </time>
                                            </div>
                                            <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap">
                                                {reply.content}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3 mt-1 ml-2">
                                            <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <span>{reply.likeCount || 0}</span>
                                            </button>
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
