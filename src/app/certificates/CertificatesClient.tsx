"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Award,
  Download,
  Eye,
  X,
  Check,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface Certificate {
  id: string;
  key: "cert1" | "cert2" | "cert3";
  title: string;
  desc: string;
  grade: string;
  issueDate: string;
  credentialId: string;
  icon: React.ReactNode;
}

export default function CertificatesClient() {
  const { t } = useI18n();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const certificates: Certificate[] = [
    {
      id: "1",
      key: "cert1",
      title: t("certificatesPage.cert1.title"),
      desc: t("certificatesPage.cert1.desc"),
      grade: t("certificatesPage.cert1.grade"),
      issueDate: "28/06/2026",
      credentialId: "JB-SEC-2026-892",
      icon: <ShieldCheck className="w-10 h-10 text-purple-500" />
    },
    {
      id: "2",
      key: "cert2",
      title: t("certificatesPage.cert2.title"),
      desc: t("certificatesPage.cert2.desc"),
      grade: t("certificatesPage.cert2.grade"),
      issueDate: "29/06/2026",
      credentialId: "JB-AI-2026-451",
      icon: <Sparkles className="w-10 h-10 text-pink-500" />
    },
    {
      id: "3",
      key: "cert3",
      title: t("certificatesPage.cert3.title"),
      desc: t("certificatesPage.cert3.desc"),
      grade: t("certificatesPage.cert3.grade"),
      issueDate: "30/06/2026",
      credentialId: "JB-DEP-2026-783",
      icon: <Award className="w-10 h-10 text-amber-500" />
    }
  ];

  const triggerPrint = (cert: Certificate) => {
    setSelectedCert(cert);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 no-print-layout">
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
        {/* Page Header */}
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            <Award className="w-3.5 h-3.5" />
            JavaBuilder Certification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t("certificatesPage.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            {t("certificatesPage.subtitle")}
          </p>
        </div>

        {/* Motivation/Description Banner */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-linear-to-r from-accent/5 to-transparent">
          <div className="p-3 rounded-xl bg-accent/10 text-accent flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {t("certificatesPage.certMotivation")}
          </p>
        </div>

        {/* Grid Layout of Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className="bg-card border border-border hover:border-accent/40 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group space-y-4"
            >
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
                    Lê Khánh Đức
                  </h4>
                  <h3 className="text-[7.5px] font-bold text-slate-700 dark:text-slate-300 leading-tight line-clamp-1 pt-0.5 px-1">
                    {cert.title}
                  </h3>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center z-10 text-[6px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 leading-none">
                  <span>{cert.issueDate}</span>
                  <span className="font-mono text-[5px] font-semibold text-slate-500">{cert.credentialId}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {cert.desc}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-border/60">
                  <button 
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    {t("certificatesPage.viewBtn")}
                  </button>
                  <button 
                    onClick={() => triggerPrint(cert)}
                    className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
                    title={t("certificatesPage.downloadBtn")}
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to display Certificate */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border shadow-2xl rounded-3xl w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-sm text-foreground">{t("certificatesPage.modalVerified")}</span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Certificate Viewer Body */}
            <div className="p-6 sm:p-10 overflow-y-auto flex justify-center bg-gray-100/50 dark:bg-slate-950/20">

              {/* World-Class Executive Certificate Canvas */}
              <div
                id="certificate-modal-content"
                className="w-full aspect-[1.414/1] min-w-[320px] max-w-[820px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-10 md:p-12 flex flex-col justify-between relative shadow-xl select-none overflow-hidden"
              >
                {/* Subtle Ambient Background Gradient */}
                <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Premium Corner Accents */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-500/35 rounded-tl-md pointer-events-none" />
                <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-500/35 rounded-tr-md pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-500/35 rounded-bl-md pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-500/35 rounded-br-md pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center z-10 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <Image
                        src="/logos/java-logo.png"
                        alt="JavaBuilder Logo"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-left leading-tight">
                      <h3 className="text-sm sm:text-base font-black tracking-widest text-slate-900 dark:text-white uppercase font-sans">
                        JAVABUILDER
                      </h3>
                      <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                        Official Online Certification
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
                    <p className="uppercase tracking-widest text-[9px] text-slate-400 font-semibold">Credential ID</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCert.credentialId}</p>
                  </div>
                </div>

                {/* Main Certificate Core */}
                <div className="my-auto py-4 sm:py-6 space-y-4 sm:space-y-5 z-10 text-center">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400 uppercase">
                      CHỨNG CHỈ HOÀN THÀNH KHOÁ HỌC
                    </p>
                    <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2 opacity-80" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium">
                      Chứng nhận này được trang trọng trao tặng cho
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight py-1">
                      Lê Khánh Đức
                    </h1>
                  </div>

                  <div className="space-y-2 max-w-xl mx-auto">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Vì đã hoàn thành xuất sắc chương trình đào tạo chuyên sâu &amp; kiểm tra năng lực:
                    </p>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                      {selectedCert.title}
                    </h2>
                  </div>
                </div>

                {/* Footer */}
                <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-end z-10 text-left">
                  <div className="w-1/3 space-y-1.5">
                    <div className="flex gap-4 sm:gap-6">
                      <div>
                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Ngày cấp</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCert.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Hạn dùng</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Vĩnh viễn</p>
                      </div>
                    </div>
                  </div>

                  {/* Official Red Ink Brand Seal */}
                  <div className="w-1/3 flex flex-col items-center justify-end -mb-1">
                    <div className="flex items-center justify-center relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-red-600/85 bg-red-500/5 rotate-[-6deg] shadow-2xs select-none">
                      <div className="absolute inset-1 rounded-full border border-dashed border-red-500/50 pointer-events-none" />
                      <div className="flex flex-col items-center justify-center text-center">
                        <ShieldCheck className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-red-600" />
                        <span className="text-[5.5px] sm:text-[6.5px] font-black tracking-widest text-red-600 uppercase mt-0.5 whitespace-nowrap">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                    <span className="text-[7.5px] sm:text-[8.5px] font-extrabold tracking-widest text-red-600 uppercase whitespace-nowrap mt-1 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/40 rotate-[-2deg]">
                      OFFICIAL CERTIFICATE
                    </span>
                  </div>

                  <div className="w-1/3 text-right">
                    <div className="h-6 sm:h-7 flex items-end justify-end mb-1">
                      <span className="font-serif italic text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 select-none">
                        JavaBuilder
                      </span>
                    </div>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider border-t border-slate-200 dark:border-slate-800 pt-1 inline-block">
                      JavaBuilder Certification Authority
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/40">
              <button
                onClick={() => setSelectedCert(null)}
                className="h-10 px-4 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                {t("certificatesPage.modalClose")}
              </button>
              <button
                onClick={() => triggerPrint(selectedCert)}
                className="h-10 px-5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-600 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t("certificatesPage.downloadBtn")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Hidden print container containing active certificate only */}
      {selectedCert && (
        <div className="hidden print-container">
          <div className="w-full h-full flex items-center justify-center bg-white p-12">
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "48px",
                width: "297mm",
                height: "210mm",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                background: "#ffffff"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Image
                    src="/logos/java-logo.png"
                    alt="JavaBuilder Logo"
                    width={36}
                    height={36}
                    style={{ objectFit: "contain" }}
                  />
                  <div style={{ textAlign: "left", lineHeight: "1.2" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "0.1em", color: "#0f172a", textTransform: "uppercase", margin: 0 }}>
                      JAVABUILDER
                    </h3>
                    <p style={{ fontSize: "10px", fontWeight: "600", color: "#d97706", textTransform: "uppercase", margin: "2px 0 0 0" }}>
                      Official Online Certification
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right", fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                  <p style={{ textTransform: "uppercase", fontSize: "9px", margin: 0 }}>Credential ID</p>
                  <p style={{ fontWeight: "700", color: "#0f172a", margin: "2px 0 0 0" }}>{selectedCert.credentialId}</p>
                </div>
              </div>

              <div style={{ textAlign: "center", margin: "auto 0" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.25em", color: "#d97706", textTransform: "uppercase", margin: "0 0 16px 0" }}>
                  CHỨNG CHỈ HOÀN THÀNH KHOÁ HỌC
                </p>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 8px 0" }}>
                  Chứng nhận này được trang trọng trao tặng cho
                </p>
                <h1 style={{ fontSize: "38px", fontWeight: "900", color: "#0f172a", fontFamily: "serif", margin: "0 0 16px 0" }}>
                  Lê Khánh Đức
                </h1>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 8px 0" }}>
                  Vì đã hoàn thành xuất sắc chương trình đào tạo chuyên sâu &amp; kiểm tra năng lực:
                </p>
                <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: 0, maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
                  {selectedCert.title}
                </h2>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                <div style={{ width: "33%", textAlign: "left", display: "flex", gap: "16px" }}>
                  <div>
                    <p style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", margin: "0 0 2px 0" }}>Ngày cấp</p>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{selectedCert.issueDate}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", margin: "0 0 2px 0" }}>Hạn dùng</p>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Vĩnh viễn</p>
                  </div>
                </div>

                <div style={{ width: "33%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", marginBottom: "-4px" }}>
                  <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #dc2626", background: "rgba(239, 68, 68, 0.05)", transform: "rotate(-6deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", inset: "4px", borderRadius: "50%", border: "1px dashed rgba(239, 68, 68, 0.5)" }} />
                    <svg style={{ width: "24px", height: "24px", color: "#dc2626" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span style={{ fontSize: "6.5px", fontWeight: "900", letterSpacing: "0.15em", color: "#dc2626", textTransform: "uppercase", marginTop: "2px", whiteSpace: "nowrap" }}>VERIFIED</span>
                  </div>
                  <span style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "0.1em", color: "#dc2626", textTransform: "uppercase", marginTop: "4px", background: "#fef2f2", padding: "2px 8px", borderRadius: "4px", border: "1px solid #fecaca", transform: "rotate(-2deg)" }}>
                    OFFICIAL CERTIFICATE
                  </span>
                </div>

                <div style={{ width: "33%", textAlign: "right" }}>
                  <p style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>JavaBuilder</p>
                  <p style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", borderTop: "1px solid #e2e8f0", paddingTop: "4px", display: "inline-block", margin: 0 }}>
                    JavaBuilder Certification Authority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
