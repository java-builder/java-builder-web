"use client";

import Link from "next/link";
import { Lock, Crown, CheckCircle2, Sparkles } from "lucide-react";
import { Challenge, DayChallenge } from "@/app/challenges/types";

interface ChallengePaywallCardProps {
  challenge: Challenge;
  activeDay: DayChallenge;
  onUnlockStandalone: () => void;
}

export function ChallengePaywallCard({
  challenge,
  activeDay,
  onUnlockStandalone,
}: ChallengePaywallCardProps) {
  const standalonePrice = challenge.price || 149000;

  return (
    <div className="rounded-xl border border-dashed border-accent/40 bg-gradient-to-b from-accent/5 via-white to-white dark:from-accent/10 dark:via-slate-800 dark:to-slate-800 p-6 sm:p-8 text-center space-y-6 shadow-sm sticky top-20">
      {/* Lock Header */}
      <div className="space-y-3 max-w-md mx-auto">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 ring-8 ring-accent/5 dark:bg-accent/20">
          <Lock className="h-7 w-7 text-accent" />
        </div>
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-accent bg-accent/10 px-2.5 py-0.5 rounded-md">
            Chặn truy cập từ Ngày {(challenge.freePreviewDays ?? 0) + 1}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            Mở Khóa Ngày {activeDay.day}: {activeDay.title}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bạn đã hoàn thành {challenge.freePreviewDays ?? 0} ngày trải nghiệm học thử! Hãy lựa chọn hình thức kích hoạt dưới đây để tiếp tục toàn bộ lộ trình {challenge.totalDays} ngày cùng mentor:
          </p>
        </div>
      </div>

      {/* 2 Activation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
        {/* OPTION 1: ALL-ACCESS PREMIUM (Recommended) */}
        <div className="relative rounded-xl border-2 border-accent bg-white dark:bg-slate-850 p-5 shadow-md flex flex-col justify-between space-y-4">
          <span className="absolute -top-3 left-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
            ⭐ KHUYÊN DÙNG • TIẾT KIỆM NHẤT
          </span>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-accent font-bold text-base">
              <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>JavaBuilder Premium</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Mở khóa toàn diện tất cả tính năng & tài nguyên trên JavaBuilder.
            </p>

            <ul className="space-y-1.5 pt-2 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Mở khóa <strong>toàn bộ tất cả các thử thách</strong> (10, 14, 21, 30, 60 ngày)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Truy cập 100% khóa học & tài liệu</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Ngân hàng câu hỏi phỏng vấn thực tế</span>
              </li>
            </ul>
          </div>

          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-white transition hover:bg-accent-600 shadow-sm text-center"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Nâng cấp gói Premium</span>
          </Link>
        </div>

        {/* OPTION 2: BUY THIS CHALLENGE ONLY (Standalone) */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 dark:border-slate-700 dark:bg-slate-900/40 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mua lẻ 1 lộ trình
              </span>
              <span className="text-base font-extrabold text-gray-900 dark:text-white">
                {standalonePrice.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Sở hữu trọn đời riêng thử thách <strong>&ldquo;{challenge.title}&rdquo;</strong>.
            </p>

            <ul className="space-y-1.5 pt-2 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Trọn bộ {challenge.totalDays} ngày định hướng</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Checklist nhiệm vụ & cạm bẫy từ mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Lưu chuỗi streak không giới hạn</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onUnlockStandalone}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-800 transition hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 cursor-pointer text-center"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Mua lẻ riêng ({standalonePrice.toLocaleString("vi-VN")} đ)</span>
          </button>
        </div>
      </div>

      {/* Teaser Preview of Today's Lesson (Blurred) */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 text-left max-w-2xl mx-auto opacity-60 filter blur-[1px] pointer-events-none select-none">
        <div className="text-xs font-bold text-gray-400">Xem trước nội dung Ngày {activeDay.day}:</div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">{activeDay.title}</div>
        <div className="text-xs text-gray-500 mt-1">{activeDay.tagline}</div>
      </div>
    </div>
  );
}
