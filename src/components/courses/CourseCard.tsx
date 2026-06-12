"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CourseDetailResponse, CourseLevel, CourseFormat } from "@/types/course";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { authApi } from "@/services/auth.service";
import toast from "react-hot-toast";

interface CourseCardProps {
  course: CourseDetailResponse;
  index?: number;
  initialFavorite?: boolean;
}

const LEVEL_STYLES: Record<
  CourseLevel,
  { label: string; className: string; dot: string }
> = {
  [CourseLevel.BEGINNER]: {
    label: "Cơ bản",
    className:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40",
    dot: "bg-emerald-500",
  },
  [CourseLevel.INTERMEDIATE]: {
    label: "Trung cấp",
    className:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/40",
    dot: "bg-amber-500",
  },
  [CourseLevel.ADVANCED]: {
    label: "Nâng cao",
    className:
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900/40",
    dot: "bg-rose-500",
  },
  [CourseLevel.EXPERT]: {
    label: "Chuyên sâu",
    className:
      "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-900/40",
    dot: "bg-violet-500",
  },
};

const FORMAT_STYLES: Record<
  CourseFormat,
  { label: string; className: string }
> = {
  [CourseFormat.VIDEO]: {
    label: "Video",
    className: "bg-rose-500/95 text-white",
  },
  [CourseFormat.TEXT]: {
    label: "Text",
    className: "bg-emerald-500/95 text-white",
  },
  [CourseFormat.MIXED]: {
    label: "Mixed",
    className: "bg-indigo-500/95 text-white",
  },
};

const FALLBACK_GRADIENTS = [
  "from-blue-500 via-indigo-500 to-purple-600",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-rose-500 via-pink-500 to-fuchsia-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-sky-500 via-blue-500 to-indigo-600",
  "from-violet-500 via-purple-500 to-fuchsia-600",
];

const formatPrice = (price: number) => {
  if (!price || price === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CourseCard({
  course,
  index = 0,
  initialFavorite,
}: CourseCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const hasCheckedFavorite = useRef(false);

  useEffect(() => {
    if (initialFavorite !== undefined || hasCheckedFavorite.current) return;
    if (!authApi.isAuthenticated()) return;

    hasCheckedFavorite.current = true;

    const checkFavorite = async () => {
      try {
        const result = await favoriteService.check(
          course.id,
          FavoriteTargetType.COURSE
        );
        if (result && result.data !== undefined) {
          setIsFavorite(result.data);
        }
      } catch {
        /* silent */
      }
    };
    checkFavorite();
  }, [course.id, initialFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authApi.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    setIsLoading(true);
    try {
      const result = await favoriteService.toggle({
        targetId: course.id,
        targetType: FavoriteTargetType.COURSE,
      });
      if (result.code === 200) {
        setIsFavorite(result.data ?? false);
        toast.success(
          result.data ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích"
        );
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const detailHref =
    course.courseFormat === CourseFormat.TEXT
      ? `/docs/${course.slug}`
      : `/courses/${course.slug}`;

  const levelStyle = course.level ? LEVEL_STYLES[course.level] : null;
  const formatStyle = course.courseFormat
    ? FORMAT_STYLES[course.courseFormat]
    : null;
  const fallbackGradient =
    FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  const isFree = !course.price || course.price === 0;
  const showDuration =
    course.courseFormat !== CourseFormat.TEXT &&
    course.duration &&
    course.duration > 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-accent/10 dark:border-slate-700/60 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:shadow-black/40">
      {/* Thumbnail */}
      <Link href={detailHref} className="relative block flex-shrink-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 dark:bg-slate-900/50">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`transition-transform duration-500 group-hover:scale-105 ${
                course.courseFormat === CourseFormat.TEXT
                  ? "object-contain bg-gray-50 dark:bg-slate-900/50"
                  : "object-cover"
              }`}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${fallbackGradient} p-6`}
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-7 w-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <p className="line-clamp-2 text-sm font-semibold text-white/95">
                  {course.title}
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {formatStyle && (
            <span
              className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur-sm ${formatStyle.className}`}
            >
              {course.courseFormat === CourseFormat.VIDEO && (
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              )}
              {course.courseFormat === CourseFormat.TEXT && (
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {course.courseFormat === CourseFormat.MIXED && (
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              )}
              {formatStyle.label}
            </span>
          )}

          {/* Free badge - top right when free */}
          {isFree && (
            <span className="absolute right-14 top-3 inline-flex items-center rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              Free
            </span>
          )}
        </div>

        {/* Favorite button - floating top right */}
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 disabled:opacity-60 ${
            isFavorite
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-white/90 text-gray-700 backdrop-blur-sm hover:bg-white hover:text-rose-500 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-rose-400"
          }`}
          aria-label={isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
          title={isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
        >
          {isLoading ? (
            <svg
              className="h-4 w-4 animate-spin"
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
              className="h-[18px] w-[18px]"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Meta row: level + duration */}
        <div className="mb-3 flex items-center gap-2 text-xs">
          {levelStyle && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${levelStyle.className}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${levelStyle.dot}`} />
              {levelStyle.label}
            </span>
          )}
          {showDuration && (
            <span className="inline-flex items-center gap-1 text-gray-500 dark:text-slate-400">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{course.duration} giờ</span>
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={detailHref} className="block">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-accent dark:text-white dark:group-hover:text-sky-400">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
          {course.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-700/60">
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 p-1 shadow-sm">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder"
                width={20}
                height={20}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-700 dark:text-slate-200">
                JavaBuilder
              </p>
              <p className="truncate text-[10px] text-gray-500 dark:text-slate-400">
                Tác giả
              </p>
            </div>
          </div>

          {/* Price + CTA */}
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 text-base font-bold text-accent transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <span className="whitespace-nowrap">{formatPrice(course.price)}</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
