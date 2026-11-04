"use client";

import { Sparkles } from "lucide-react";
import type { AiAnalysisStatus } from "./types";

interface AiCoachPanelProps {
  status: AiAnalysisStatus;
  onOpen: () => void;
}

export default function AiCoachPanel({ status, onOpen }: AiCoachPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary-soft/50 p-4 sm:p-5 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              AI Coach phân tích bài làm
            </h3>
            {status === "done" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Đã phân tích
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            Đánh giá điểm mạnh, lỗ hổng kiến thức và gợi ý lộ trình ôn tập
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition cursor-pointer active:scale-98"
      >
        <Sparkles className="h-4 w-4" />
        <span>
          {status === "done" ? "Xem kết quả phân tích" : "Phân tích chuyên sâu với AI"}
        </span>
      </button>
    </div>
  );
}
