import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { MyEnrolledCourseResponse } from "@/types/course";
import toast from "react-hot-toast";

export const enrollmentApi = {
  // Lấy danh sách khóa học đã đăng ký
  getMyCourses: async (page: number = 1, size: number = 10) => {
    try {
      const response = await apiClient.get<ApiResponse<PageResponse<MyEnrolledCourseResponse>>>(
        "/api/v1/enrollments/my-courses",
        { params: { page, size } },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check xem user đã đăng ký khóa học chưa
  checkEnrollment: async (courseId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `/api/v1/enrollments/check/${courseId}`,
      );
      return response.data;
    } catch {
      return { code: 200, result: false };
    }
  },

  // Admin thêm user vào khóa học
  adminEnrollUser: async (email: string, courseId: string) => {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        "/api/v1/enrollments/admin/enroll",
        { email, courseId },
      );
      toast.success("Thêm học viên vào khóa học thành công!");
      return response.data;
    } catch (error) {
      toast.error("Thêm học viên thất bại. Vui lòng thử lại.");
      throw error;
    }
  },
};
