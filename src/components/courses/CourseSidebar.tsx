"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { CourseDetailResponse, CourseFormat, CourseLevel } from "@/types/course";
import {
  CheckCircle2,
  Play,
  Heart,
  Loader2,
  GraduationCap,
  Clock,
  Star,
} from "lucide-react";

interface CourseSidebarProps {
  course: CourseDetailResponse;
  isEnrolled: boolean;
  isFavorite: boolean;
  favoriteLoading: boolean;
  isEnrollingFree?: boolean;
  onPayment: () => void;
  onEnrollFree: () => void;
  onToggleFavorite: () => void;
  formatPrice: (price: number) => string;
  getLevelText: (level: CourseLevel) => string;
  averageRating?: number;
  totalReviews?: number;
}

export default function CourseSidebar({
  course,
  isEnrolled,
  isFavorite,
  favoriteLoading,
  isEnrollingFree = false,
  onPayment,
  onEnrollFree,
  onToggleFavorite,
  formatPrice,
  getLevelText,
  averageRating = 5,
  totalReviews = 0,
}: CourseSidebarProps) {
  const { t } = useI18n();
  const isFree = !course.price || course.price === 0;

  return (
    <div className="rounded-2xl p-6 sticky top-20 border border-border bg-surface shadow-xs">
      {/* Price / Enrolled Status */}
      <div className="text-center mb-5">
        {isEnrolled ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mb-2.5 border bg-success/10 text-success border-success/25 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("courseDetail.enrolled")}</span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted">
              {t("courseDetail.fullAccess")}
            </p>
          </>
        ) : (
          <>
            <div className="text-3xl font-extrabold text-primary mb-1.5 tabular-nums">
              {isFree ? "Miễn phí" : formatPrice(course.price)}
            </div>
            <p className="text-xs sm:text-sm text-text-muted">
              {isFree
                ? t("courseDetail.freeCourseLifetime")
                : t("courseDetail.lifetimeAccess")}
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
            className="w-full bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-full transition-all shadow-xs flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t("courseDetail.learnNow")}</span>
          </Link>
        ) : isFree ? (
          <button
            type="button"
            onClick={onEnrollFree}
            disabled={isEnrollingFree}
            className="w-full bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-full transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {isEnrollingFree && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{t("courseDetail.joinNow")}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPayment}
            className="w-full bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold py-2.5 px-5 rounded-full transition-all shadow-xs cursor-pointer text-sm"
          >
            {t("courseDetail.enrollNow")}
          </button>
        )}

        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={favoriteLoading}
          className={`w-full font-semibold py-2.5 px-5 rounded-full border transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50 active:scale-95 ${
            isFavorite
              ? "bg-error/10 hover:bg-error/15 text-error border-error/25"
              : "bg-background hover:bg-muted/60 text-foreground border-border hover:text-primary"
          }`}
        >
          {favoriteLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-current text-error" : ""
              }`}
            />
          )}
          <span>
            {isFavorite
              ? t("courseDetail.favorited")
              : t("courseDetail.addFavorite")}
          </span>
        </button>
      </div>

      {/* Course Stats */}
      <div className="border-t border-border pt-5">
        <h3 className="font-bold text-foreground mb-3.5 text-xs uppercase tracking-wider">
          {t("courseDetail.courseInfo")}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-text-muted">
              <GraduationCap className="w-4 h-4 text-primary" />
              {t("courseDetail.level")}
            </span>
            <span className="font-semibold text-foreground">
              {getLevelText(course.level || CourseLevel.BEGINNER)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-text-muted">
              <Clock className="w-4 h-4 text-primary" />
              {t("courseDetail.duration")}
            </span>
            <span className="font-semibold text-foreground">
              {course.duration || 0} {t("courseDetail.hours")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-text-muted">
              <Star className="w-4 h-4 text-primary" />
              {t("courseDetail.rating")}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3.5 h-3.5 fill-current ${
                      star <= Math.round(averageRating)
                        ? "text-amber-400"
                        : "text-border"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-text-muted font-medium tabular-nums">
                ({totalReviews})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
