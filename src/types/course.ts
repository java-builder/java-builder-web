import type { ChapterDetailResponse } from "./chapter";

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

// Re-export from other files
export * from "./chapter";
export * from "./lesson";
export * from "./file";
export * from "./favorite";
