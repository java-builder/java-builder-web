import { apiClient } from "@/api/axios";
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
} from "@/types/course";
import { API } from "@/api/api";

export const courseApi = {
  // Tạo khóa học mới
  create: async (data: CreateCourseRequest) => {
    const response = await apiClient.post<ApiResponse<CreateCourseResponse>>(
      API.CREATE_COURSE,
      data,
    );
    return response.data;
  },

  // Lấy danh sách khóa học
  getCourses: async (
    page: number = 1,
    size: number = 10,
    title?: string,
    level?: CourseLevel,
  ) => {
    const params: Record<string, string | number> = { page, size };

    if (title) {
      params.title = title;
    }

    if (level) {
      params.level = level;
    }

    const response = await apiClient.get<
      ApiResponse<PageResponse<CourseDetailResponse>>
    >(API.GET_COURSES, { params });
    return response.data;
  },

  // Lấy chi tiết khóa học
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<CourseDetailResponse>>(
      `${API.GET_COURSE_BY_ID}/${id}`,
    );
    return response.data;
  },

  // Cập nhật khóa học
  update: async (data: UpdateCourseRequest) => {
    const response = await apiClient.put<ApiResponse<CourseDetailResponse>>(
      API.UPDATE_COURSE,
      data,
    );
    return response.data;
  },

  // Lấy thông tin học tiếp (last lesson, video url, watched seconds)
  getLearningDetail: async (courseId: string) => {
    const response = await apiClient.get<ApiResponse<CourseLearningResponse>>(
      `${API.GET_LEARNING_DETAILS}/${courseId}/learning`,
    );
    return response.data;
  },

  // Xóa khóa học
  delete: async (id: string) => {
    await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_COURSE}/${id}`,
    );
  },
};

export const chapterApi = {
  // Tạo chapter mới
  create: async (data: CreateChapterRequest) => {
    const response = await apiClient.post<ApiResponse<CreateChapterResponse>>(
      API.CREATE_CHAPTER,
      data,
    );
    return response.data;
  },

  // Cập nhật chapter
  update: async (data: UpdateChapterRequest) => {
    const response = await apiClient.put<ApiResponse<UpdateChapterResponse>>(
      API.UPDATE_CHAPTER,
      data,
    );
    return response.data;
  },

  // Xóa chapter
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_CHAPTER}/${id}`,
    );
    return response.data;
  },
};

export const lessonApi = {
  // Tạo lesson mới
  create: async (data: CreateLessonRequest) => {
    const response = await apiClient.post<ApiResponse<CreateLessonResponse>>(
      API.CREATE_LESSON,
      data,
    );
    return response.data;
  },

  // Lấy chi tiết lesson theo ID (bao gồm videoUrl)
  getById: async (lessonId: string) => {
    const response = await apiClient.get<ApiResponse<LessonDetailResponse>>(
      `${API.GET_LESSON_BY_ID}/${lessonId}`,
    );
    return response.data;
  },

  // Lấy danh sách lessons theo chapterId (không có videoUrl)
  getByChapterId: async (chapterId: string) => {
    const response = await apiClient.get<ApiResponse<LessonDetailResponse[]>>(
      `${API.GET_LESSONS_BY_CHAPTER}/${chapterId}`,
    );
    return response.data;
  },

  // Xóa lesson
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_LESSON}/${id}`,
    );
    return response.data;
  },

  // Cập nhật tiến độ học
  updateProgress: async (data: UpdateLessonProgressRequest) => {
    const response = await apiClient.put<ApiResponse<void>>(
      API.LESSON_PROGRESS,
      data,
    );
    return response.data;
  },
};

export const favoriteApi = {
  // Toggle favorite (add/remove)
  toggle: async (courseId: string) => {
    const response = await apiClient.post<ApiResponse<boolean>>(
      `${API.FAVORITES_TOGGLE}/${courseId}`,
    );
    return response.data;
  },

  // Check if course is favorited
  check: async (courseId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `${API.FAVORITES_CHECK}/${courseId}`,
      );
      return response.data;
    } catch {
      return { code: 200, result: false };
    }
  },

  // Get user's favorites
  getMyFavorites: async (page: number = 1, size: number = 10) => {
    const response = await apiClient.get<ApiResponse<PageResponse<FavoriteResponse>>>(
      API.FAVORITES_MY,
      { params: { page, size } },
    );
    return response.data;
  },
};

export const fileApi = {
  // Upload ảnh đơn
  uploadSingleMedia: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<FileMetaDataResponse>>(
      API.FILES_UPLOAD_SINGLE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  // Lấy presigned URL để upload trực tiếp lên S3
  getPresignedUrl: async (filename: string, folder?: string) => {
    const params: Record<string, string> = { filename };
    if (folder) {
      params.folder = folder;
    }

    const response = await apiClient.post<ApiResponse<PreSignedResponse>>(
      // NOTE: In API.ts I named it FILES_PRE_SIGNED_URL (with pre-signed) but in fileApi it was pre-signed-url. 

      API.FILES_PRE_SIGNED_URL,
      null,
      { params },
    );

    return response.data;
  },

  // Upload video trực tiếp lên S3 qua presigned URL
  uploadVideoWithPresigned: async (
    file: File,
    onProgress?: (percent: number) => void,
    folder?: string,
  ): Promise<{ key: string }> => {
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
  },

  // Upload video (deprecated - dùng uploadVideoWithPresigned thay thế)
  uploadVideo: async (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<FileMetaDataResponse>>(
      API.FILES_UPLOAD_SINGLE,
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
  },
};
