export type CertificateStatus = "ISSUED" | "EXPIRED" | "REVOKED";
export type CertificateStatusFilter = "ALL" | CertificateStatus;

export interface CertificateDetailResponse {
  id: string;
  studentName?: string;
  courseName: string;
  certificateCode: string;
  issuedDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  status: CertificateStatus;
}

export interface CreateCertificateRequest {
  userId: string;
  courseId: string;
}

export interface CreateCertificateResponse {
  id: string;
  studentName?: string;
  courseName: string;
  certificateCode: string;
  issuedDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  status: CertificateStatus;
}
