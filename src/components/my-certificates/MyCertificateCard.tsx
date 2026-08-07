"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Download, Eye, Share2, ShieldCheck } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { CertificateDetailResponse } from "@/types/certificate";

interface MyCertificateCardProps {
  cert: CertificateDetailResponse;
  studentName: string;
  onView: (cert: CertificateDetailResponse) => void;
  onPrint: (cert: CertificateDetailResponse) => void;
}

export default function MyCertificateCard({
  cert,
  studentName,
  onView,
  onPrint,
}: MyCertificateCardProps) {
  const { t } = useI18n();
  const [showShare, setShowShare] = useState(false);

  const getShareUrl = () => {
    if (cert.verifyUrl) return cert.verifyUrl;
    if (typeof window !== "undefined") {
      return `${window.location.origin}/verify-certificate?code=${encodeURIComponent(cert.certificateCode)}`;
    }
    return "";
  };

  const handleShareLinkedIn = () => {
    const url = getShareUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    setShowShare(false);
  };

  const handleShareFacebook = () => {
    const url = getShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    setShowShare(false);
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

  return (
    <div className="bg-card border border-border hover:border-accent/40 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group space-y-4">
      {/* Mini Certificate Preview Header */}
      <div className="w-full aspect-[1.414/1] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden shadow-2xs select-none">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Premium Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-amber-500/40 rounded-tl-xs pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-amber-500/40 rounded-tr-xs pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center z-10 border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="relative w-4 h-4 flex-shrink-0">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder Logo"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span className="text-[7.5px] font-black tracking-widest text-slate-900 dark:text-white uppercase font-sans">
              JAVABUILDER
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[5.5px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <Check className="w-2 h-2" />
            VERIFIED
          </span>
        </div>

        {/* Core */}
        <div className="my-1 z-10 text-center space-y-0.5">
          <p className="text-[5.5px] font-bold tracking-[0.2em] text-amber-600 dark:text-amber-400 uppercase">CHỨNG CHỈ HOÀN THÀNH</p>
          <h4 className="text-[9.5px] font-extrabold text-slate-900 dark:text-white font-serif leading-none pt-0.5">
            {cert.studentName || studentName}
          </h4>
          <h3 className="text-[7.5px] font-bold text-slate-700 dark:text-slate-300 leading-tight line-clamp-1 pt-0.5 px-1">
            {cert.courseName}
          </h3>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end z-10 text-[6px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 leading-none">
          <div className="text-left">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(cert.issuedDate)}</span>
            <p className="font-mono text-[5px] text-slate-400 mt-0.5">{cert.certificateCode}</p>
          </div>
          <div className="w-5 h-5 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
            {cert.courseName}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
            Mã chứng chỉ: {cert.certificateCode}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-border/60 relative">
          <button
            onClick={() => onView(cert)}
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            {t("certificatesPage.viewBtn")}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
              title="Chia sẻ chứng chỉ"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-500" />
            </button>

            {showShare && (
              <div className="absolute right-0 bottom-10 w-48 bg-card border border-border shadow-2xl rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={handleShareLinkedIn}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted rounded-xl transition-colors text-left cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  LinkedIn
                </button>
                <button
                  onClick={handleShareFacebook}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted rounded-xl transition-colors text-left cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 3h-2.33v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onPrint(cert)}
            className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
            title={t("certificatesPage.downloadBtn")}
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
