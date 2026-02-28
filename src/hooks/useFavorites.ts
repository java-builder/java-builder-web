import { useState, useEffect, useCallback } from "react";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteResponse, FavoriteTargetType } from "@/types/favorite";
import toast from "react-hot-toast";

export const useFavorites = (page: number = 1, size: number = 12, targetType?: FavoriteTargetType) => {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchFavorites = useCallback(async (pageNum: number = page) => {
    try {
      setIsLoading(true);
      const result = await favoriteService.getMyFavorites(pageNum, size, targetType);
      if (result.data) {
        setFavorites(result.data.data || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalElements(result.data.totalElements || 0);
        setCurrentPage(pageNum);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách yêu thích");
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, targetType]);

  useEffect(() => {
    fetchFavorites(page);
  }, [fetchFavorites, page]);

  const refetch = () => {
    fetchFavorites(currentPage);
  };

  return {
    favorites,
    isLoading,
    currentPage,
    totalPages,
    totalElements,
    fetchFavorites,
    refetch,
  };
};
