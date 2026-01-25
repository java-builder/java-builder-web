import { useState, useCallback, useEffect } from "react";
import { CommentResponse } from "@/types/comment";
import { commentApi } from "@/services/comment.service";

export const useComments = (blogId: string) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load root comments
  const loadRootComments = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await commentApi.getRootByBlogId(blogId, {
          page,
          size: 10,
        });

        if (
          !response.data?.data ||
          !Array.isArray(response.data.data)
        ) {
          if (append) {
            setComments((prev) => prev);
          } else {
            setComments([]);
          }
          setHasMore(false);
          return;
        }

        const commentsData: CommentResponse[] =
          response.data.data.map((comment) => ({
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
        console.error("Error loading root comments:", err);
        if (!append) {
          setComments([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [blogId],
  );

  // Auto-fetch root comments when blogId (targetId) changes.
  useEffect(() => {
    if (!blogId) {
      setComments([]);
      setHasMore(true);
      setCurrentPage(1);
      return;
    }

    // Trigger initial load for new blogId
    loadRootComments(1, false).catch(() => {});
  }, [blogId, loadRootComments]);

  // Load replies for a specific comment
  const loadReplies = useCallback(async (commentId: string) => {
    try {
      const response = await commentApi.getRepliesByParentId(commentId, {
        page: 1,
        size: 10,
      });

      const replies: CommentResponse[] = (
        response.data?.data || []
      ).map((reply) => ({
        id: reply.id,
        content: reply.content,
        username: reply.username,
        avatar: reply.avatar,
        createdAt: reply.createdAt,
      }));

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, replies } : comment,
        ),
      );
    } catch (err) {
      console.error("Error loading replies:", err);
      throw err;
    }
  }, []);

  // Add new comment
  const addComment = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        throw new Error("Nội dung bình luận không được để trống");
      }

      try {
        setIsSubmitting(true);
        const response = await commentApi.create({
          targetId: blogId,
          targetType: "BLOG",
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
      } catch (err) {
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [blogId],
  );

  // Reply to comment
  const replyToComment = useCallback(
    async (commentId: string, content: string) => {
      if (!content.trim()) {
        throw new Error("Nội dung trả lời không được để trống");
      }

      try {
        const response = await commentApi.create({
          targetId: blogId,
          targetType: "BLOG",
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
              : comment,
          ),
        );
      } catch (err) {
        throw err;
      }
    },
    [blogId],
  );

  // Delete comment (root or reply)
  const deleteComment = useCallback(
    async (commentId: string) => {
      console.log("useComments deleteComment called with:", commentId);
      console.log("Current comments before deletion:", comments);

      try {
        console.log("Calling API to delete comment:", commentId);
        await commentApi.delete(commentId);
        console.log("API delete successful, updating state...");

        setComments((prev) => {
          console.log("Previous comments state:", prev);

          // Tìm và xóa comment gốc
          const filteredComments = prev.filter(
            (comment) => comment.id !== commentId,
          );
          console.log("After filtering root comments:", filteredComments);

          // Nếu không tìm thấy comment gốc, tìm và xóa reply
          if (filteredComments.length === prev.length) {
            console.log("Root comment not found, searching for reply...");
            const updatedComments = prev.map((comment) => {
              if (comment.replies && comment.replies.length > 0) {
                const updatedReplies = comment.replies.filter(
                  (reply) => reply.id !== commentId,
                );
                if (updatedReplies.length !== comment.replies.length) {
                  console.log("Found reply to delete in comment:", comment.id);
                  return {
                    ...comment,
                    replies: updatedReplies,
                    repliesCount: Math.max(0, (comment.repliesCount || 0) - 1),
                  };
                }
              }
              return comment;
            });
            console.log(
              "Updated comments after reply deletion:",
              updatedComments,
            );
            return updatedComments;
          }

          console.log(
            "Updated comments after root deletion:",
            filteredComments,
          );
          return filteredComments;
        });
      } catch (err) {
        console.error("Error deleting comment:", err);
        throw err;
      }
    },
    [comments],
  );

  // Load more comments
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
