'use client';

import { useState } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { Comment } from '@/types/comment';

interface CommentListProps {
    comments: Comment[];
    onAddComment: (content: string) => void;
    onLikeComment: (commentId: string) => void;
    onReplyComment: (commentId: string, content: string) => void;
    onDeleteComment: (commentId: string) => void;
    isLoading?: boolean;
    isSubmitting?: boolean;
}

export default function CommentList({
    comments,
    onAddComment,
    onLikeComment,
    onReplyComment,
    onDeleteComment,
    isLoading = false,
    isSubmitting = false
}: CommentListProps) {
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

    const sortedComments = [...comments].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'popular':
                return b.likeCount - a.likeCount;
            default:
                return 0;
        }
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Bình luận ({comments.length})
                </h3>

                {comments.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Sắp xếp:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="popular">Phổ biến</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Comment Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <CommentForm
                    onSubmit={onAddComment}
                    isSubmitting={isSubmitting}
                />
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có bình luận nào</h4>
                    <p className="text-gray-500">Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onLike={onLikeComment}
                            onReply={onReplyComment}
                            onDelete={onDeleteComment}
                        />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {comments.length > 0 && (
                <div className="text-center">
                    <button className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                        Xem thêm bình luận
                    </button>
                </div>
            )}
        </div>
    );
}
