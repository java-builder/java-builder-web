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
  revenueChart: ChartData[];
  userChart: ChartData[];
  courseRevenues: CourseRevenue[];
}

export interface OverviewStatsResponse {
  totalUsers: number;
  totalCourses: number;
  monthlyRevenue: number;
  newEnrollments: number;
}

export const reportApi = {
  getStats: async (timeRange: string = "7days") => {
    const response = await apiClient.get<ApiResponse<ReportStatsResponse>>(
      "/api/v1/reports/stats",
      { params: { timeRange } }
    );
    return response.data;
  },

  getOverview: async () => {
    const response = await apiClient.get<ApiResponse<OverviewStatsResponse>>(
      "/api/v1/reports/overview"
    );
    return response.data;
  },
};
