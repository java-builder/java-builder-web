"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CertificateDetailResponse, CertificateStatusFilter } from "@/types/certificate";
import CertificateDetailModal from "@/components/my-certificates/CertificateDetailModal";
import GrantCertificateModal from "@/components/admin/certificates/GrantCertificateModal";
import { CertificatesHeader } from "@/components/admin/certificates/CertificatesHeader";
import { CertificatesTable } from "@/components/admin/certificates/CertificatesTable";
import { Pagination } from "@/components/ui/Pagination";
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
import { Button } from "@/components/ui/button";

import { useDebounce } from "@/hooks/useDebounce";
import { useAdminCertificates } from "@/hooks/useAdminCertificates";

export default function AdminCertificatesPage() {
  const [page, setPage] = useState(1);
  const [searchCode, setSearchCode] = useState("");
  const [statusFilter, setStatusFilter] = useState<CertificateStatusFilter>("ALL");

  const debouncedSearchCode = useDebounce(searchCode, 300);

  const { certificates, isLoading, totalPages, totalElements, refetch } = useAdminCertificates(
    page,
    15,
    statusFilter,
    debouncedSearchCode
  );

  const [selectedCert, setSelectedCert] = useState<CertificateDetailResponse | null>(null);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  const handlePrint = (cert: CertificateDetailResponse) => {
    setSelectedCert(cert);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const statusOptions: FilterOption<CertificateStatusFilter>[] = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "ISSUED", label: "Đã cấp (ISSUED)" },
    { value: "EXPIRED", label: "Hết hạn (EXPIRED)" },
    { value: "REVOKED", label: "Đã thu hồi (REVOKED)" },
  ];

  const hasActiveFilters = statusFilter !== "ALL" || searchCode.trim() !== "";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <CertificatesHeader
        totalCount={totalElements}
        searchTerm={searchCode}
        isLoading={isLoading}
        onRefresh={refetch}
        onCreate={() => setIsGrantModalOpen(true)}
      />

      {/* Standard System FilterSelect & Search */}
      <div className="relative z-20 rounded-xl border border-border bg-card p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="flex items-center gap-2 pr-2 border-r border-border">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
                <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                Bộ lọc
              </span>
            </div>

            {/* FilterSelect from UI components */}
            <div className="w-48 sm:w-56">
              <FilterSelect
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val as CertificateStatusFilter);
                  setPage(1);
                }}
                options={statusOptions}
                placeholder="Tất cả trạng thái"
              />
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã chứng chỉ hoặc tên..."
                value={searchCode}
                onChange={(e) => {
                  setSearchCode(e.target.value);
                  setPage(1);
                }}
                className="flex h-10 w-full rounded-xl border border-input bg-background py-2 pl-10 pr-9 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              />
              {searchCode && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchCode("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("ALL");
                setSearchCode("");
                setPage(1);
              }}
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Xóa bộ lọc</span>
            </Button>
          )}
        </div>
      </div>

      {/* Certificates Table */}
      <CertificatesTable
        certificates={certificates}
        isLoading={isLoading}
        totalElements={totalElements}
        onView={(cert) => setSelectedCert(cert)}
        onPrint={handlePrint}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={15}
          onPageChange={(p) => setPage(p)}
          itemName="chứng chỉ"
        />
      )}

      {/* Grant Certificate Modal */}
      <GrantCertificateModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
        onSuccess={refetch}
      />

      {/* View Certificate Modal */}
      {selectedCert && (
        <CertificateDetailModal
          cert={selectedCert}
          studentName={selectedCert.studentName || "Học viên"}
          onClose={() => setSelectedCert(null)}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}
