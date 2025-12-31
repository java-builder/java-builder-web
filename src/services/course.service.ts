import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  CreateCourseRequest,
  CreateCourseResponse,
  CourseDetailResponse,
  CourseLevel,
  CreateChapterRequest,
  CreateChapterResponse,
  UpdateChapterRequest,
  UpdateChapterResponse,
  CreateLessonRequest,
  CreateLessonResponse,
  LessonDetailResponse,
  FavoriteResponse,
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

export const chapterApi = {
  // Tạo chapter mới
  create: async (data: CreateChapterRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<CreateChapterResponse>>(
        "/api/v1/chapters",
        data,
      );
      return response.data;
    } catch (error) {
      toast.error("Tạo chương thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Cập nhật chapter
  update: async (data: UpdateChapterRequest) => {
    try {
      const response = await apiClient.put<ApiResponse<UpdateChapterResponse>>(
        "/api/v1/chapters",
        data,
      );
      return response.data;
    } catch (error) {
      toast.error("Cập nhật chương thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Xóa chapter
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/v1/chapters/${id}`,
      );
      return response.data;
    } catch (error) {
      toast.error("Xóa chương thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};

export const lessonApi = {
  // Tạo lesson mới
  create: async (data: CreateLessonRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<CreateLessonResponse>>(
        "/api/v1/lessons",
        data,
      );
      return response.data;
    } catch (error) {
      toast.error("Tạo bài học thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Lấy danh sách lessons theo chapterId
  getByChapterId: async (chapterId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<LessonDetailResponse[]>>(
        `/api/v1/lessons/chapter/${chapterId}`,
      );
      return response.data;
    } catch (error) {
      toast.error("Lấy danh sách bài học thất bại.");
      throw error;
    }
  },

  // Xóa lesson
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/v1/lessons/${id}`,
      );
      return response.data;
    } catch (error) {
      toast.error("Xóa bài học thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};

export const favoriteApi = {
  // Toggle favorite (add/remove)
  toggle: async (courseId: string) => {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(
        `/api/v1/favorites/toggle/${courseId}`,
      );
      return response.data;
    } catch (error) {
      toast.error("Thao tác thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Check if course is favorited
  check: async (courseId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `/api/v1/favorites/check/${courseId}`,
      );
      return response.data;
    } catch {
      return { code: 200, result: false };
    }
  },

  // Get user's favorites
  getMyFavorites: async (page: number = 1, size: number = 10) => {
    try {
      const response = await apiClient.get<ApiResponse<PageResponse<FavoriteResponse>>>(
        "/api/v1/favorites/my",
        { params: { page, size } },
      );
      return response.data;
    } catch (error) {
      toast.error("Lấy danh sách yêu thích thất bại.");
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

      return response.data;
    } catch (error) {
      toast.error("Upload file thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Upload video
  uploadVideo: async (file: File, onProgress?: (percent: number) => void) => {
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
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
            }
          },
        },
      );

      return response.data;
    } catch (error) {
      toast.error("Upload video thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};
