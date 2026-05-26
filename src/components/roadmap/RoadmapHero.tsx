"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { FaMapSigns } from "react-icons/fa";
import { useI18n } from "@/contexts/I18nContext";

export default function RoadmapHero() {
  const { t } = useI18n();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-6 md:py-8 lg:py-10 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 dark:bg-accent/20 rounded-full mb-4">
              <FaMapSigns className="text-accent text-sm" />
              <span className="text-xs font-medium text-accent">{t("roadmapPage.heroBadge")}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {t("roadmapPage.heroTitle")}
              <span className="block text-accent mt-1">Backend Developer</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {t("roadmapPage.heroDesc")}
            </p>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
