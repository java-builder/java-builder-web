// Lesson types
export enum LessonFormat {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  MIXED = "MIXED",
}

export interface LessonDetailResponse {
  id: string;
  lessonName: string;
  description: string;
  content?: string;
  lessonFormat: LessonFormat;
  isFreePreview: boolean;
  canAccess?: boolean;
  videoKey?: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface CreateLessonRequest {
  chapterId: string;
  lessonName: string;
  description?: string;
  content?: string;
  lessonFormat: LessonFormat;
  videoKey?: string;
  isFreePreview?: boolean;
}

export interface CreateLessonResponse {
  id: string;
  lessonName: string;
  description: string;
  content?: string;
  lessonFormat: LessonFormat;
  videoKey?: string;
  videoUrl?: string;
  isFreePreview: boolean;
}

export interface UpdateLessonRequest {
  lessonName?: string;
  description?: string;
  content?: string;
  lessonFormat?: LessonFormat;
  videoKey?: string;
  isFreePreview?: boolean;
}

// Learning Progress types
export interface CourseLearningResponse {
  id: string;
  title: string;
  lastLessonId?: string;
  lastLessonName?: string;
  lastLessonDescription?: string;
  videoUrl?: string;
  lastWatchedSeconds?: number;
}

export interface UpdateLessonProgressRequest {
  lessonId: string;
  watchedSeconds?: number;
  completed?: boolean;
}
