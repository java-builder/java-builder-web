export interface EnrolledStudentResponse {
  enrollmentId: string;
  userId: string;
  username: string;
  email: string;
  avatar: string | null;
  progress: number;
  completed: boolean;
  enrolledAt: string;
}

export interface EnrollmentPageResponse {
  data: EnrolledStudentResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}


