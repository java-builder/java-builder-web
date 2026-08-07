"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Award, Check, Copy, Download, Share2, ShieldCheck, X } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { CertificateDetailResponse } from "@/types/certificate";
import { Button } from "@/components/ui/button";

interface CertificateDetailModalProps {
  cert: CertificateDetailResponse;
  studentName: string;
  onClose: () => void;
  onPrint: (cert: CertificateDetailResponse) => void;
}

export default function CertificateDetailModal({
  cert,
  studentName,
  onClose,
  onPrint,
}: CertificateDetailModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const getCertificateShareUrl = () => {
    if (cert.verifyUrl) {
      return cert.verifyUrl;
    }
    if (cert.certificateUrl && cert.certificateUrl.startsWith("http")) {
      return cert.certificateUrl;
    }
    if (typeof window !== "undefined") {
      const code = cert.certificateCode || cert.id;
      const baseOrigin =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "https://javabuilder.online"
          : window.location.origin;
      return `${baseOrigin}/verify-certificate?code=${encodeURIComponent(code)}`;
    }
    return "";
  };

  const handleShareLinkedIn = () => {
    const url = getCertificateShareUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    setShowShareMenu(false);
  };

  const handleShareFacebook = () => {
    const url = getCertificateShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    setShowShareMenu(false);
  };

  const handleCopyShareLink = () => {
    const url = getCertificateShareUrl();
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    setShowShareMenu(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyCode = () => {
    if (cert.certificateCode) {
      navigator.clipboard.writeText(cert.certificateCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border shadow-2xl rounded-3xl w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-sm text-foreground">{t("certificatesPage.modalVerified")}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Certificate Viewer Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex justify-center bg-slate-100/70 dark:bg-slate-950/40">

          {/* World-Class Executive Certificate Canvas */}
          <div
            id="certificate-modal-content"
            className="w-full aspect-[1.414/1] min-w-[320px] max-w-[820px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-7 md:p-9 flex flex-col justify-between relative shadow-xl select-none overflow-hidden"
          >
            {/* Subtle Ambient Background Gradient */}
            <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Premium Corner Accents */}
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-l-2 border-amber-500/35 rounded-tl-md pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-r-2 border-amber-500/35 rounded-tr-md pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-l-2 border-amber-500/35 rounded-bl-md pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-r-2 border-amber-500/35 rounded-br-md pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center z-10 border-b border-slate-100 dark:border-slate-800/80 pb-2 sm:pb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                  <Image
                    src="/logos/java-logo.png"
                    alt="JavaBuilder Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="text-left leading-tight">
                  <h3 className="text-xs sm:text-sm md:text-base font-black tracking-widest text-slate-900 dark:text-white uppercase font-sans">
                    JAVABUILDER
                  </h3>
                  <p className="text-[7.5px] sm:text-[9px] font-semibold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                    Official Online Certification
                  </p>
                </div>
              </div>

              <div className="text-right text-[8px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
                <p className="uppercase tracking-widest text-[7.5px] sm:text-[9px] text-slate-400 font-semibold">Credential ID</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cert.certificateCode}</p>
              </div>
            </div>

            {/* Main Certificate Core */}
            <div className="my-auto py-1 sm:py-3 md:py-4 space-y-1.5 sm:space-y-3 z-10 text-center">
              <div>
                <p className="text-[8px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-amber-600 dark:text-amber-400 uppercase">
                  CHỨNG CHỈ HOÀN THÀNH KHOÁ HỌC
                </p>
                <div className="w-12 sm:w-16 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent mx-auto mt-1 opacity-80" />
              </div>

              <div className="space-y-0.5">
                <p className="text-[9.5px] sm:text-xs text-slate-400 dark:text-slate-400 font-medium">
                  Chứng nhận này được trang trọng trao tặng cho
                </p>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight py-0.5">
                  {cert.studentName || studentName}
                </h1>
              </div>

              <div className="space-y-0.5 sm:space-y-1 max-w-2xl mx-auto">
                <p className="text-[9.5px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Vì đã hoàn thành xuất sắc chương trình đào tạo chuyên sâu &amp; kiểm tra năng lực:
                </p>
                <h2 className="text-xs sm:text-base md:text-xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                  {cert.courseName}
                </h2>
              </div>
            </div>

            {/* Footer */}
            <div className="w-full pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-end z-10 text-left">
              {/* Issue & Expiry Dates */}
              <div className="w-1/3 space-y-0.5">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-5">
                  <div>
                    <p className="text-[7.5px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Ngày cấp</p>
                    <p className="text-[9.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(cert.issuedDate)}</p>
                  </div>
                  <div>
                    <p className="text-[7.5px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Hạn dùng</p>
                    <p className="text-[9.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cert.expiryDate ? formatDate(cert.expiryDate) : "Vĩnh viễn"}</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="text-[8.5px] sm:text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400 font-medium cursor-pointer inline-flex items-center gap-1 pt-0.5 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Đã sao chép" : "Sao chép mã"}
                </button>
              </div>

              {/* Official Authority Seal */}
              <div className="w-1/3 flex flex-col items-center justify-center space-y-0.5">
                <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="text-center">
                  <p className="text-[7.5px] sm:text-[9.5px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    JavaBuilder Authority
                  </p>
                  <p className="text-[7px] sm:text-[8.5px] text-slate-400 font-medium">Hội đồng xác thực</p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="w-1/3 flex flex-col items-end justify-center">
                <div className="p-1 sm:p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <QRCodeSVG
                    value={getCertificateShareUrl()}
                    size={55}
                    level="H"
                    includeMargin={false}
                    className="w-10 h-10 sm:w-14 sm:h-14"
                  />
                </div>
                <span className="text-[7px] sm:text-[8.5px] font-medium text-slate-400 mt-0.5 text-right">
                  Quét QR tra cứu
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/40 relative">
          {/* Public Verify Link */}
          <Link
            href={`/verify-certificate?code=${encodeURIComponent(cert.certificateCode)}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg border border-accent/20 bg-accent/10 text-accent hover:bg-accent/20 font-medium text-[0.8rem] transition-all cursor-pointer mr-auto"
            title="Mở trang tra cứu bảo chứng công khai"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tra cứu công khai</span>
          </Link>
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
                  onClick={handleShareLinkedIn}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  Chia sẻ lên LinkedIn
                </button>
                <button
                  type="button"
                  onClick={handleShareFacebook}
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
                  onClick={handleCopyShareLink}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
                >
                  {linkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  {linkCopied ? "Đã sao chép link!" : "Sao chép liên kết"}
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer font-medium"
          >
            {t("certificatesPage.modalClose")}
          </Button>

          {/* Download PDF Primary Accent Button */}
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => onPrint(cert)}
            className="gap-1.5 cursor-pointer font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("certificatesPage.downloadBtn")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
