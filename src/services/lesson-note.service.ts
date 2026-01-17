import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  LessonNote,
  CreateLessonNoteRequest,
  UpdateLessonNoteRequest,
} from "@/types/lesson-note";
import { API } from "@/api/api";


export interface NoteSearchParams {
  page?: number;
  size?: number;
}

export const lessonNoteApi = {
  create: async (data: CreateLessonNoteRequest) => {
    const response = await apiClient.post<ApiResponse<LessonNote>>(
      API.CREATE_LESSON_NOTE,
      data
    );
    return response.data;
  },

  getByLesson: async (lessonId: string) => {
    const response = await apiClient.get<ApiResponse<LessonNote[]>>(
      `${API.GET_LESSON_NOTE_BY_LESSON}/${lessonId}`
    );
    return response.data;
  },

  getByCourse: async (courseId: string, params: NoteSearchParams = {}) => {
    const response = await apiClient.get<
      ApiResponse<PageResponse<LessonNote>>
    >(`${API.GET_LESSON_NOTES_BY_COURSE}/${courseId}`, {
      params: {
        page: params.page || 1,
        size: params.size || 20,
      },
    });
    return response.data;
  },

  update: async (noteId: string, data: UpdateLessonNoteRequest) => {
    const response = await apiClient.put<ApiResponse<LessonNote>>(
      `${API.UPDATE_LESSON_NOTE}/${noteId}`,
      data
    );
    return response.data;
  },

  delete: async (noteId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_LESSON_NOTE}/${noteId}`
    );
    return response.data;
  },
};
