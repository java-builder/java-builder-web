"use client";

import Link from "next/link";
import { ArrowLeft, Flame, CheckCircle2, Clock } from "lucide-react";
import { Challenge } from "@/app/challenges/types";
import { LEVEL_STYLES } from "./ChallengeCard";

interface ChallengeHeaderProps {
  challenge: Challenge;
  completedCount: number;
  progressPercent: number;
}

export function ChallengeHeader({
  challenge,
  completedCount,
  progressPercent,
}: ChallengeHeaderProps) {
  return (
    <>
      {/* 1. TOP BREADCRUMB */}
      <div className="border-b border-gray-200 bg-white/80 dark:border-slate-700 dark:bg-slate-800/80 backdrop-blur-sm py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <Link
            href="/challenges"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại danh sách thử thách</span>
          </Link>

          <span className="text-gray-500 dark:text-gray-400 font-medium">
            {challenge.category} • {LEVEL_STYLES[challenge.level]?.label || challenge.level}
          </span>
        </div>
      </div>

      {/* 2. HERO HEADER (Matches CoursesHero JavaBuilder Style) */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent-rgb),0.08),transparent_60%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Title & Info */}
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/20">
                <Flame className="h-3 w-3 text-amber-500 fill-amber-500" />
                Thử Thách {challenge.totalDays} Ngày
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {challenge.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {/* Quick Stats Pill Panel */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800/80 shrink-0 min-w-[260px] space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-600 dark:text-gray-400">Tiến độ</span>
                <span className="font-semibold tabular-nums text-gray-900 dark:text-white">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercent >= 100
                      ? "bg-emerald-500"
                      : progressPercent >= 50
                        ? "bg-accent"
                        : progressPercent > 0
                          ? "bg-amber-500"
                          : "bg-gray-300 dark:bg-slate-600"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {completedCount} / {challenge.totalDays} ngày hoàn thành
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Clock className="h-3 w-3" />
                  ~{challenge.estimatedMinutesPerDay} phút/ngày
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
