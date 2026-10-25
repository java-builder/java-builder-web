"use client";

import {
  Crown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Challenge } from "@/app/challenges/types";

interface ChallengePurchaseSidebarProps {
  challenge: Challenge;
  onUnlockStandalone: () => void;
  onOpenPremiumModal: () => void;
}

export function ChallengePurchaseSidebar({
  challenge,
  onUnlockStandalone,
  onOpenPremiumModal,
}: ChallengePurchaseSidebarProps) {
  const isFree = challenge.isFree || !challenge.price || challenge.price <= 0;
  const standalonePrice = challenge.price ?? 0;

  return (
    <div className="space-y-4">
      {/* 1. Main Pricing & Enroll Card - Nhỏ gọn, tinh tế */}
      <div className="rounded-xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        {/* Card Header & Pricing */}
        <div className="p-4 sm:p-4.5 border-b border-gray-150 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent text-white">
              <Flame className="w-3 h-3 fill-current" />
              Thử thách {challenge.totalDays} ngày
            </span>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isFree
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              }`}
            >
              {isFree ? "Miễn phí" : "Gói PRO"}
            </span>
          </div>

          {/* Pricing */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {isFree ? "Miễn Phí" : `${standalonePrice.toLocaleString("vi-VN")} đ`}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isFree
                ? "Mở khóa toàn bộ nội dung ngay hôm nay."
                : "Thanh toán 1 lần • Sở hữu trọn đời • Cập nhật miễn phí"}
            </p>
          </div>

          {/* Action Buttons - Gọn gàng */}
          <div className="space-y-1.5 pt-0.5">
            <button
              type="button"
              onClick={onUnlockStandalone}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-[13px] font-bold text-white bg-accent hover:bg-accent/90 shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isFree ? "Tham gia thử thách ngay" : "Mở khóa thử thách ngay"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {!isFree && (
              <button
                type="button"
                onClick={onOpenPremiumModal}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Nâng cấp Gói Premium (Mở khóa tất cả)</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Included Features List - Nhỏ gọn, súc tích */}
        <div className="p-3.5 sm:p-4 space-y-2 bg-gray-50/50 dark:bg-slate-900/50">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Quyền lợi khi tham gia:
          </h4>
          <ul className="space-y-1.5 text-[11px] text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Lộ trình <strong>{challenge.totalDays} ngày thực chiến</strong>, checklist bài tập mỗi ngày
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span>
                <strong>Trợ lý AI Mentor 24/7</strong>: Gợi ý giải pháp & hỗ trợ sửa lỗi trực tiếp
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Tư duy kiến trúc, cạm bẫy thực tế & kinh nghiệm từ mentor
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Sở hữu trọn đời & cập nhật nội dung liên tục</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
