import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface ChartData {
  label: string;
  value: number;
}

export interface CourseRevenue {
  id: string;
  name: string;
  owners: number;
  revenue: number;
}

export interface ReportStatsResponse {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  revenueGrowth: number;
  userGrowth: number;
  courseGrowth: number;
  enrollmentGrowth: number;
  revenueChart: ChartData[];
  userChart: ChartData[];
  courseRevenues: CourseRevenue[];
}

export const reportApi = {
  getStats: async (timeRange: string = "7days") => {
    const response = await apiClient.get<ApiResponse<ReportStatsResponse>>(
      "/api/v1/reports/stats",
      { params: { timeRange } }
    );
    return response.data;
  },
};
