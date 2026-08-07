import { useState, useEffect, useCallback } from "react";
import { certificateApi } from "@/services/certificate.service";
import { CertificateDetailResponse, CertificateStatus, CertificateStatusFilter, CreateCertificateRequest } from "@/types/certificate";
import toast from "react-hot-toast";

export function useAdminCertificates(
  page: number = 1,
  size: number = 15,
  status?: CertificateStatusFilter,
  search?: string
) {
  const [certificates, setCertificates] = useState<CertificateDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCertificates = useCallback(async () => {
    try {
      setIsLoading(true);
      const statusParam = status === "ALL" ? undefined : (status as CertificateStatus);
      const res = await certificateApi.getAllCertificates(
        page,
        size,
        search?.trim() || undefined,
        statusParam
      );
      if (res.data) {
        setCertificates(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error("Error fetching certificates:", err);
      toast.error("Không thể tải danh sách chứng chỉ");
    } finally {
      setIsLoading(false);
    }
  }, [page, size, status, search]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const grantCertificate = async (data: CreateCertificateRequest, username?: string) => {
    try {
      await certificateApi.createCertificate(data);
      toast.success(`Cấp chứng chỉ cho học viên${username ? ` "${username}"` : ''} thành công!`);
      fetchCertificates();
      return true;
    } catch (err: unknown) {
      console.error("Error granting certificate:", err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj?.response?.data?.message || "Cấp chứng chỉ thất bại. Học viên có thể đã có bằng cho khóa học này.";
      toast.error(msg);
      throw err;
    }
  };

  return {
    certificates,
    isLoading,
    totalPages,
    totalElements,
    refetch: fetchCertificates,
    grantCertificate,
  };
}

export function useGrantCertificate() {
  const [isGranting, setIsGranting] = useState(false);

  const grantCertificate = async (data: CreateCertificateRequest, username?: string) => {
    setIsGranting(true);
    try {
      await certificateApi.createCertificate(data);
      toast.success(`Cấp chứng chỉ cho học viên${username ? ` "${username}"` : ''} thành công!`);
      return true;
    } catch (err: unknown) {
      console.error("Error granting certificate:", err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj?.response?.data?.message || "Cấp chứng chỉ thất bại. Học viên có thể đã có bằng cho khóa học này.";
      toast.error(msg);
      throw err;
    } finally {
      setIsGranting(false);
    }
  };

  return {
    grantCertificate,
    isGranting,
  };
}
