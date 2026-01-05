import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  LessonNote,
  CreateLessonNoteRequest,
  UpdateLessonNoteRequest,
} from "@/types/lesson-note";
import toast from "react-hot-toast";

export interface NoteSearchParams {
  page?: number;
  size?: number;
}

export const lessonNoteApi = {
  create: async (data: CreateLessonNoteRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<LessonNote>>(
        "/api/v1/lesson-notes",
        data
      );
      if (response.data.code === 201) {
        toast.success("Ghi chú đã được thêm thành công!");
      }
      return response.data;
    } catch (error) {
      toast.error("Thêm ghi chú thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  getByLesson: async (lessonId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<LessonNote[]>>(
        `/api/v1/lesson-notes/lesson/${lessonId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error loading notes:", error.message);
      }
      throw error;
    }
  },

  getByCourse: async (courseId: string, params: NoteSearchParams = {}) => {
    try {
      const response = await apiClient.get<
        ApiResponse<PageResponse<LessonNote>>
      >(`/api/v1/lesson-notes/course/${courseId}`, {
        params: {
          page: params.page || 1,
          size: params.size || 20,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error loading course notes:", error.message);
      }
      throw error;
    }
  },

  update: async (noteId: string, data: UpdateLessonNoteRequest) => {
    try {
      const response = await apiClient.put<ApiResponse<LessonNote>>(
        `/api/v1/lesson-notes/${noteId}`,
        data
      );
      if (response.data.code === 200) {
        toast.success("Cập nhật ghi chú thành công!");
      }
      return response.data;
    } catch (error) {
      toast.error("Cập nhật ghi chú thất bại. Vui lòng thử lại.");
      throw error;
    }
  },

  delete: async (noteId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/v1/lesson-notes/${noteId}`
      );
      if (response.data.code === 200) {
        toast.success("Xóa ghi chú thành công!");
      }
      return response.data;
    } catch (error) {
      toast.error("Xóa ghi chú thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};
