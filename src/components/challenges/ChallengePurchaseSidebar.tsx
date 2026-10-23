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
    <div className="space-y-6 sticky top-20">
      {/* 1. Main Pricing & Enroll Card */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {/* Card Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-accent text-white">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Thử Thách {challenge.totalDays} Ngày
            </span>

            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${isFree
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                }`}
            >
              {isFree ? "Miễn phí" : "Gói PRO"}
            </span>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {isFree ? "Miễn Phí" : `${standalonePrice.toLocaleString("vi-VN")} đ`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isFree
                ? "Mở khóa toàn bộ nội dung ngay hôm nay."
                : "Thanh toán 1 lần • Sở hữu trọn đời • Cập nhật miễn phí"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onUnlockStandalone}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-white bg-accent hover:bg-accent/90 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>
                {isFree ? "Tham gia thử thách ngay" : "Mở khóa thử thách ngay"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isFree && (
              <button
                type="button"
                onClick={onOpenPremiumModal}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Nâng cấp Gói Premium (Mở khóa tất cả)</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Included Features List */}
        <div className="p-5 sm:p-6 space-y-3.5 bg-gray-50/50 dark:bg-slate-850/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Quyền lợi khi tham gia thử thách:
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Lộ trình định hướng <strong>{challenge.totalDays} ngày thực chiến</strong>, đi đúng hướng và không lan man
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Nhiệm vụ & checklist thực hành mỗi ngày, tự tay code để làm chủ kiến thức
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>
                <strong>Trợ lý AI Mentor 24/7</strong>: Gợi ý hướng giải quyết, tháo gỡ bế tắc và hỗ trợ sửa lỗi trực tiếp
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Định hướng tư duy kiến trúc, các cạm bẫy thực tế và kinh nghiệm từ mentor
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Sở hữu trọn đời & cập nhật nội dung lộ trình liên tục</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
