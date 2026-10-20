"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Challenge } from "@/app/challenges/types";
import { ChallengeLevel } from "@/types/challenge";

interface ChallengeCardProps {
  challenge: Challenge;
  userProgress?: { completedCount: number };
}

export const LEVEL_STYLES: Record<ChallengeLevel, { label: string; className: string; dot: string }> = {
  INTERN: {
    label: "Intern",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  FRESHER: {
    label: "Fresher",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  JUNIOR: {
    label: "Junior",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  MIDDLE: {
    label: "Middle",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  SENIOR: {
    label: "Senior",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export function ChallengeCard({ challenge, userProgress }: ChallengeCardProps) {
  const isEnrolled = !!userProgress && userProgress.completedCount > 0;
  const progressPercent = userProgress
    ? Math.round((userProgress.completedCount / challenge.totalDays) * 100)
    : 0;
  const levelStyle = LEVEL_STYLES[challenge.level] || LEVEL_STYLES.JUNIOR;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-accent/10 dark:border-slate-700/60 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:shadow-black/40">
      {/* Visual Banner Header (Linkable) */}
      <Link
        href={`/challenges/${challenge.slug}`}
        className="relative block aspect-[16/10] sm:aspect-[16/9] min-h-[195px] w-full overflow-hidden bg-gray-50 dark:bg-slate-900/50 flex-shrink-0 cursor-pointer"
      >
        <div
          className="flex h-full w-full flex-col justify-between p-5 text-white transition-transform duration-500 group-hover:scale-105"
          style={{
            background:
              challenge.colorGradient || "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          }}
        >
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-white/20 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                {challenge.tag}
              </span>
              {challenge.freePreviewDays && challenge.freePreviewDays > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Học thử {challenge.freePreviewDays} ngày
                </span>
              ) : null}
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-black/30 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white shadow-xs">
              <Clock className="w-3.5 h-3.5" />
              {challenge.totalDays} Ngày
            </span>
          </div>

          {/* Banner Center Title */}
          <div className="z-10">
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-85 block">
              {challenge.category}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold leading-snug line-clamp-2 mt-0.5 text-white">
              {challenge.title}
            </h3>
            <p className="text-xs text-white/80 line-clamp-1 mt-1 font-medium">
              {challenge.subtitle}
            </p>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-3">
          {/* Level & Participants row */}
          <div className="flex items-center justify-between text-xs">
            {levelStyle && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${levelStyle.className}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${levelStyle.dot}`} />
                <span>{levelStyle.label}</span>
              </span>
            )}

            <span className="text-muted-foreground flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5" />
              {challenge.enrolledCount.toLocaleString()} người học
            </span>
          </div>

          {/* Title (Linkable) */}
          <Link href={`/challenges/${challenge.slug}`} className="block">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-accent dark:text-white dark:group-hover:text-sky-400">
              {challenge.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2">
            {challenge.description}
          </p>

          {/* User Progress if active (Identical to /my-courses) */}
          {isEnrolled && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Tiến độ
                </span>
                <span className="font-semibold tabular-nums text-gray-900 dark:text-white">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Metadata and Pricing */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
          {/* Left: Author / Mentor */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-accent to-accent-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder"
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-gray-900 dark:text-white truncate block">
                JavaBuilder
              </span>
              <p className="text-[11px] text-muted-foreground truncate">
                {challenge.phases.length > 0
                  ? `${challenge.phases.length} Giai đoạn định hướng`
                  : `${challenge.totalDays} ngày học`}
              </p>
            </div>
          </div>

          {/* Right: Pricing & Action Link */}
          <div className="text-right shrink-0">
            {challenge.isFree ? (
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  Miễn phí 100%
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold">
                <span className="text-gray-900 dark:text-white">
                  {(challenge.price || 149000).toLocaleString("vi-VN")} đ
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                  hoặc Premium
                </span>
              </div>
            )}
            <Link
              href={`/challenges/${challenge.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-accent transition-transform duration-200 group-hover:translate-x-0.5 cursor-pointer mt-0.5"
            >
              <span className="whitespace-nowrap">
                {isEnrolled ? "Tiếp tục học" : challenge.isFree ? "Bắt đầu học ngay" : "Học thử miễn phí"}
              </span>
              <svg
                className="h-3.5 w-3.5"
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
      </div>
    </article>
  );
}
