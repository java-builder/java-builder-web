"use client";

import Link from "next/link";
import {
  Rocket,
  Crown,
  Lock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Challenge, DayChallenge } from "@/app/challenges/types";

interface ChallengeJoinSectionProps {
  challenge: Challenge;
  activeDay?: DayChallenge;
  onEnroll: () => void;
  isEnrolling: boolean;
}

export function ChallengeJoinSection({
  challenge,
  activeDay,
  onEnroll,
  isEnrolling,
}: ChallengeJoinSectionProps) {
  const isFree = challenge.isFree;
  const standalonePrice = challenge.price || 149000;
  const previewDay = activeDay || challenge.days[0];

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* 1. Header Banner */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-accent/5 via-white to-transparent p-5 sm:p-6 dark:border-slate-800 dark:from-accent/10 dark:via-slate-900 dark:to-transparent text-center space-y-3">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent border border-accent/20">
          <Rocket className="h-3 w-3" />
          <span>Thử Thách {challenge.totalDays} Ngày</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className={isFree ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-amber-600 dark:text-amber-400 font-bold"}>
            {isFree ? "Miễn phí 100%" : "Gói PRO"}
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-1 max-w-xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Tham gia thử thách để bắt đầu học
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nhấn <strong>&ldquo;Tham gia ngay&rdquo;</strong> để mở khóa toàn bộ nội dung bài học từng ngày, làm checklist nhiệm vụ và lưu chuỗi streak trên JavaBuilder.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            type="button"
            onClick={onEnroll}
            disabled={isEnrolling}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-md text-xs sm:text-sm font-semibold text-white bg-accent hover:bg-accent/90 shadow-xs transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : isFree ? (
              <>
                <span>Tham gia thử thách ngay (Miễn phí)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Mở khóa thử thách ({standalonePrice.toLocaleString("vi-VN")} đ)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {!isFree && (
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-md text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Gói Premium</span>
            </Link>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground/80">
          {isFree
            ? "✓ Miễn phí hoàn toàn • Truy cập trọn đời • Ghi nhận tiến độ"
            : "✓ Truy cập trọn đời • Hỗ trợ từ mentor • Kích hoạt tức thì"}
        </p>
      </div>

      {/* 2. Locked Content Teaser */}
      {previewDay && (
        <div className="p-4 sm:p-5">
          <div className="rounded-lg border border-dashed border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-850 p-3.5 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                    Xem trước Ngày {previewDay.day}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <Lock className="w-2.5 h-2.5" /> Nội dung bài học đang khóa
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {previewDay.title}
                </h4>
                {previewDay.tagline && (
                  <p className="text-[11px] text-muted-foreground truncate">
                    {previewDay.tagline}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onEnroll}
                disabled={isEnrolling}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isEnrolling ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                <span>Mở khóa xem bài</span>
              </button>
            </div>

            {/* Blurred Teaser preview */}
            <div className="pt-2 border-t border-gray-200/60 dark:border-slate-800/60 opacity-40 filter blur-[1px] select-none pointer-events-none space-y-1.5">
              <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-2/3" />
              <div className="h-2.5 bg-gray-200 dark:bg-slate-800 rounded w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
