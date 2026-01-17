import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";

import {
  Document,
  DocumentType,
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from "@/types/document";
import { API } from "@/api/api";

export interface DocumentSearchParams {
  keyword?: string;
  type?: DocumentType;
  page?: number;
  size?: number;
}

export const documentApi = {
  getAll: async (params: DocumentSearchParams = {}) => {
    const response = await apiClient.get<ApiResponse<PageResponse<Document>>>(
      API.SEARCH_DOCUMENTS,
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
      `${API.GET_DOCUMENT_BY_ID}/${id}`
    );
    return response.data;
  },

  create: async (data: CreateDocumentRequest) => {
    const response = await apiClient.post<ApiResponse<Document>>(
      API.CREATE_DOCUMENT,
      data
    );
    return response.data;
  },

  update: async (id: string, data: UpdateDocumentRequest) => {
    const response = await apiClient.put<ApiResponse<Document>>(
      `${API.UPDATE_DOCUMENT}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_DOCUMENT}/${id}`
    );
    return response.data;
  },
};
