import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
  SkillSearchParams,
} from "@/types/skill";

export const skillService = {
  getSkills: async (params?: SkillSearchParams) => {
    const queryParams: Record<string, string | number> = {
      page: params?.page || 1,
      size: params?.size || 20,
    };

    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    const response = await apiClient.get<ApiResponse<PageResponse<Skill>>>(
      API.SKILLS,
      { params: queryParams }
    );
    return response.data;
  },

  getSkillById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Skill>>(
      `${API.SKILLS}/${id}`
    );
    return response.data;
  },

  createSkill: async (data: CreateSkillRequest) => {
    const response = await apiClient.post<ApiResponse<Skill>>(
      API.SKILLS,
      data
    );
    return response.data;
  },

  updateSkill: async (id: string, data: UpdateSkillRequest) => {
    const response = await apiClient.put<ApiResponse<Skill>>(
      `${API.SKILLS}/${id}`,
      data
    );
    return response.data;
  },

  deleteSkill: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.SKILLS}/${id}`
    );
    return response.data;
  },
};
