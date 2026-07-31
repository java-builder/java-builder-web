import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { API } from "@/api/api";
import {
  UserDetailResponse,
  ProfileDetailResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  PasswordStatusResponse,
  CreatePasswordRequest,
  UserStatisticsResponse,
} from "@/types/user";


export interface UserSearchParams {
  page?: number;
  search?: string;
}

export const userApi = {
  create: async (data: CreateUserRequest) => {
    const response = await apiClient.post<ApiResponse<CreateUserResponse>>(
      API.CREATE_USER,
      data,
    );
    return response.data;
  },

  search: async (params: UserSearchParams) => {
    const queryParams: Record<string, string | number | string[]> = {
      page: params.page || 1,
      size: 20,
    };

    if (params.search && params.search.trim()) {
      const searchText = params.search.trim();
      queryParams.users = [
        `username~${searchText}|`,
        `email~${searchText}`
      ];
    }

    const response = await apiClient.post<
      ApiResponse<PageResponse<UserDetailResponse>>
    >(API.USER_SEARCH, null, {
      params: queryParams,
      paramsSerializer: {
        indexes: null,
      },
    });


    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<UserDetailResponse>>(
      `${API.GET_USER_BY_ID}/${id}`,
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response =
      await apiClient.get<ApiResponse<UserDetailResponse>>(API.USER_PROFILE);
    return response.data;
  },

  getProfileDetails: async () => {
    const response =
      await apiClient.get<ApiResponse<ProfileDetailResponse>>(API.USER_PROFILE_DETAILS);
    return response.data;
  },

  getDefaultAdminUser: async () => {
    const response =
      await apiClient.get<ApiResponse<UserDetailResponse>>(API.GET_DEFAULT_ADMIN_USER);
    return response.data;
  },

  update: async (id: string, data: Partial<UserDetailResponse>) => {
    const response = await apiClient.put<ApiResponse<UserDetailResponse>>(
      `${API.UPDATE_USER}/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_USER}/${id}`,
    );
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put<ApiResponse<UpdateProfileResponse>>(
      API.UPDATE_PROFILE,
      data,
    );
    return response.data;
  },

  updateProfileByAdmin: async (userId: string, data: UpdateProfileRequest) => {
    const response = await apiClient.put<ApiResponse<UpdateProfileResponse>>(
      `${API.UPDATE_PROFILE_BY_ADMIN}/${userId}`,
      data,
    );
    return response.data;
  },

  updateAvatar: async (avatar: File) => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const response = await apiClient.put<ApiResponse<string>>(
      API.USER_PROFILE_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  getAllUsers: async (page: number = 1, size: number = 50) => {
    const response = await apiClient.post<
      ApiResponse<PageResponse<UserDetailResponse>>
    >(API.USER_SEARCH, null, {
      params: { page, size },
    });
    return response.data;
  },

  getPasswordStatus: async () => {
    const response = await apiClient.post<ApiResponse<PasswordStatusResponse>>(
      API.USER_PASSWORD_STATUS
    );
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<UserStatisticsResponse>>(API.USER_STATISTICS);
    return response.data;
  },

  createPassword: async (data: CreatePasswordRequest) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.USER_PASSWORD,
      data
    );
    return response.data;
  },

  sendResetPasswordLink: async (email: string) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.USER_SEND_RESET_PASSWORD,
      { email }
    );
    return response.data;
  },

  resetPassword: async (secretCode: string, newPassword: string) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.USER_RESET_PASSWORD,
      { secretCode, newPassword }
    );
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.USER_CHANGE_PASSWORD,
      { oldPassword, newPassword }
    );
    return response.data;
  },

  assignRoles: async (userId: string, roleNames: string[]) => {
    const response = await apiClient.post<ApiResponse<void>>(
      `${API.GET_USER_BY_ID}/${userId}/roles`,
      { roleNames }
    );
    return response.data;
  },
};
