import { useEffect, useRef } from "react";
import { CommentResponse, CommentDetailResponse } from "@/types/comment";
import { ApiResponse } from "@/types/api";

export function useScrollToHash(
  isLoadingComments: boolean, 
  comments: CommentResponse[],
  loadReplies: (commentId: string) => void,
  loadMoreComments: () => Promise<void>,
  hasMore: boolean,
  getCommentById: (id: string) => Promise<ApiResponse<CommentDetailResponse>>
) {
  const hasScrolledRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    if (isLoadingComments || comments.length === 0 || hasScrolledRef.current) return;

    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#comment-')) return;
    
    const commentId = hash.replace('#comment-', '');
    
    const scrollToTarget = () => {
      const targetEl = document.getElementById(`comment-${commentId}`);
      if (targetEl) {
        hasScrolledRef.current = true;
        
        targetEl.classList.add('highlight-comment');
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        
        setTimeout(() => {
          targetEl.classList.remove('highlight-comment');
        }, 2000);
        
        return true;
      }
      return false;
    };

    if (scrollToTarget()) return;

    const handleScroll = async () => {
      try {
        const response = await getCommentById(commentId);
        const targetComment = response.data;

        if (!targetComment) return;

        if (targetComment.parentComment) {
          const parentId = targetComment.parentComment.id;
          const parentExists = comments.some(c => c.id === parentId);
          
          if (parentExists) {
            loadReplies(parentId);
            setTimeout(() => scrollToTarget(), 600);
          } else if (hasMore && !isLoadingMoreRef.current) {
            isLoadingMoreRef.current = true;
            await loadMoreComments();
            isLoadingMoreRef.current = false;
          }
        } else {
          if (hasMore && !isLoadingMoreRef.current) {
            isLoadingMoreRef.current = true;
            await loadMoreComments();
            isLoadingMoreRef.current = false;
          }
        }
      } catch (error) {
        console.error('Failed to load comment:', error);
      }
    };

    handleScroll();
  }, [isLoadingComments, comments, loadReplies, loadMoreComments, hasMore, getCommentById]);
}
