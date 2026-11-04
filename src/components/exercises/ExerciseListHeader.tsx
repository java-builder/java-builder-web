"use client";

import { useI18n } from "@/contexts/I18nContext";

interface ExerciseListHeaderProps {
  totalExercises: number;
  quote?: {
    quote: string;
    author: string;
  };
}

export default function ExerciseListHeader({ totalExercises, quote }: ExerciseListHeaderProps) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-b border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
      {/* Ambient Orange Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.08),transparent_60%)]"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0E8] dark:bg-orange-950/40 text-[#FF5A1F] border border-[#FFD8C7] dark:border-orange-900/50 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
            <span>Luyện tập & Thực hành</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171717] dark:text-white mb-4 tracking-tight leading-tight">
            Kho Bài Tập <span className="text-[#FF5A1F]">Java Thực Chiến</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("exercisesPage.headerSubtitle")}
            <br className="hidden sm:inline" />{" "}
            {t("exercisesPage.headerDesc")}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-primary mb-0.5">
                {totalExercises}+
              </div>
              <div className="text-xs font-semibold text-text-muted">
                {t("exercisesPage.exerciseItemName")}
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-primary mb-0.5">
                3
              </div>
              <div className="text-xs font-semibold text-text-muted">
                {t("exercisesPage.statsDifficulty")}
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-primary mb-0.5">
                {t("exercisesPage.statsFree")}
              </div>
              <div className="text-xs font-semibold text-text-muted">
                100%
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-primary mb-0.5">
                {t("exercisesPage.statsAutoGrading")}
              </div>
              <div className="text-xs font-semibold text-text-muted">
                {t("exercisesPage.statsGrading")}
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          {quote && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-background rounded-2xl p-4 border border-border shadow-2xs">
                <div className="flex items-start gap-3 text-left">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground italic leading-relaxed">
                      &ldquo;{quote.quote}&rdquo;
                    </p>
                    <p className="text-xs text-primary mt-1 font-semibold">
                      — {quote.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
