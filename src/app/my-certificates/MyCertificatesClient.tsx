"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Pagination } from "@/components/ui/Pagination";
import { certificateApi } from "@/services/certificate.service";
import { CertificateDetailResponse } from "@/types/certificate";
import {
  MyCertificatesHeader,
  MyCertificatesFilter,
  MyCertificateCard,
  MyCertificatesEmptyState,
  CertificateDetailModal,
  StatusFilterType
} from "@/components/my-certificates";

const PAGE_SIZE = 6;

export default function MyCertificatesClient() {
  const router = useRouter();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const [certificates, setCertificates] = useState<CertificateDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [searchCode, setSearchCode] = useState("");
  const [selectedCert, setSelectedCert] = useState<CertificateDetailResponse | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, userLoading, router, mounted]);

  const fetchCertificates = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const response = await certificateApi.getMyCertificates(currentPage, PAGE_SIZE, searchCode.trim());
      if (response?.data?.data) {
        setCertificates(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || response.data.data.length);
      } else {
        setCertificates([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Error fetching my certificates:", error);
      setCertificates([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchCode, currentUser]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCertificates();
  };

  const triggerPrint = (cert: CertificateDetailResponse) => {
    setSelectedCert(cert);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const studentName = useMemo(() => {
    return currentUser?.username || "Bạn";
  }, [currentUser]);

  const filterCounts = useMemo(() => {
    return {
      ALL: certificates.length,
      ISSUED: certificates.filter((c) => c.status === "ISSUED").length,
      EXPIRED: certificates.filter((c) => c.status === "EXPIRED").length,
      REVOKED: certificates.filter((c) => c.status === "REVOKED").length,
    } satisfies Record<StatusFilterType, number>;
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    if (statusFilter === "ALL") return certificates;
    return certificates.filter((c) => c.status === statusFilter);
  }, [certificates, statusFilter]);

  if (!mounted || userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Đang tải chứng chỉ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 no-print-layout">
      {/* Dynamic styles for printing */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print-layout {
            display: none !important;
          }
          .print-container {
            display: block !important;
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            z-index: 9999999 !important;
          }
        }
      `}} />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <MyCertificatesHeader />

        {/* Filter & Search */}
        <MyCertificatesFilter
          filter={statusFilter}
          onChangeFilter={(status) => setStatusFilter(status)}
          searchCode={searchCode}
          onSearchChange={(val) => setSearchCode(val)}
          onSearchSubmit={handleSearchSubmit}
          counts={filterCounts}
        />

        {/* Grid List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl border border-border bg-card p-5"
              >
                <div className="h-36 rounded-xl bg-muted mb-4" />
                <div className="h-5 w-3/4 rounded bg-muted mb-2" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filteredCertificates.length === 0 ? (
          <MyCertificatesEmptyState
            title="Không tìm thấy chứng chỉ nào"
            description="Bạn chưa có chứng chỉ thuộc trạng thái này. Hãy tham gia và hoàn thành khóa học để nhận chứng chỉ."
            actionLabel="Khám phá khóa học ngay"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <MyCertificateCard
                key={cert.id}
                cert={cert}
                studentName={studentName}
                onView={(selected) => setSelectedCert(selected)}
                onPrint={(selected) => triggerPrint(selected)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
            itemName="chứng chỉ"
          />
        )}

        {/* Certificate Modal */}
        {selectedCert && (
          <CertificateDetailModal
            cert={selectedCert}
            studentName={studentName}
            onClose={() => setSelectedCert(null)}
            onPrint={(selected) => triggerPrint(selected)}
          />
        )}
      </div>

      {/* Hidden Print Container */}
      {selectedCert && (
        <div className="hidden print-container p-6 bg-white text-black text-center">
          <div className="w-full aspect-[1.414/1] max-w-[800px] mx-auto bg-[#faf8f5] text-amber-950 border-4 border-solid border-amber-800/85 rounded-2xl p-8 flex flex-col justify-between text-center relative shadow-lg">
            <div className="flex justify-between items-center z-10 border-b border-amber-900/10 pb-2">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-black tracking-widest text-amber-900 uppercase">JAVABUILDER</p>
              </div>
              <div className="text-right text-[8px] font-semibold text-amber-900/60 font-mono">
                <p>{selectedCert.certificateCode}</p>
              </div>
            </div>

            <div className="my-auto space-y-3 z-10 py-4">
              <h2 className="text-base font-black tracking-widest text-amber-800 uppercase">
                CHỨNG CHỈ HOÀN THÀNH KHOÁ HỌC
              </h2>
              <div className="space-y-0.5">
                <p className="text-[9px] text-amber-900/80 italic font-medium">Chứng nhận trao tặng cho</p>
                <h1 className="text-2xl font-extrabold text-amber-955 font-serif tracking-wide border-b border-amber-800/20 w-fit mx-auto px-4 pb-0.5">
                  {studentName}
                </h1>
              </div>
              <div className="space-y-0.5 max-w-md mx-auto">
                <p className="text-[9px] text-amber-900/80 font-medium">Đã hoàn thành xuất sắc khóa học:</p>
                <h3 className="text-sm font-extrabold text-amber-900">
                  {selectedCert.courseName}
                </h3>
              </div>
            </div>

            <div className="flex justify-between items-end z-10 border-t border-amber-900/10 pt-3 text-left px-2">
              <div>
                <p className="text-[7px] text-amber-900/50 uppercase font-semibold">Ngày cấp</p>
                <p className="text-[9px] text-amber-955 font-bold mt-0.5">{new Date(selectedCert.issuedDate).toLocaleDateString("vi-VN")}</p>
              </div>
              <div className="flex items-end gap-3">
                <div className="p-1 bg-white rounded border border-slate-200">
                  <QRCodeSVG
                    value={selectedCert.verifyUrl || `https://javabuilder.online/verify-certificate?code=${encodeURIComponent(selectedCert.certificateCode)}`}
                    size={40}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="text-right">
                  <span className="font-serif italic text-sm text-amber-800/80 select-none">JavaBuilder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
