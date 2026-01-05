import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  Document,
  DocumentType,
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from "@/types/document";

export interface DocumentSearchParams {
  keyword?: string;
  type?: DocumentType;
  page?: number;
  size?: number;
}

export const documentApi = {
  getAll: async (params: DocumentSearchParams = {}) => {
    const response = await apiClient.get<ApiResponse<PageResponse<Document>>>(
      "/api/v1/documents",
      {
        params: {
          keyword: params.keyword || undefined,
          type: params.type || undefined,
          page: params.page || 1,
          size: params.size || 10,
        },
      }
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Document>>(
      `/api/v1/documents/${id}`
    );
    return response.data;
  },

  create: async (data: CreateDocumentRequest) => {
    const response = await apiClient.post<ApiResponse<Document>>(
      "/api/v1/documents",
      data
    );
    return response.data;
  },

  update: async (id: string, data: UpdateDocumentRequest) => {
    const response = await apiClient.put<ApiResponse<Document>>(
      `/api/v1/documents/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/documents/${id}`
    );
    return response.data;
  },
};
