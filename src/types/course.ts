// Course types
export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  duration?: number;
  courseCover?: string;
  level?: CourseLevel;
}

export interface UpdateCourseRequest {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  courseCover?: string;
  level?: CourseLevel;
}

export interface CreateCourseResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration?: number;
  courseCover?: string;
  level?: CourseLevel;
}

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

// Lesson types
export interface LessonDetailResponse {
  id: string;
  lessonName: string;
  description: string;
  videoUrl: string;
  isFreePreview: boolean;
}

export interface CreateLessonRequest {
  chapterId: string;
  lessonName: string;
  description?: string;
  videoUrl?: string;
  isFreePreview?: boolean;
}

export interface CreateLessonResponse {
  id: string;
  lessonName: string;
  description: string;
  videoUrl: string;
  isFreePreview: boolean;
}

export interface CourseDetailResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration?: number;
  courseCover?: string;
  level?: CourseLevel;
  chapters?: ChapterDetailResponse[];
  createdAt: string;
  updatedAt?: string;
  // User-specific fields (populated when user is authenticated)
  isFavorite?: boolean;
  isEnrolled?: boolean;
  isPremiumUser?: boolean;
}

export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

// File upload types
export interface FileMetaDataResponse {
  name: string;
  contentType: string;
  size: number;
  url: string;
  displayOrder?: number;
}

export interface FileResponse {
  files: FileMetaDataResponse[];
}

// Favorite types
export interface FavoriteResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  coursePrice: number;
  courseCover: string;
  courseLevel: CourseLevel;
  courseDuration: number;
  addedAt: string;
}
