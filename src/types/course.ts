import type { ChapterDetailResponse } from "./chapter";

// Course types
export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  duration?: number;
  key?: string;
  level?: CourseLevel;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  key?: string;
  level?: CourseLevel;
}

export interface CreateCourseResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration?: number;
  thumbnailUrl?: string;
  level?: CourseLevel;
}

export interface CourseDetailResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration?: number;
  thumbnailUrl?: string;
  level?: CourseLevel;
  chapters?: ChapterDetailResponse[];
  createdAt: string;
  updatedAt?: string;
  isFavorite?: boolean;
  isEnrolled?: boolean;
  isPremiumUser?: boolean;
}

export interface MyEnrolledCourseResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration?: number;
  thumbnailUrl?: string;
  level?: CourseLevel;
  progress: number;
  completed: boolean;
  enrolledAt: string;
  totalLessons: number;
  completedLessons: number;
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
