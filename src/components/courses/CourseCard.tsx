"use client";

import Link from "next/link";
import Image from "next/image";
import { CourseDetailResponse, CourseLevel, CourseFormat } from "@/types/course";
import { Clock, BarChart2, ArrowRight } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface CourseCardProps {
  course: CourseDetailResponse;
  index?: number;
}

const LEVEL_CONFIG: Record<
  CourseLevel,
  { label: string; bg: string }
> = {
  [CourseLevel.BEGINNER]: {
    label: "Cơ bản",
    bg: "bg-[#FF9900]",
  },
  [CourseLevel.INTERMEDIATE]: {
    label: "Thực hành",
    bg: "bg-[#0284C7]",
  },
  [CourseLevel.ADVANCED]: {
    label: "Nâng cao",
    bg: "bg-[#10B981]",
  },
  [CourseLevel.EXPERT]: {
    label: "Dữ liệu",
    bg: "bg-[#26344D]",
  },
};

const getDifficultyText = (level?: CourseLevel, locale: string = "vi"): string => {
  if (locale === "vi") {
    switch (level) {
      case CourseLevel.BEGINNER:
        return "Dễ";
      case CourseLevel.INTERMEDIATE:
        return "Trung bình";
      case CourseLevel.ADVANCED:
        return "Nâng cao";
      case CourseLevel.EXPERT:
        return "Chuyên sâu";
      default:
        return "Trung bình";
    }
  }

  switch (level) {
    case CourseLevel.BEGINNER:
      return locale === "ja" ? "初級" : locale === "ko" ? "초급" : "Easy";
    case CourseLevel.INTERMEDIATE:
      return locale === "ja" ? "中級" : locale === "ko" ? "중급" : "Medium";
    case CourseLevel.ADVANCED:
      return locale === "ja" ? "上級" : locale === "ko" ? "고급" : "Advanced";
    case CourseLevel.EXPERT:
      return locale === "ja" ? "専門" : locale === "ko" ? "전문가" : "Expert";
    default:
      return locale === "ja" ? "中級" : locale === "ko" ? "중급" : "Medium";
  }
};

const FALLBACK_GRADIENTS = [
  "from-slate-800 via-slate-900 to-black",
  "from-zinc-800 via-zinc-900 to-black",
  "from-neutral-800 via-neutral-900 to-black",
  "from-stone-800 via-stone-900 to-black",
  "from-slate-800 via-zinc-900 to-black",
  "from-zinc-800 via-slate-900 to-black",
];

export default function CourseCard({
  course,
  index = 0,
}: CourseCardProps) {
  const { locale } = useI18n();

  const detailHref =
    course.courseFormat === CourseFormat.TEXT
      ? `/docs/${course.slug}`
      : `/courses/${course.slug}`;

  const levelInfo = course.level ? LEVEL_CONFIG[course.level] : { label: "Cơ bản", bg: "bg-[#FF9900]" };
  const fallbackGradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  const durationHours = course.duration && course.duration > 0 ? course.duration : 20;
  const difficultyLabel = getDifficultyText(course.level, locale);
  const hoursLabel = locale === "vi" ? "giờ" : locale === "ja" ? "時間" : locale === "ko" ? "시간" : "hrs";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A1F]/5">
      {/* Thumbnail */}
      <Link href={detailHref} className="relative block flex-shrink-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${fallbackGradient} p-4`}
            >
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Image
                    src="/logos/java-logo.png"
                    alt="JavaBuilder"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <p className="line-clamp-1 text-xs font-semibold text-white/90">
                  {course.title}
                </p>
              </div>
            </div>
          )}

          {/* Top-left category tag overlay */}
          <span className={`absolute top-2.5 left-2.5 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs ${levelInfo.bg}`}>
            {levelInfo.label}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title */}
        <Link href={detailHref} className="block mb-1.5">
          <h3 className="line-clamp-1 text-base font-bold text-[#171717] dark:text-white transition-colors duration-200 group-hover:text-[#FF5A1F]">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#64748B] dark:text-slate-400">
          {course.description || "Bắt đầu từ những kiến thức cơ bản nhất về Java và ứng dụng thực tế."}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#E8E8E8] dark:border-border">
          {/* Duration & Level */}
          <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{durationHours} {hoursLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{difficultyLabel}</span>
            </span>
          </div>

          {/* Arrow Circle Button */}
          <Link
            href={detailHref}
            aria-label={course.title}
            className="w-7 h-7 rounded-full border border-[#E8E8E8] dark:border-border flex items-center justify-center text-[#64748B] group-hover:bg-[#FF5A1F] group-hover:text-white transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
