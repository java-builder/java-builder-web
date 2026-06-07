"use client";

import { Sparkles } from "lucide-react";
import type { AiAnalysisStatus } from "./types";

interface AiCoachPanelProps {
  status: AiAnalysisStatus;
  onOpen: () => void;
}

export default function AiCoachPanel({ status, onOpen }: AiCoachPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-accent/5 via-transparent to-transparent px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 sm:h-11 sm:w-11">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                AI Coach phân tích bài làm
              </h3>
              {status === "done" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Đã phân tích
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Đánh giá điểm mạnh, điểm yếu và lộ trình ôn tập riêng cho bạn
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="group relative inline-flex flex-shrink-0 items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          <Sparkles className="relative h-4 w-4" />
          <span className="relative">
            {status === "done" ? "Xem phân tích" : "Phân tích chuyên sâu"}
          </span>
        </button>
      </div>
    </div>
  );
}
