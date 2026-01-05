// Lesson types
export interface LessonDetailResponse {
  id: string;
  lessonName: string;
  description: string;
  isFreePreview: boolean;
  videoKey?: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface CreateLessonRequest {
  chapterId: string;
  lessonName: string;
  description?: string;
  videoKey?: string;
  isFreePreview?: boolean;
}

export interface CreateLessonResponse {
  id: string;
  lessonName: string;
  description: string;
  videoKey?: string;
  videoUrl?: string;
  isFreePreview: boolean;
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
