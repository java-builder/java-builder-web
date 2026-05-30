import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import { ScheduleEmailRequest } from "@/types/email-scheduler";
import { ScheduledJobResponse, ScheduledJobSearchParams } from "@/types/scheduled-job";

export const emailSchedulerService = {
  scheduleBroadcast: async (request: ScheduleEmailRequest) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.EMAIL_BROADCAST,
      request,
    );
    return response.data;
  },

  getScheduledJobs: async (params: ScheduledJobSearchParams = {}) => {
    const queryParams: Record<string, string | number> = {
      page: params.page ?? 1,
      size: params.size ?? 10,
    };
    if (params.status) queryParams.status = params.status;
    if (params.jobType) queryParams.jobType = params.jobType;

    const response = await apiClient.get<ApiResponse<PageResponse<ScheduledJobResponse>>>(
      API.SCHEDULED_JOBS,
      { params: queryParams },
    );
    return response.data;
  },
};
