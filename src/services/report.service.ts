import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { API } from "@/api/api";


import {
  ReportStatsResponse,
  OverviewStatsResponse,
} from "@/types/report";

export const reportApi = {
  getStats: async (timeRange: string = "7days") => {
    const response = await apiClient.get<ApiResponse<ReportStatsResponse>>(
      API.REPORT_STATS,
      { params: { timeRange } }
    );
    return response.data;
  },

  getOverview: async () => {
    const response = await apiClient.get<ApiResponse<OverviewStatsResponse>>(
      API.REPORT_OVERVIEW
    );
    return response.data;
  },
};
