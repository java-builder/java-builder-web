import { useState, useEffect } from "react";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { authApi } from "@/services/auth.service";

export function useBlogFavorite(blogId: string | undefined) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!blogId) return;

    const checkFavorite = async () => {
      if (!authApi.isAuthenticated()) return;
      try {
        const result = await favoriteService.check(blogId, FavoriteTargetType.BLOG);
        if (result && result.data !== undefined) {
          setIsFavorite(result.data);
        }
      } catch {}
    };
    checkFavorite();
  }, [blogId]);

  const handleFavoriteToggle = (newFavoriteState: boolean) => {
    setIsFavorite(newFavoriteState);
    setFavoriteLoading(false);
  };

  return {
    isFavorite,
    favoriteLoading,
    handleFavoriteToggle,
  };
}
