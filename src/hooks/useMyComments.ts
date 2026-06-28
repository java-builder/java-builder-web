import { useState, useEffect, useCallback } from "react";
import { commentApi } from "@/services/comment.service";
import { CommentDetailResponse } from "@/types/comment";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

export const useMyComments = (
  page: number = 1,
  size: number = 10,
  targetType?: "BLOG" | "LESSON" | "POST" | "QUESTION" | "DOCS"
) => {
  const { t } = useI18n();
  const [comments, setComments] = useState<CommentDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchComments = useCallback(async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await commentApi.getMyComments({
        page: pageNum,
        size,
        targetType,
      });
      if (response.data) {
        setComments(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
        setCurrentPage(pageNum);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error(t("favoritesPage.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [size, t, targetType]);

  useEffect(() => {
    fetchComments(page);
  }, [fetchComments, page]);

  const refetch = () => {
    fetchComments(currentPage);
  };

  return {
    comments,
    isLoading,
    currentPage,
    totalPages,
    totalElements,
    fetchComments,
    refetch,
  };
};
