"use client";

import { Award } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function MyCertificatesHeader() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
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
    </div>
  );
}
