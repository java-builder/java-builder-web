// Course types
export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
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
