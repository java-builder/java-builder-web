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
              <div className="w-full aspect-[1.414/1] bg-[#faf8f5] border-2 border-solid border-amber-800/40 rounded-xl p-3 flex flex-col justify-between text-center relative overflow-hidden shadow-2xs select-none">
                {/* Subtle Watermark background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
                  <Image 
                    src="/logos/java-logo.png" 
                    alt="JavaBuilder Logo Watermark" 
                    width={80} 
                    height={80}
                    className="object-contain"
                  />
                </div>

                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-white border border-amber-800/10 flex items-center justify-center">
                      <Image 
                        src="/logos/java-logo.png" 
                        alt="Java" 
                        width={10} 
                        height={10} 
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[7px] font-black tracking-widest text-amber-900/80 uppercase">JAVABUILDER</span>
                  </div>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[6px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <Check className="w-2.5 h-2.5" />
                    {t("certificatesPage.earnedBadge")}
                  </span>
                </div>

                <div className="my-1 z-10 text-center">
                  <p className="text-[7px] font-bold tracking-wider text-amber-700 uppercase leading-none">{t("certificatesPage.certTitle")}</p>
                  <p className="text-[5.5px] text-amber-900/50 italic mt-0.5 leading-none">presented to</p>
                  <h4 className="text-[9px] font-black text-amber-950 font-serif border-b border-amber-800/10 pb-0.5 w-fit mx-auto px-2 mt-0.5 leading-none">Lê Khánh Đức</h4>
                  <h3 className="text-[8px] font-black text-amber-900 leading-tight mt-1 px-1 line-clamp-2">
                    {cert.title}
                  </h3>
                </div>

                <div className="flex justify-between items-end z-10 text-[6px] text-muted-foreground/80 leading-none">
                  <div className="text-left">
                    <p className="font-semibold text-[5.5px]">{cert.issueDate}</p>
                    <p className="font-mono mt-0.5 text-[5px]">{cert.credentialId}</p>
                  </div>
                  <div className="w-5.5 h-5.5 bg-red-500/5 rounded-full border border-red-500/35 flex items-center justify-center text-red-600/90 flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
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

                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <button 
                    onClick={() => setSelectedCert(cert)}
                    className="flex-grow inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t("certificatesPage.viewBtn")}
                  </button>
                  <button 
                    onClick={() => triggerPrint(cert)}
                    className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-600 active:scale-[0.98] transition-all cursor-pointer"
                    title={t("certificatesPage.downloadBtn")}
                  >
                    <Download className="w-3.5 h-3.5" />
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

              {/* Premium Realistic Certificate Container */}
              <div
                id="certificate-modal-content"
                className="w-full aspect-[1.414/1] min-w-[320px] max-w-[800px] bg-[#faf8f5] text-amber-950 border-2 sm:border-4 border-solid border-amber-800/85 rounded-2xl pt-4 pb-7 px-4 sm:pt-6 sm:pb-10 sm:px-6 md:pt-8 md:pb-12 md:px-8 flex flex-col justify-between text-center relative shadow-lg select-none"
              >

                {/* Subtle Watermark background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
                  <Image
                    src="/logos/java-logo.png"
                    alt="JavaBuilder Logo Watermark"
                    width={280}
                    height={280}
                    className="object-contain"
                  />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center z-10 border-b border-amber-900/10 pb-2 sm:pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-amber-800/20 flex items-center justify-center shadow-xs">
                      <Image
                        src="/logos/java-logo.png"
                        alt="JavaBuilder"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-left leading-none">
                      <p className="text-[10px] sm:text-xs font-black tracking-widest text-amber-900 uppercase">JAVABUILDER</p>
                      <p className="text-[6px] sm:text-[7px] font-bold text-amber-700/60 uppercase tracking-widest mt-0.5">Online Platform</p>
                    </div>
                  </div>
                  <div className="text-right text-[7px] sm:text-[8px] font-semibold text-amber-900/60 font-mono">
                    <p>{t("certificatesPage.modalVerification")}</p>
                    <p className="text-[8px] sm:text-[9px] font-bold text-amber-900 mt-0.5">{selectedCert.credentialId}</p>
                  </div>
                </div>

                {/* Certificate Core Text */}
                <div className="my-auto space-y-2 sm:space-y-3 z-10 py-2 sm:py-4">
                  <div>
                    <h2 className="text-xs sm:text-sm md:text-base font-black tracking-widest text-amber-800 uppercase">
                      {t("certificatesPage.certTitle")}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-0.5 sm:mt-1">
                      <div className="h-0.5 w-5 bg-amber-800/40" />
                      <Award className="w-3 h-3 text-amber-600" />
                      <div className="h-0.5 w-5 bg-amber-800/40" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-[8px] sm:text-[9px] text-amber-900/80 italic font-medium">
                      {t("certificatesPage.presentedTo")}
                    </p>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-amber-950 font-serif tracking-wide border-b border-amber-800/20 w-fit mx-auto px-4 pb-0.5">
                      Lê Khánh Đức
                    </h1>
                  </div>

                  <div className="space-y-0.5 max-w-md mx-auto">
                    <p className="text-[8px] sm:text-[9px] text-amber-900/80 leading-relaxed font-medium">
                      {t("certificatesPage.forCompleting")}
                    </p>
                    <h3 className="text-[10px] sm:text-xs md:text-sm font-extrabold text-amber-900 leading-snug">
                      {selectedCert.title}
                    </h3>
                  </div>
                </div>

                {/* Signatures and Seals */}
                <div className="flex justify-between items-end z-10 border-t border-amber-900/10 pt-2 sm:pt-3 text-left px-2">
                  <div className="w-1/3">
                    <p className="text-[6px] sm:text-[7px] text-amber-900/50 uppercase font-semibold">{t("certificatesPage.issueDate")}</p>
                    <p className="text-[8px] sm:text-[9px] text-amber-955 font-bold mt-0.5">{selectedCert.issueDate}</p>
                  </div>

                  {/* Decorative red ink brand seal - Option 2 (Larger) */}
                  <div className="w-1/3 flex flex-col items-center justify-end">
                    <div className="flex items-center justify-center relative w-14 h-14 sm:w-20 sm:h-20 bg-red-500/5 rounded-full border-[2.5px] border-red-600/80 flex-shrink-0 rotate-[-6deg]">
                      <div className="absolute inset-0.5 sm:inset-1 border border-dashed border-red-500/45 rounded-full pointer-events-none" />
                      <ShieldCheck className="w-6.5 h-6.5 sm:w-9 sm:h-9 text-red-600/90" />
                    </div>
                    <span className="text-[6px] sm:text-[8.5px] font-black tracking-widest text-red-600/95 uppercase whitespace-nowrap mt-2 sm:mt-3 bg-red-50/50 dark:bg-slate-950/40 px-2 py-0.5 sm:px-3 sm:py-1 rounded border border-red-500/15 rotate-[-3deg]">
                      {t("certificatesPage.modalVerified")}
                    </span>
                  </div>

                  <div className="w-1/3 text-right">
                    {/* Handwritten signature mockup */}
                    <div className="h-5 sm:h-7 flex items-end justify-end mb-0.5">
                      <span className="font-serif italic text-xs sm:text-sm text-amber-800/80 select-none mr-2">JavaBuilder</span>
                    </div>
                    <p className="text-[6px] sm:text-[7px] text-amber-900/50 uppercase font-semibold border-t border-amber-800/20 pt-0.5 inline-block">
                      {t("certificatesPage.platformFounder")}
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
                color: "#1a1a1a",
                border: "3px solid rgba(133, 77, 14, 0.85)",
                borderRadius: "16px",
                padding: "48px",
                width: "297mm",
                height: "210mm",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
                position: "relative",
                background: "#faf8f5"
              }}
            >

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(133, 77, 14, 0.1)", paddingBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logos/java-logo.png"
                    alt="JavaBuilder"
                    style={{ width: "32px", height: "32px", objectFit: "contain" }}
                  />
                  <div style={{ textAlign: "left", lineHeight: "1" }}>
                    <p style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "0.15em", color: "#451a03", margin: 0 }}>JAVABUILDER</p>
                    <p style={{ fontSize: "8px", fontWeight: "700", color: "#b45309", textTransform: "uppercase", letterSpacing: "0.15em", margin: "2px 0 0 0" }}>Online Platform</p>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "10px", fontWeight: "600", color: "rgba(133, 77, 14, 0.6)", fontFamily: "monospace" }}>
                  <p style={{ margin: 0 }}>{t("certificatesPage.modalVerification")}</p>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "#451a03", margin: "2px 0 0 0" }}>{selectedCert.credentialId}</p>
                </div>
              </div>

              <div style={{ margin: "auto 0", padding: "24px 0" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "0.15em", color: "#9a3412", textTransform: "uppercase", margin: 0 }}>
                  {t("certificatesPage.certTitle")}
                </h2>
                <p style={{ fontSize: "12px", color: "#451a03", fontStyle: "italic", margin: "16px 0 4px 0", fontWeight: "500" }}>
                  {t("certificatesPage.presentedTo")}
                </p>
                <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#451a03", borderBottom: "2px solid rgba(133, 77, 14, 0.2)", width: "fit-content", margin: "0 auto", padding: "0 24px 4px 24px", fontFamily: "serif" }}>
                  Lê Khánh Đức
                </h1>
                <p style={{ fontSize: "11px", color: "#451a03", margin: "16px 0 4px 0", fontWeight: "500" }}>
                  {t("certificatesPage.forCompleting")}
                </p>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#451a03", margin: 0 }}>
                  {selectedCert.title}
                </h3>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", borderTop: "1px solid rgba(133, 77, 14, 0.1)", paddingTop: "16px", textAlign: "left" }}>
                <div style={{ width: "33%" }}>
                  <p style={{ fontSize: "9px", color: "rgba(133, 77, 14, 0.5)", textTransform: "uppercase", fontWeight: "600", margin: 0 }}>{t("certificatesPage.issueDate")}</p>
                  <p style={{ fontSize: "12px", color: "#451a03", fontWeight: "700", margin: "2px 0 0 0" }}>{selectedCert.issueDate}</p>
                </div>

                <div style={{ width: "33%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "end" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "80px", height: "80px", borderRadius: "50%", border: "2.5px solid #dc2626", background: "rgba(220, 38, 38, 0.05)", transform: "rotate(-6deg)" }}>
                    <div style={{ position: "absolute", inset: "4px", border: "1px dashed rgba(220, 38, 38, 0.4)", borderRadius: "50%" }} />
                    {/* ShieldCheck SVG */}
                    <svg style={{ width: "36px", height: "36px", color: "#dc2626" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "8.5px", fontWeight: "900", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "10px", whiteSpace: "nowrap", border: "1px solid rgba(220, 38, 38, 0.15)", background: "rgba(220, 38, 38, 0.02)", padding: "2px 6px", borderRadius: "3px", transform: "rotate(-3deg)" }}>{t("certificatesPage.modalVerified")}</span>
                </div>

                <div style={{ width: "33%", textAlign: "right" }}>
                  <div style={{ height: "32px", display: "flex", alignItems: "end", justifyContent: "end", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "20px", color: "rgba(133, 77, 14, 0.8)" }}>JavaBuilder</span>
                  </div>
                  <p style={{ fontSize: "9px", color: "rgba(133, 77, 14, 0.5)", textTransform: "uppercase", fontWeight: "600", borderTop: "1px solid rgba(133, 77, 14, 0.2)", paddingTop: "4px", display: "inline-block", margin: 0 }}>
                    {t("certificatesPage.platformFounder")}
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
