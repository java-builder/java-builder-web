import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { MyEnrolledCourseResponse } from "@/types/course";
import { CourseEnrollmentResponse } from "@/types/enrollment";
import { API } from "@/api/api";

export const enrollmentApi = {
  // Lấy danh sách khóa học đã đăng ký
  getMyCourses: async (page: number = 1, size: number = 10) => {
    const response = await apiClient.get<ApiResponse<PageResponse<MyEnrolledCourseResponse>>>(
      API.ENROLLMENTS_MY_COURSES,
      { params: { page, size } },
    );
    return response.data;
  },

  // Check xem user đã đăng ký khóa học chưa
  checkEnrollment: async (courseId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `${API.ENROLLMENTS_CHECK}/${courseId}`,
      );
      return response.data;
    } catch {
      return { code: 200, data: false };
    }
  },

  // Admin thêm user vào khóa học
  adminEnrollUser: async (email: string, courseId: string) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.ENROLLMENTS_ADMIN,
      { email, courseId },
    );
    return response.data;
  },

  // Admin lấy danh sách học viên của khóa học
  getCourseEnrollments: async (courseId: string, page: number = 1, size: number = 20) => {
    const response = await apiClient.get<ApiResponse<PageResponse<CourseEnrollmentResponse>>>(
      `/api/v1/courses/${courseId}/enrollments`,
      { params: { page, size } },
    );
    return response.data;
  },

  // Admin xóa học viên khỏi khóa học
  unenrollStudent: async (enrollmentId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/courses/enrollments/${enrollmentId}`,
    );
    return response.data;
  },
};
