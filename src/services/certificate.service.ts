import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { CertificateDetailResponse, CertificateStatus, CreateCertificateRequest, CreateCertificateResponse } from "@/types/certificate";
import { API } from "@/api/api";

export const certificateApi = {
  /**
   * Admin lấy danh sách tất cả chứng chỉ với phân trang, mã bảo chứng & lọc trạng thái (ISSUED, EXPIRED, REVOKED)
   */
  getAllCertificates: async (
    page: number = 1,
    size: number = 10,
    certificateCode?: string,
    status?: CertificateStatus
  ) => {
    const response = await apiClient.get<ApiResponse<PageResponse<CertificateDetailResponse>>>(
      API.CERTIFICATES,
      {
        params: {
          page,
          size,
          ...(certificateCode ? { certificateCode } : {}),
          ...(status ? { status } : {}),
        },
      }
    );
    return response.data;
  },

  /**
   * Lấy danh sách chứng chỉ cá nhân của tôi với phân trang
   */
  getMyCertificates: async (page: number = 1, size: number = 10, certificateCode?: string, status?: CertificateStatus) => {
    const response = await apiClient.get<ApiResponse<PageResponse<CertificateDetailResponse>>>(
      API.CERTIFICATES_MY,
      {
        params: {
          page,
          size,
          ...(certificateCode ? { certificateCode } : {}),
          ...(status ? { status } : {}),
        },
      }
    );
    return response.data;
  },

  /**
   * Admin tạo chứng chỉ cho học viên trong khóa học
   */
  createCertificate: async (request: CreateCertificateRequest) => {
    const response = await apiClient.post<ApiResponse<CreateCertificateResponse>>(
      API.CERTIFICATES_CREATE,
      request
    );
    return response.data;
  },
};
