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
    <section className="relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-purple-500/5 to-blue-500/5 dark:from-blue-950 dark:via-slate-950 dark:to-purple-950" />
      
      {/* Floating Tech Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Code Icon - Top Left */}
        <div className="absolute top-12 left-8 animate-float opacity-20 dark:opacity-30">
          <svg className="w-16 h-16 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Document Icon - Top Right */}
        <div className="absolute top-16 right-12 animate-float-delayed opacity-20 dark:opacity-30" style={{ animationDelay: '1s' }}>
          <svg className="w-20 h-20 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Pencil Icon - Middle Left */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 animate-float opacity-20 dark:opacity-30" style={{ animationDelay: '2s' }}>
          <svg className="w-14 h-14 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
        
        {/* Check Circle Icon - Middle Right */}
        <div className="absolute top-1/2 -translate-y-1/2 right-8 animate-float-delayed opacity-20 dark:opacity-30" style={{ animationDelay: '0.5s' }}>
          <svg className="w-18 h-18 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Star Icon - Bottom Left */}
        <div className="absolute bottom-20 left-16 animate-float opacity-20 dark:opacity-30" style={{ animationDelay: '1.5s' }}>
          <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        
        {/* Lightning Icon - Bottom Right */}
        <div className="absolute bottom-24 right-20 animate-float-delayed opacity-20 dark:opacity-30" style={{ animationDelay: '2.5s' }}>
          <svg className="w-14 h-14 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
 
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600 dark:from-cyan-300 dark:to-purple-300">
              {t("exercisesPage.title")}
            </span>
          </h1>
 
          <p className="text-lg text-gray-600 dark:text-gray-200 mb-8 leading-relaxed">
            {t("exercisesPage.headerSubtitle")}
            <br />
            {t("exercisesPage.headerDesc")}
          </p>
 
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent dark:text-blue-400 mb-1">
                {totalExercises}+
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-200">
                {t("exercisesPage.exerciseItemName")}
              </div>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-slate-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent dark:text-blue-400 mb-1">
                3
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-200">
                {t("exercisesPage.statsDifficulty")}
              </div>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-slate-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent dark:text-blue-400 mb-1">
                {t("exercisesPage.statsFree")}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-200">
                100%
              </div>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-slate-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent dark:text-blue-400 mb-1">
                {t("exercisesPage.statsAutoGrading")}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-200">
                {t("exercisesPage.statsGrading")}
              </div>
            </div>
          </div>
 
          {/* Motivational Quote - Compact in Banner */}
          {quote && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200/50 dark:border-slate-700 shadow-sm dark:shadow-black/30">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent dark:text-cyan-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white italic leading-relaxed">
                      {quote.quote}
                    </p>
                    <p className="text-xs text-accent dark:text-cyan-300 mt-1 font-medium">
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
