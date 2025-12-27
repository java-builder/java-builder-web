import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  CreateCourseRequest,
  CreateCourseResponse,
  CourseDetailResponse,
  CourseLevel,
} from "@/types/course";
import { FileMetaDataResponse } from "@/types/course";
import toast from "react-hot-toast";

export const courseApi = {
  // Tạo khóa học mới
  create: async (data: CreateCourseRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<CreateCourseResponse>>(
        "/api/v1/courses",
        data,
      );
      toast.success("Tạo khóa học thành công!");
      return response.data;
    } catch (error) {
      toast.error("Tạo khóa học thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Lấy danh sách khóa học
  getCourses: async (
    page: number = 1,
    size: number = 10,
    title?: string,
    level?: CourseLevel,
  ) => {
    try {
      const params: Record<string, string | number> = { page, size };

      if (title) {
        params.title = title;
      }

      if (level) {
        params.level = level;
      }

      const response = await apiClient.get<
        ApiResponse<PageResponse<CourseDetailResponse>>
      >("/api/v1/courses", { params });
      return response.data;
    } catch (error) {
      toast.error("Lấy danh sách khóa học thất bại.");
      throw error;
    }
  },

  // Lấy chi tiết khóa học
  getById: async (id: string) => {
    try {
      const response = await apiClient.get<ApiResponse<CourseDetailResponse>>(
        `/api/v1/courses/${id}`,
      );
      return response.data;
    } catch (error) {
      toast.error("Lấy thông tin khóa học thất bại.");
      throw error;
    }
  },
};

export const fileApi = {
  // Upload ảnh đơn
  uploadSingleMedia: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<ApiResponse<FileMetaDataResponse>>(
        "/api/v1/files/upload-single-media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Upload ảnh thành công!");
      return response.data;
    } catch (error) {
      toast.error("Upload ảnh thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};
