import { LessonDetailResponse } from "./lesson";

// Chapter types
export interface ChapterDetailResponse {
  id: string;
  chapterName: string;
  description: string;
  lessons?: LessonDetailResponse[];
}

export interface CreateChapterRequest {
  courseId: string;
  chapterName: string;
  description?: string;
}

export interface CreateChapterResponse {
  id: string;
  chapterName: string;
  description: string;
}

export interface UpdateChapterRequest {
  id: string;
  chapterName: string;
  description?: string;
}

export interface UpdateChapterResponse {
  id: string;
  chapterName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
