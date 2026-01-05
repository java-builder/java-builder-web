import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  CreateCourseRequest,
  CreateCourseResponse,
  UpdateCourseRequest,
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
  FileMetaDataResponse,
  PreSignedResponse,
  CourseLearningResponse,
  UpdateLessonProgressRequest,
  MyEnrolledCourseResponse,
} from "@/types/course";
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

  // Cập nhật khóa học
  update: async (data: UpdateCourseRequest) => {
    try {
      const response = await apiClient.put<ApiResponse<CourseDetailResponse>>(
        "/api/v1/courses",
        data,
      );
      return response.data;
    } catch (error) {
      toast.error("Cập nhật khóa học thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Lấy thông tin học tiếp (last lesson, video url, watched seconds)
  getLearningDetail: async (courseId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<CourseLearningResponse>>(
        `/api/v1/courses/${courseId}/learning`,
      );
      return response.data;
    } catch (error) {
      toast.error("Lấy thông tin học tập thất bại.");
      throw error;
    }
  },

  // Xóa khóa học
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/v1/courses/${id}`,
      );
      toast.success("Xóa khóa học thành công!");
      return response.data;
    } catch (error) {
      toast.error("Xóa khóa học thất bại. Vui lòng thử lại.");
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

  // Lấy chi tiết lesson theo ID (bao gồm videoUrl)
  getById: async (lessonId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<LessonDetailResponse>>(
        `/api/v1/lessons/${lessonId}`,
      );
      return response.data;
    } catch (error) {
      toast.error("Lấy thông tin bài học thất bại.");
      throw error;
    }
  },

  // Lấy danh sách lessons theo chapterId (không có videoUrl)
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

  // Cập nhật tiến độ học
  updateProgress: async (data: UpdateLessonProgressRequest) => {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        "/api/v1/lesson-progress",
        data,
      );
      return response.data;
    } catch (error) {
      // Không show toast vì gọi liên tục khi xem video
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

export const enrollmentApi = {
  // Lấy danh sách khóa học đã đăng ký
  getMyCourses: async (page: number = 1, size: number = 10) => {
    try {
      const response = await apiClient.get<ApiResponse<PageResponse<MyEnrolledCourseResponse>>>(
        "/api/v1/enrollments/my-courses",
        { params: { page, size } },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check xem user đã đăng ký khóa học chưa
  checkEnrollment: async (courseId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `/api/v1/enrollments/check/${courseId}`,
      );
      return response.data;
    } catch {
      return { code: 200, result: false };
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

  // Lấy presigned URL để upload trực tiếp lên S3
  getPresignedUrl: async (filename: string, folder?: string) => {
    try {
      const params: Record<string, string> = { filename };
      if (folder) {
        params.folder = folder;
      }

      const response = await apiClient.post<ApiResponse<PreSignedResponse>>(
        "/api/v1/files/pre-signed-url",
        null,
        { params },
      );

      return response.data;
    } catch (error) {
      toast.error("Lấy URL upload thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Upload video trực tiếp lên S3 qua presigned URL
  uploadVideoWithPresigned: async (
    file: File,
    onProgress?: (percent: number) => void,
    folder?: string,
  ): Promise<{ key: string }> => {
    try {
      // 1. Lấy presigned URL từ BE
      const presignedResponse = await fileApi.getPresignedUrl(file.name, folder);
      if (!presignedResponse.result) {
        throw new Error("Không thể lấy URL upload");
      }

      const { url, key } = presignedResponse.result;

      // 2. Upload trực tiếp lên S3 bằng PUT request
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      return { key };
    } catch (error) {
      toast.error("Upload video thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  // Upload video (deprecated - dùng uploadVideoWithPresigned thay thế)
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
