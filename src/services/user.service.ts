import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  UserDetailResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/types/user";
import toast from "react-hot-toast";

export interface UserSearchParams {
  page?: number;
  search?: string;
}

export const userApi = {
  create: async (data: CreateUserRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<CreateUserResponse>>(
        "/api/v1/users",
        data,
      );
      toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      return response.data;
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  search: async (params: UserSearchParams) => {
    const queryParams: Record<string, string | number> = {
      page: params.page || 1,
    };

    try {
      const response = await apiClient.post<
        ApiResponse<PageResponse<UserDetailResponse>>
      >("/api/v1/users/search", {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
      }
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<UserDetailResponse>>(
      `/api/v1/users/${id}`,
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response =
      await apiClient.get<ApiResponse<UserDetailResponse>>("/api/v1/users/me");
    return response.data;
  },

  update: async (id: string, data: Partial<UserDetailResponse>) => {
    try {
      const response = await apiClient.put<ApiResponse<UserDetailResponse>>(
        `/api/v1/users/${id}`,
        data,
      );
      toast.success("Cập nhật thông tin thành công!");
      return response.data;
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/v1/users/${id}`,
      );
      toast.success("Xóa tài khoản thành công!");
      return response.data;
    } catch (error) {
      toast.error("Xóa tài khoản thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    try {
      const response = await apiClient.put<ApiResponse<UpdateProfileResponse>>(
        "/api/v1/profiles",
        data,
      );
      toast.success("Cập nhật thông tin cá nhân thành công!");
      return response.data;
    } catch (error) {
      toast.error("Cập nhật thông tin cá nhân thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  updateAvatar: async (avatar: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await apiClient.put<ApiResponse<string>>(
        "/api/v1/profiles/update-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Cập nhật ảnh đại diện thành công!");
      return response.data;
    } catch (error) {
      toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  getAllUsers: async (page: number = 1, size: number = 50) => {
    const response = await apiClient.post<
      ApiResponse<PageResponse<UserDetailResponse>>
    >("/api/v1/users/search", null, {
      params: { page, size },
    });
    return response.data;
  },
};
