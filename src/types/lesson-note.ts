export interface LessonNote {
  id: string;
  lessonId: string;
  lessonName: string;
  content: string;
  timestamp: number | null;
  formattedTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonNoteRequest {
  lessonId: string;
  content: string;
  timestamp?: number;
}

export interface UpdateLessonNoteRequest {
  content: string;
  timestamp?: number;
}
