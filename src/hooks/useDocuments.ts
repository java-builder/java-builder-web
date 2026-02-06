import { useQuery } from "@tanstack/react-query";
import { documentApi } from "@/services/document.service";
import { Document } from "@/types/document";
import { ApiResponse, PageResponse } from "@/types/api";

interface UseDocumentsOptions {
  page?: number;
  size?: number;
  enabled?: boolean;
}

export const useDocuments = (options: UseDocumentsOptions = {}) => {
  const { page = 1, size = 10, enabled = true } = options;

  return useQuery<ApiResponse<PageResponse<Document>>>({
    queryKey: ["documents", page, size],
    queryFn: () => documentApi.getAll({ page, size }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useFeaturedDocuments = () => {
  return useDocuments({ page: 1, size: 6 });
};
