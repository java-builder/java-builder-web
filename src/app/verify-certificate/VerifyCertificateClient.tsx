"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Search,
  Share2,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  Check,
  Lock,
  QrCode,
  FileCheck2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { certificateApi } from "@/services/certificate.service";
import { CertificateDetailResponse } from "@/types/certificate";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const SAMPLE_CODES = ["JB-SEC-2026-892", "CERT-2026-SPRING88", "JB-DEV-2026-102"];

export default function VerifyCertificateClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeParam = searchParams.get("code") || "";

  const [inputCode, setInputCode] = useState(codeParam);
  const [cert, setCert] = useState<CertificateDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const fetchCertificate = useCallback(async (codeToSearch: string) => {
    if (!codeToSearch.trim()) {
      setCert(null);
      setError("");
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const response = await certificateApi.getCertificateByCode(codeToSearch.trim());
      if (response && response.data) {
        setCert(response.data);
      } else {
        setCert(null);
        setError("Không tìm thấy thông tin chứng chỉ với mã tra cứu này.");
      }
    } catch (err: unknown) {
      console.error("Error verifying certificate:", err);
      setCert(null);
      setError("Mã tra cứu không tồn tại hoặc chứng chỉ đã bị xóa khỏi hệ thống.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (codeParam) {
      setInputCode(codeParam);
      fetchCertificate(codeParam);
    }
  }, [codeParam, fetchCertificate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      toast.error("Vui lòng nhập mã chứng chỉ cần tra cứu");
      return;
    }
    router.push(`/verify-certificate?code=${encodeURIComponent(inputCode.trim())}`);
  };

  const handleSampleClick = (code: string) => {
    setInputCode(code);
    router.push(`/verify-certificate?code=${encodeURIComponent(code)}`);
  };

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

  const getVerifyUrl = () => {
    if (cert?.verifyUrl) return cert.verifyUrl;
    if (typeof window !== "undefined") {
      const code = cert?.certificateCode || inputCode;
      return `${window.location.origin}/verify-certificate?code=${encodeURIComponent(code)}`;
    }
    return "";
  };

  const handleCopyLink = () => {
    const url = getVerifyUrl();
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    toast.success("Đã sao chép liên kết tra cứu!");
    setTimeout(() => setLinkCopied(false), 2000);
    setShowShareMenu(false);
  };

  const handleCopyCode = () => {
    if (cert?.certificateCode) {
      navigator.clipboard.writeText(cert.certificateCode);
      setCodeCopied(true);
      toast.success("Đã sao chép mã chứng chỉ!");
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Print-only CSS style */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white !important; color: black !important; }
          .no-print-area { display: none !important; }
          .print-certificate-box {
            display: block !important;
            box-shadow: none !important;
            border: 2px solid #cbd5e1 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 1000px !important;
          }
        }
      `}} />

      {/* Page Header (Consistent System Style) */}
      <div className="space-y-2 text-left no-print-area">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Hệ Thống Tra Cứu &amp; Bảo Chứng Chứng Chỉ Official</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Xác Thực Chứng Chỉ JavaBuilder
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
          Nhập mã tra cứu bảo chứng để kiểm tra tính hợp lệ và thông tin bằng cấp được phát hành chính thức bởi JavaBuilder Authority.
        </p>
      </div>

      {/* Search & Filter Card (Identical System Card Component Style) */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs no-print-area">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Tra Cứu Mã Bảo Chứng
            </h3>
          </div>

          {/* Quick Sample Code Suggestions */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground text-xs font-medium">Mã mẫu:</span>
            {SAMPLE_CODES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleSampleClick(code)}
                className="px-2 py-0.5 rounded-md border border-border bg-muted/60 hover:bg-muted font-mono text-[11px] font-semibold text-accent transition-colors cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-5">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Nhập mã chứng chỉ (VD: JB-SEC-2026-892 hoặc CERT-2026-XXXXXXXXXX)..."
                className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors shadow-xs"
              />
              {inputCode && (
                <button
                  type="button"
                  onClick={() => { setInputCode(""); setCert(null); setError(""); setHasSearched(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="sm"
              className="h-10 px-6 font-semibold gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tra cứu...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tra Cứu Bằng</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Error / Not Found State */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 sm:p-8 text-center space-y-3 shadow-xs no-print-area">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
            <XCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">
            Không tìm thấy thông tin chứng chỉ
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {error}
          </p>
        </div>
      )}

      {/* Default System Info Cards (When no certificate searched yet) */}
      {!hasSearched && !isLoading && (
        <div className="space-y-6 no-print-area">
          {/* 3 Pillars Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Bảo Chứng Định Danh</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mỗi chứng chỉ được cấp duy nhất một mã tra cứu định danh để chống giả mạo bằng cấp.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Quét Mã QR Tức Thì</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Quét mã QR trực tiếp trên bằng cấp để xem bản chính thức được xác nhận từ máy chủ.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Chia Sẻ Nhà Tuyển Dụng</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nhúng liên kết xác thực vào Hồ sơ xin việc, LinkedIn giúp nhà tuyển dụng dễ dàng đối soát.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verified Certificate Card Result */}
      {cert && !isLoading && (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className="no-print-area">
            {cert.status === "ISSUED" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      Chứng Chỉ Chính Thức - Hợp Lệ (Verified Official)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Bằng cấp này được phát hành bởi JavaBuilder Certification Authority và đã qua kiểm định tính hợp lệ.
                    </p>
                  </div>
                </div>
              </div>
            ) : cert.status === "EXPIRED" ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    Chứng Chỉ Đã Hết Hạn (Expired Certificate)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hạn hiệu lực của chứng chỉ này đã kết thúc. Học viên cần thực hiện gia hạn/kiểm tra lại năng lực.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 sm:p-5 flex items-center gap-3">
                <XCircle className="h-6 w-6 text-rose-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Chứng Chỉ Đã Bị Thu Hồi (Revoked Certificate)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chứng chỉ này đã bị vô hiệu hóa hoặc thu hồi bởi quản trị viên hệ thống.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Certificate Frame Paper UI */}
          <div className="print-certificate-box bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-center space-y-6">
            {/* Ambient Background Radial */}
            <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Corner Decorative Borders */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-sm pointer-events-none" />

            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 shrink-0">
                  <Image
                    src="/logos/java-logo.png"
                    alt="JavaBuilder Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <span className="text-base font-black tracking-widest text-slate-900 dark:text-white uppercase font-sans">
                  JAVABUILDER
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED OFFICIAL
              </div>
            </div>

            {/* Certificate Title & Student */}
            <div className="space-y-4 relative z-10 py-2">
              <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400 uppercase">
                CHỨNG CHỈ HOÀN THÀNH XUẤT SẮC
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto opacity-80" />

              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Trao tặng cho học viên:
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
                {cert.studentName || "Học viên"}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed pt-1">
                Vì đã hoàn thành xuất sắc chương trình kiểm định &amp; đánh giá năng lực lập trình chuyên sâu:
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                {cert.courseName}
              </h3>
            </div>

            {/* Verification QR & Details Grid */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-left">
              {/* Issue Details */}
              <div className="space-y-2 w-full sm:w-1/3">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Ngày cấp</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(cert.issuedDate)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Hạn hiệu lực</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cert.expiryDate ? formatDate(cert.expiryDate) : "Vĩnh viễn"}</p>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Mã bảo chứng</p>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer mt-0.5"
                  >
                    <span>{cert.certificateCode}</span>
                    {codeCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Center Official Seal */}
              <div className="flex flex-col items-center justify-center w-full sm:w-1/3">
                <div className="flex items-center justify-center relative w-16 h-16 rounded-full border-2 border-red-600/85 bg-red-500/5 rotate-[-6deg] shadow-xs select-none">
                  <div className="absolute inset-1 rounded-full border border-dashed border-red-500/50 pointer-events-none" />
                  <div className="flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="w-6 h-6 text-red-600" />
                    <span className="text-[6.5px] font-black tracking-widest text-red-600 uppercase mt-0.5 whitespace-nowrap">
                      VERIFIED
                    </span>
                  </div>
                </div>
                <span className="text-[8.5px] font-extrabold tracking-widest text-red-600 uppercase whitespace-nowrap mt-1 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/40 rotate-[-2deg]">
                  OFFICIAL CERTIFICATE
                </span>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center sm:items-end justify-center w-full sm:w-1/3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <QRCodeSVG
                    value={getVerifyUrl()}
                    size={90}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <span className="text-[9px] font-medium text-slate-400 mt-1.5 text-center sm:text-right">
                  Quét QR để tra cứu công khai
                </span>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="no-print-area pt-4 border-t border-border flex items-center justify-end gap-2">
              {/* Share Dropdown Button */}
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="gap-1.5 cursor-pointer font-medium"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chia sẻ</span>
                </Button>

                {showShareMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-52 bg-card border border-border shadow-2xl rounded-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getVerifyUrl())}`, "_blank");
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                      Chia sẻ lên LinkedIn
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getVerifyUrl())}`, "_blank");
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 3h-2.33v6.8c4.56-.93 8-4.96 8-9.8z" />
                      </svg>
                      Chia sẻ lên Facebook
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
                    >
                      {linkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      {linkCopied ? "Đã sao chép link!" : "Sao chép liên kết"}
                    </button>
                  </div>
                )}
              </div>

              {/* Print / Download Button */}
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>In / Tải PDF</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
