import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  CreateCourseRequest,
  CreateCourseResponse,
  UpdateCourseRequest,
  CourseDetailResponse,
  CourseLevel,
  CourseFormat,
  CreateChapterRequest,
  CreateChapterResponse,
  UpdateChapterRequest,
  UpdateChapterResponse,
  CreateLessonRequest,
  CreateLessonResponse,
  UpdateLessonRequest,
  LessonDetailResponse,
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
    page?: number,
    size?: number,
    title?: string,
    level?: CourseLevel,
    courseFormat?: CourseFormat,
  ) => {
    const params: Record<string, string | number> = {};

    if (page !== undefined) {
      params.page = page;
    }

    if (size !== undefined) {
      params.size = size;
    }

    if (title) {
      params.title = title;
    }

    if (level) {
      params.level = level;
    }

    if (courseFormat) {
      params.courseFormat = courseFormat;
    }

    const response = await apiClient.get<
      ApiResponse<PageResponse<CourseDetailResponse>>
    >(API.GET_COURSES, { params });
    return response.data;
  },

  // Lấy chi tiết khóa học theo ID
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<CourseDetailResponse>>(
      `${API.GET_COURSE_BY_ID}/${id}`,
    );
    return response.data;
  },

  // Lấy chi tiết khóa học theo slug
  getBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<CourseDetailResponse>>(
      `${API.GET_COURSE_BY_SLUG}/${slug}`,
    );
    return response.data;
  },

  // Cập nhật khóa học
  update: async (id: string, data: UpdateCourseRequest) => {
    const response = await apiClient.put<ApiResponse<CourseDetailResponse>>(
      `${API.UPDATE_COURSE}/${id}`,
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

  // Cập nhật lesson
  update: async (id: string, data: UpdateLessonRequest) => {
    const response = await apiClient.put<ApiResponse<LessonDetailResponse>>(
      `${API.UPDATE_LESSON}/${id}`,
      data,
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

export const fileApi = {
  // Upload ảnh đơn lên public folder
  uploadSingleMedia: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<FileMetaDataResponse>>(
      API.FILES_PUBLIC_UPLOAD_SINGLE,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  getPublicPresignedUrl: async (filename: string) => {
    const response = await apiClient.post<ApiResponse<PreSignedResponse>>(
      API.FILES_PUBLIC_PRE_SIGNED_URL,
      null,
      { params: { filename } },
    );
    return response.data;
  },

  getPrivatePresignedUrl: async (filename: string) => {
    const response = await apiClient.post<ApiResponse<PreSignedResponse>>(
      API.FILES_PRIVATE_PRE_SIGNED_URL,
      null,
      { params: { filename } },
    );
    return response.data;
  },

  uploadPrivateVideo: async (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<{ key: string }> => {
    const presignedResponse = await fileApi.getPrivatePresignedUrl(file.name);
    if (!presignedResponse.data) {
      throw new Error("Không thể lấy URL upload");
    }

    const { url, key } = presignedResponse.data;

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });
      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });

    return { key };
  },

  uploadPublicImage: async (file: File): Promise<{ key: string }> => {
    const presignedResponse = await fileApi.getPublicPresignedUrl(file.name);
    if (!presignedResponse.data) {
      throw new Error("Không thể lấy URL upload");
    }
    const { url, key } = presignedResponse.data;
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    return { key };
  },
};
