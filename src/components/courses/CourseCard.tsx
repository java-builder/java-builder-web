"use client";

import Link from "next/link";
import Image from "next/image";
import { CourseDetailResponse, CourseLevel, CourseFormat } from "@/types/course";

interface CourseCardProps {
  course: CourseDetailResponse;
  index?: number;
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
}: CourseCardProps) {

  const detailHref =
    course.courseFormat === CourseFormat.TEXT
      ? `/docs/${course.slug}`
      : `/courses/${course.slug}`;

  const levelStyle = course.level ? LEVEL_STYLES[course.level] : null;
  const fallbackGradient =
    FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  const isFree = !course.price || course.price === 0;
  const showDuration =
    course.courseFormat !== CourseFormat.TEXT &&
    course.duration &&
    course.duration > 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-accent/10 dark:border-slate-700/60 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:shadow-black/40">
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



          {/* Free badge - top right when free */}
          {isFree && (
            <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-xs backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Miễn phí</span>
            </span>
          )}
        </div>


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
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder"
                width={28}
                height={28}
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
