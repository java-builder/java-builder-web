"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Award, CheckCircle2, Download, Eye, Loader2, MoreHorizontal, ShieldCheck, XCircle } from "lucide-react";
import { CertificateDetailResponse } from "@/types/certificate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface CertificatesTableProps {
  certificates: CertificateDetailResponse[];
  isLoading: boolean;
  totalElements: number;
  onView: (cert: CertificateDetailResponse) => void;
  onPrint: (cert: CertificateDetailResponse) => void;
}

export const CertificatesTable = ({
  certificates,
  isLoading,
  totalElements,
  onView,
  onPrint,
}: CertificatesTableProps) => {
  const [activeMenu, setActiveMenu] = useState<{
    cert: CertificateDetailResponse;
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (activeMenu) setActiveMenu(null);
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [activeMenu]);

  const COLUMN_HEADERS: { label: string; width: string; align?: "left" | "center" | "right" }[] = [
    { label: "Mã chứng chỉ", width: "w-[18%]" },
    { label: "Học viên", width: "w-[18%]" },
    { label: "Khóa học", width: "w-[30%]" },
    { label: "Ngày cấp", width: "w-[11%]" },
    { label: "Hạn dùng", width: "w-[11%]" },
    { label: "Trạng thái", width: "w-[10%]", align: "center" },
    { label: "Thao tác", width: "w-[12%]", align: "right" },
  ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "REVOKED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="h-3 w-3" />
            Đã thu hồi
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            Hết hạn
          </span>
        );
      case "ISSUED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Đã cấp
          </span>
        );
    }
  };

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách chứng chỉ đã phát hành
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Quản lý mã chứng chỉ và thông tin bằng cấp của học viên
          </p>
        </div>
        {totalElements > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:text-accent-on-dark">
            {totalElements.toLocaleString()} chứng chỉ
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full table-fixed min-w-[900px]">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              {COLUMN_HEADERS.map((col) => (
                <TableHead
                  key={col.label}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.width} ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && certificates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    Đang tải danh sách chứng chỉ...
                  </div>
                </TableCell>
              </TableRow>
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMN_HEADERS.length} className="px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Award className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Chưa có chứng chỉ nào
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bấm &quot;Cấp chứng chỉ mới&quot; để tạo bằng cấp cho học viên.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id} className="transition-colors hover:bg-muted/50">
                  {/* Code */}
                  <TableCell className="w-[18%] px-4 py-3.5 font-mono text-xs font-semibold text-foreground truncate">
                    <span className="inline-block rounded-md border border-accent/20 bg-accent/10 px-2.5 py-1 text-accent dark:text-accent-on-dark font-mono font-semibold">
                      {cert.certificateCode}
                    </span>
                  </TableCell>

                  {/* Student */}
                  <TableCell className="w-[18%] px-4 py-3.5 font-semibold text-foreground text-xs truncate" title={cert.studentName}>
                    {cert.studentName || "Học viên"}
                  </TableCell>

                  {/* Course */}
                  <TableCell className="w-[30%] px-4 py-3.5 font-medium text-foreground text-xs truncate" title={cert.courseName}>
                    {cert.courseName}
                  </TableCell>

                  {/* Issued Date */}
                  <TableCell className="w-[11%] px-4 py-3.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {formatDate(cert.issuedDate)}
                  </TableCell>

                  {/* Expiry Date */}
                  <TableCell className="w-[11%] px-4 py-3.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {cert.expiryDate ? formatDate(cert.expiryDate) : "Vĩnh viễn"}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="w-[10%] px-4 py-3.5 text-center whitespace-nowrap">
                    {renderStatusBadge(cert.status)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="w-[12%] px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeMenu?.cert.id === cert.id) {
                            setActiveMenu(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const popUp = spaceBelow < 130;
                            setActiveMenu({
                              cert,
                              top: popUp ? rect.top - 120 : rect.bottom + 6,
                              left: Math.max(10, rect.right - 180),
                            });
                          }
                        }}
                        className="h-8 w-8 p-0 border border-border/60 hover:bg-muted hover:text-foreground cursor-pointer"
                        title="Thao tác"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Floating Action Menu Portal */}
      {activeMenu && (
        <div className="fixed inset-0 z-50 pointer-events-auto">
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setActiveMenu(null)}
          />
          <div
            style={{
              position: "fixed",
              top: `${activeMenu.top}px`,
              left: `${activeMenu.left}px`,
            }}
            className="w-48 bg-card rounded-xl shadow-2xl border border-border py-1.5 z-50 text-left"
          >
            <button
              type="button"
              onClick={() => {
                onView(activeMenu.cert);
                setActiveMenu(null);
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors text-left cursor-pointer"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span>Xem chi tiết</span>
            </button>
            <a
              href={`/verify-certificate?code=${encodeURIComponent(activeMenu.cert.certificateCode)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors text-left cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Tra cứu công khai</span>
            </a>
            <button
              type="button"
              onClick={() => {
                onPrint(activeMenu.cert);
                setActiveMenu(null);
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors text-left cursor-pointer"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
              <span>In / Tải PDF</span>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};
