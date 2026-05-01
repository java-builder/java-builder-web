import type { ChapterDetailResponse } from "./chapter";

// Course types
export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  duration?: number;
  key?: string;
  level?: CourseLevel;
  courseFormat: CourseFormat;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  key?: string;
  level?: CourseLevel;
  courseFormat?: CourseFormat;
  courseStatus?: CourseStatus;
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
  courseFormat: CourseFormat;
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
  courseFormat: CourseFormat;
  courseStatus?: CourseStatus;
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
  courseFormat: CourseFormat;
  progress: number;
  completed: boolean;
  enrolledAt: string;
  totalLessons: number;
  completedLessons: number;
}

export interface CourseEnrollmentResponse {
  enrollmentId: string;
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  progress: number;
  completed: boolean;
  enrolledAt: string;
}

export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

export enum CourseFormat {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  MIXED = "MIXED",
}

export enum CourseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

// Re-export from other files
export * from "./chapter";
export * from "./lesson";
export * from "./file";
export * from "./favorite";
