import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { API } from "@/api/api";


import {
  ReportStatsResponse,
  OverviewStatsResponse,
  CourseOverviewResponse,
} from "@/types/report";

export const reportApi = {
  getStats: async (timeRange?: string) => {
    const params = timeRange ? { timeRange } : undefined;
    const response = await apiClient.get<ApiResponse<ReportStatsResponse>>(
      API.REPORT_STATS,
      { params }
    );
    return response.data;
  },

  getOverview: async () => {
    const response = await apiClient.get<ApiResponse<OverviewStatsResponse>>(
      API.REPORT_OVERVIEW
    );
    return response.data;
  },

  getCourseOverview: async () => {
    const response = await apiClient.get<ApiResponse<CourseOverviewResponse>>(
      API.REPORT_COURSES_OVERVIEW
    );
    return response.data;
  },
};
