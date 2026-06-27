import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";
import {
  EmailTemplateResponse,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from "@/types/email-template";

export const emailTemplateService = {
  getAllEmailTemplates: async () => {
    const response = await apiClient.get<ApiResponse<EmailTemplateResponse[]>>(
      API.EMAIL_TEMPLATES,
    );
    return response.data;
  },

  getTemplateByTemplateName: async (templateName: string) => {
    const response = await apiClient.get<ApiResponse<EmailTemplateResponse>>(
      `${API.EMAIL_TEMPLATES}/${templateName}`,
    );
    return response.data;
  },

  createEmailTemplate: async (request: CreateEmailTemplateRequest) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.EMAIL_TEMPLATES,
      request,
    );
    return response.data;
  },

  updateEmailTemplate: async (templateName: string, request: UpdateEmailTemplateRequest) => {
    const response = await apiClient.put<ApiResponse<void>>(
      `${API.EMAIL_TEMPLATES}/${templateName}`,
      request,
    );
    return response.data;
  },

  deleteTemplate: async (templateName: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.EMAIL_TEMPLATES}/${templateName}`,
    );
    return response.data;
  },
};
