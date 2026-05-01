import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { API } from "@/api/api";

export const aiTrainingApi = {
  ingestMarkdown: async (file: File) => {
    const formData = new FormData();
    formData.append("markdown", file);

    const response = await apiClient.post<ApiResponse<string>>(
      API.AI_TRAINING_INGEST_MARKDOWN,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
