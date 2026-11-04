"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Challenge } from "@/app/challenges/types";
import { ChallengeLevel } from "@/types/challenge";

interface ChallengeCardProps {
  challenge: Challenge;
  userProgress?: { completedCount: number };
}

export const LEVEL_STYLES: Record<ChallengeLevel, { label: string; className: string; dot: string }> = {
  INTERN: {
    label: "Intern",
    className: "border-[#E8E8E8] bg-[#F8F8F8] text-[#171717] dark:border-border dark:bg-surface dark:text-slate-200 text-[11px] font-semibold",
    dot: "bg-slate-400",
  },
  FRESHER: {
    label: "Fresher",
    className: "border-[#E8E8E8] bg-[#F8F8F8] text-[#171717] dark:border-border dark:bg-surface dark:text-slate-200 text-[11px] font-semibold",
    dot: "bg-emerald-500",
  },
  JUNIOR: {
    label: "Junior",
    className: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-300 text-[11px] font-semibold",
    dot: "bg-sky-500",
  },
  MIDDLE: {
    label: "Middle",
    className: "border-[#FFD8C7] bg-[#FFF0E8] text-[#FF5A1F] dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300 text-[11px] font-semibold",
    dot: "bg-[#FF5A1F]",
  },
  SENIOR: {
    label: "Senior",
    className: "border-[#FFD8C7] bg-[#FFF0E8] text-[#FF5A1F] dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300 text-[11px] font-semibold",
    dot: "bg-[#FF5A1F]",
  },
};

export function ChallengeCard({ challenge, userProgress }: ChallengeCardProps) {
  const isEnrolled = !!userProgress && userProgress.completedCount > 0;
  const progressPercent = userProgress
    ? Math.round((userProgress.completedCount / challenge.totalDays) * 100)
    : 0;
  const levelStyle = LEVEL_STYLES[challenge.level] || LEVEL_STYLES.JUNIOR;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A1F]/5">
      {/* Visual Banner Header (Linkable) */}
      <Link
        href={`/challenges/${challenge.slug}`}
        className="relative block aspect-[16/10] sm:aspect-[16/9] min-h-[195px] w-full overflow-hidden bg-[#181D28] flex-shrink-0 cursor-pointer"
      >
        <div
          className="relative flex h-full w-full flex-col justify-between p-5 text-white transition-transform duration-500 group-hover:scale-105 border-b border-black/10"
          style={{
            background:
              challenge.colorGradient ||
              "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          }}
        >
          {/* Subtle top-right highlight & bottom dark scrim for text contrast on any gradient */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/5"
          />

          {/* Top Badges */}
          <div className="relative flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/25 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                {challenge.tag}
              </span>
              {challenge.freePreviewDays && challenge.freePreviewDays > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Học thử {challenge.freePreviewDays} ngày
                </span>
              ) : null}
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 backdrop-blur-md px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
              <Clock className="w-3.5 h-3.5" />
              {challenge.totalDays} Ngày
            </span>
          </div>

          {/* Banner Center Title */}
          <div className="relative z-10">
            {challenge.category && (
              <span className="inline-block rounded-md bg-black/25 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white/95 mb-1.5 border border-white/15">
                {challenge.category}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-extrabold leading-snug line-clamp-2 text-white drop-shadow-xs">
              {challenge.title}
            </h3>
            <p className="text-xs text-white/90 line-clamp-1 mt-1 font-medium">
              {challenge.subtitle}
            </p>
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-4">
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

            <span className="text-[#64748B] dark:text-slate-400 flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5" />
              {challenge.enrolledCount.toLocaleString()} người học
            </span>
          </div>

          {/* Title (Linkable) */}
          <Link href={`/challenges/${challenge.slug}`} className="block">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#171717] dark:text-white transition-colors duration-200 group-hover:text-[#FF5A1F]">
              {challenge.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs leading-relaxed text-[#64748B] dark:text-slate-400 line-clamp-2">
            {challenge.description}
          </p>

          {/* User Progress if active */}
          {isEnrolled && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-[#64748B] dark:text-slate-400">
                  Tiến độ
                </span>
                <span className="font-semibold tabular-nums text-[#171717] dark:text-white">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full bg-[#10B981] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Metadata and Pricing */}
        <div className="pt-3 border-t border-[#E8E8E8] dark:border-border flex items-center justify-between gap-3">
          {/* Left: Author / Mentor */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-[#FF5A1F] to-[#FF9900] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder"
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#171717] dark:text-white truncate block">
                JavaBuilder
              </span>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">
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
                <span className="px-2 py-0.5 rounded-full bg-[#FFF0E8] text-[#FF5A1F] dark:bg-orange-950/40 dark:text-orange-400 font-semibold text-[11px] border border-[#FFD8C7] dark:border-orange-900/50">
                  Miễn phí 100%
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold">
                <span className="text-[#171717] dark:text-white">
                  {(challenge.price ?? 0).toLocaleString("vi-VN")} đ
                </span>
              </div>
            )}
            <Link
              href={`/challenges/${challenge.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A1F] hover:text-[#e04b16] transition-transform duration-200 group-hover:translate-x-0.5 cursor-pointer mt-0.5"
            >
              <span className="whitespace-nowrap">
                {isEnrolled ? "Tiếp tục học" : challenge.isFree ? "Bắt đầu học ngay" : "Học thử miễn phí"}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
