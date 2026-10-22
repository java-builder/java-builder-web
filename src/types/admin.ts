export interface CourseStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalStudents: number;
  totalRevenue: number;
}

export interface DeleteModalState {
  isOpen: boolean;
  id: string;
  title: string;
}

export type CourseDeleteType = "soft" | "permanent";

export interface CourseDeleteModalState {
  isOpen: boolean;
  id: string;
  title: string;
  courseStatus?: import("./course").CourseStatus;
  initialType?: CourseDeleteType;
}

