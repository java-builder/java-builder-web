import { useState, useCallback } from "react";
import { CommentResponse } from "@/types/comment";
import { commentApi } from "@/services/comment.service";

export const useLessonComments = (lessonId: string) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadRootComments = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await commentApi.getRootByLessonId(lessonId, {
          page,
          size: 10,
        });

        if (!response.data?.data || !Array.isArray(response.data.data)) {
          if (!append) setComments([]);
          setHasMore(false);
          return;
        }

        const commentsData: CommentResponse[] = response.data.data.map((comment) => ({
          id: comment.id,
          content: comment.content,
          username: comment.username,
          avatar: comment.avatar,
          createdAt: comment.createdAt,
          replies: [],
          repliesCount: comment.repliesCount || 0,
        }));

        if (append) {
          setComments((prev) => [...prev, ...commentsData]);
        } else {
          setComments(commentsData);
        }

        setHasMore(response.data.currentPage < response.data.totalPages);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error loading lesson comments:", err);
        if (!append) setComments([]);
      } finally {
        setIsLoading(false);
      }
    },
    [lessonId]
  );

  const loadReplies = useCallback(async (commentId: string) => {
    try {
      const response = await commentApi.getRepliesByParentId(commentId, {
        page: 1,
        size: 10,
      });

      const replies: CommentResponse[] = (response.data?.data || []).map((reply) => ({
        id: reply.id,
        content: reply.content,
        username: reply.username,
        avatar: reply.avatar,
        createdAt: reply.createdAt,
      }));

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, replies } : comment
        )
      );
    } catch (err) {
      console.error("Error loading replies:", err);
      throw err;
    }
  }, []);

  const addComment = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        throw new Error("Nội dung bình luận không được để trống");
      }

      try {
        setIsSubmitting(true);
        const response = await commentApi.create({
          targetId: lessonId,
          targetType: "LESSON",
          content: content.trim(),
        });

        const newComment: CommentResponse = {
          id: response.data!.id,
          content: response.data!.content,
          username: response.data!.username,
          avatar: response.data!.avatar,
          createdAt: response.data!.createdAt,
          replies: [],
          repliesCount: response.data!.repliesCount || 0,
        };

        setComments((prev) => [newComment, ...prev]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [lessonId]
  );

  const replyToComment = useCallback(
    async (commentId: string, content: string) => {
      if (!content.trim()) {
        throw new Error("Nội dung trả lời không được để trống");
      }

      const response = await commentApi.create({
        targetId: lessonId,
        targetType: "LESSON",
        parentId: commentId,
        content: content.trim(),
      });

      const newReply: CommentResponse = {
        id: response.data!.id,
        content: response.data!.content,
        username: response.data!.username,
        avatar: response.data!.avatar,
        createdAt: response.data!.createdAt,
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply],
                repliesCount: (comment.repliesCount || 0) + 1,
              }
            : comment
        )
      );
    },
    [lessonId]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      await commentApi.delete(commentId);

      setComments((prev) => {
        const filteredComments = prev.filter((comment) => comment.id !== commentId);

        if (filteredComments.length === prev.length) {
          return prev.map((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              const updatedReplies = comment.replies.filter((reply) => reply.id !== commentId);
              if (updatedReplies.length !== comment.replies.length) {
                return {
                  ...comment,
                  replies: updatedReplies,
                  repliesCount: Math.max(0, (comment.repliesCount || 0) - 1),
                };
              }
            }
            return comment;
          });
        }

        return filteredComments;
      });
    },
    []
  );

  const loadMoreComments = useCallback(async () => {
    if (hasMore && !isLoading) {
      await loadRootComments(currentPage + 1, true);
    }
  }, [hasMore, isLoading, currentPage, loadRootComments]);

  return {
    comments,
    isLoading,
    isSubmitting,
    hasMore,
    loadRootComments,
    loadReplies,
    addComment,
    replyToComment,
    deleteComment,
    loadMoreComments,
  };
};
