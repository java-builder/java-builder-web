"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { CourseDetailResponse, CourseFormat, CourseLevel } from "@/types/course";

interface CourseSidebarProps {
  course: CourseDetailResponse;
  isEnrolled: boolean;
  isFavorite: boolean;
  favoriteLoading: boolean;
  onPayment: () => void;
  onToggleFavorite: () => void;
  formatPrice: (price: number) => string;
  getLevelText: (level: CourseLevel) => string;
}

export default function CourseSidebar({
  course,
  isEnrolled,
  isFavorite,
  favoriteLoading,
  onPayment,
  onToggleFavorite,
  formatPrice,
  getLevelText,
}: CourseSidebarProps) {
  const { t } = useI18n();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sticky top-8 border border-gray-200 dark:border-slate-700">
      {/* Price / Enrolled Status */}
      <div className="text-center mb-5">
        {isEnrolled ? (
          <>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 border bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                {t("courseDetail.enrolled")}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("courseDetail.fullAccess")}
            </p>
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-accent dark:text-accent-400 mb-2">
              {formatPrice(course.price)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("courseDetail.lifetimeAccess")}
            </p>
          </>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2.5 mb-6">
        {isEnrolled ? (
          <Link
            href={
              course.courseFormat === CourseFormat.TEXT
                ? `/docs/${course.slug}`
                : `/learn/${course.slug}/${course.id}`
            }
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-xs hover:shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            {t("courseDetail.learnNow")}
          </Link>
        ) : (
          <button
            onClick={onPayment}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
          >
            {t("courseDetail.enrollNow")}
          </button>
        )}
        <button
          onClick={onToggleFavorite}
          disabled={favoriteLoading}
          className={`w-full font-bold py-2.5 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-98 ${
            isFavorite
              ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 dark:bg-rose-400/10 dark:hover:bg-rose-400/15 dark:text-rose-400 dark:border-rose-400/25 dark:hover:border-rose-400/35"
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-300 dark:border-slate-600 dark:hover:border-slate-500"
          }`}
        >
          {favoriteLoading ? (
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
          <span>{isFavorite ? t("courseDetail.favorited") : t("courseDetail.addFavorite")}</span>
        </button>
      </div>

      {/* Course Stats */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
          {t("courseDetail.courseInfo")}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("courseDetail.level")}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {getLevelText(course.level || CourseLevel.BEGINNER)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("courseDetail.duration")}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {course.duration || 0} {t("courseDetail.hours")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{t("courseDetail.rating")}</span>
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400 dark:text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3 h-3 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (0)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
