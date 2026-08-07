"use client";

import Link from "next/link";
import { Award, ShieldCheck } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";

export default function MyCertificatesHeader() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
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

        {/* Quick Link to Verify Certificate Page */}
        <Link href="/verify-certificate">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 rounded-xl border-accent/30 bg-accent/5 hover:bg-accent/15 text-accent font-semibold text-xs sm:text-sm gap-2 cursor-pointer transition-all shadow-xs shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tra Cứu &amp; Bảo Chứng</span>
          </Button>
        </Link>
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
