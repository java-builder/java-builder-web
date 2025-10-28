import { useState, useCallback } from 'react';
import { CommentDetailResponse } from '@/types/comment';
import { commentApi } from '@/services/comment.service';

export const useComments = (blogId: string) => {
    const [comments, setComments] = useState<CommentDetailResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadComments = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            setIsLoading(true);
            const response = await commentApi.getRootByBlogId(blogId, { page, size: 10 });

            // Debug logging
            console.log('Comment API Response:', response);

            // Ensure response.result exists and is an array
            if (!response.result?.result || !Array.isArray(response.result.result)) {
                console.warn('Invalid response structure:', response);
                if (append) {
                    setComments(prev => prev);
                } else {
                    setComments([]);
                }
                setHasMore(false);
                return;
            }

            const commentsData: CommentDetailResponse[] = await Promise.all(
                response.result.result.map(async (comment) => {
                    try {
                        // Load replies for each comment
                        const repliesResponse = await commentApi.getRepliesByParentId(comment.id, { page: 1, size: 5 });
                        const replies: CommentDetailResponse[] = (repliesResponse.result?.result || []).map(reply => ({
                            id: reply.id,
                            content: reply.content,
                            username: reply.username,
                            avatar: reply.avatar,
                            createdAt: reply.createdAt
                        }));

                        return {
                            id: comment.id,
                            content: comment.content,
                            username: comment.username,
                            avatar: comment.avatar,
                            createdAt: comment.createdAt,
                            replies
                        };
                    } catch (replyErr) {
                        console.error('Error loading replies for comment:', comment.id, replyErr);
                        // Return comment without replies if replies fail to load
                        return {
                            id: comment.id,
                            content: comment.content,
                            username: comment.username,
                            avatar: comment.avatar,
                            createdAt: comment.createdAt,
                            replies: []
                        };
                    }
                })
            );

            if (append) {
                setComments(prev => [...prev, ...commentsData]);
            } else {
                setComments(commentsData);
            }

            setHasMore(response.result.currentPages < response.result.totalPages);
            setCurrentPage(page);
        } catch (err) {
            console.error('Error loading comments:', err);
            // Set empty array on error to prevent UI issues
            if (!append) {
                setComments([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [blogId]);

    const addComment = useCallback(async (content: string) => {
        if (!content.trim()) {
            throw new Error('Nội dung bình luận không được để trống');
        }

        try {
            setIsSubmitting(true);
            const response = await commentApi.create({
                blogId,
                content: content.trim()
            });

            const newComment: CommentDetailResponse = {
                id: response.result!.id,
                content: response.result!.content,
                username: response.result!.username,
                avatar: response.result!.avatar,
                createdAt: response.result!.createdAt,
                replies: []
            };
            setComments(prev => [newComment, ...prev]);
        } catch (err) {
            console.error('Error adding comment:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [blogId]);

    const replyToComment = useCallback(async (commentId: string, content: string) => {
        if (!content.trim()) {
            throw new Error('Nội dung trả lời không được để trống');
        }

        try {
            const response = await commentApi.create({
                blogId,
                parentId: commentId,
                content: content.trim()
            });

            const newReply: CommentDetailResponse = {
                id: response.result!.id,
                content: response.result!.content,
                username: response.result!.username,
                avatar: response.result!.avatar,
                createdAt: response.result!.createdAt
            };

            setComments(prev => prev.map(comment =>
                comment.id === commentId
                    ? { ...comment, replies: [...(comment.replies || []), newReply] }
                    : comment
            ));
        } catch (err) {
            console.error('Error replying to comment:', err);
            throw err;
        }
    }, [blogId]);

    const deleteComment = useCallback(async (commentId: string) => {
        try {
            await commentApi.delete(commentId);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
            throw err;
        }
    }, []);

    const loadMoreComments = useCallback(async () => {
        if (hasMore && !isLoading) {
            await loadComments(currentPage + 1, true);
        }
    }, [hasMore, isLoading, currentPage, loadComments]);

    return {
        comments,
        isLoading,
        isSubmitting,
        hasMore,
        loadComments,
        addComment,
        replyToComment,
        deleteComment,
        loadMoreComments
    };
};
