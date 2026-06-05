"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import type { ScoreTone } from "./helpers";
import type { AiAnalysisStatus, QuestionCounts, QuestionFilter } from "./types";

interface AiCoachPanelProps {
  status: AiAnalysisStatus;
  scorePercentage: number;
  accuracyPercentage: number;
  counts: QuestionCounts;
  tone: ScoreTone;
  onRunAnalysis: () => void;
  onJumpToFilter: (filter: QuestionFilter) => void;
}

export default function AiCoachPanel({
  status,
  scorePercentage,
  accuracyPercentage,
  counts,
  tone,
  onRunAnalysis,
  onJumpToFilter,
}: AiCoachPanelProps) {
  const needsImprovement = counts.incorrect + counts.skipped > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-accent/5 via-transparent to-transparent px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 sm:h-10 sm:w-10">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                AI Coach
              </h3>
              {status === "done" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Đã phân tích
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Đánh giá điểm mạnh, điểm yếu và hướng ôn tập dựa trên bài làm của bạn
            </p>
          </div>
        </div>

        {status !== "idle" && (
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={status === "loading"}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition hover:border-accent hover:text-accent disabled:opacity-50"
          >
            <RotateCcw
              className={`h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`}
            />
            Phân tích lại
          </button>
        )}
      </div>

      {status === "idle" && <IdleState onRun={onRunAnalysis} />}
      {status === "loading" && <LoadingState />}
      {status === "done" && (
        <DoneState
          scorePercentage={scorePercentage}
          accuracyPercentage={accuracyPercentage}
          counts={counts}
          tone={tone}
          needsImprovement={needsImprovement}
          onJumpToFilter={onJumpToFilter}
        />
      )}
    </div>
  );
}

function IdleState({ onRun }: { onRun: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center sm:px-5 sm:py-12">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
        <span className="absolute inset-0 rounded-full bg-accent/10" />
        <span className="absolute inset-2 rounded-full bg-accent/15" />
        <Sparkles className="relative h-6 w-6 text-accent sm:h-7 sm:w-7" />
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
        Nhận phân tích chuyên sâu từ AI
      </h4>
      <p className="mt-1.5 max-w-md text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        AI sẽ đánh giá chi tiết điểm mạnh, điểm yếu và đề xuất hướng ôn tập riêng cho bạn dựa trên bài làm này.
      </p>
      <button
        type="button"
        onClick={onRun}
        className="group relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent to-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-110"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        <Sparkles className="relative h-4 w-4" />
        <span className="relative">Phân tích chuyên sâu</span>
      </button>
      <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">
        Mất khoảng vài giây
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-5 sm:py-14">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 opacity-75" />
        <span className="absolute inset-0 rounded-full bg-accent/15" />
        <Sparkles className="relative h-6 w-6 animate-pulse text-accent" />
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        AI đang phân tích bài làm của bạn
      </h4>
      <p className="mt-1 max-w-md text-xs text-gray-500 dark:text-gray-400">
        Đang đối chiếu kết quả với từng câu hỏi để đưa ra đánh giá phù hợp...
      </p>
      <div className="mt-5 w-full max-w-xs space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-accent to-accent-600" />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>Đang xử lý</span>
          <span>Vài giây</span>
        </div>
      </div>
    </div>
  );
}

interface DoneStateProps {
  scorePercentage: number;
  accuracyPercentage: number;
  counts: QuestionCounts;
  tone: ScoreTone;
  needsImprovement: boolean;
  onJumpToFilter: (filter: QuestionFilter) => void;
}

function DoneState({
  scorePercentage,
  accuracyPercentage,
  counts,
  tone,
  needsImprovement,
  onJumpToFilter,
}: DoneStateProps) {
  return (
    <div className="p-4 sm:p-5">
      {/* Verdict */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-900/30 p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tone.verdictBg}`}
          >
            <Lightbulb className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Đánh giá tổng quan
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Bạn đạt{" "}
              <strong className="text-gray-900 dark:text-white">{scorePercentage}%</strong>{" "}
              trên thang điểm với{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {counts.correct} câu đúng
              </strong>
              {counts.incorrect > 0 && (
                <>
                  ,{" "}
                  <strong className="text-rose-600 dark:text-rose-400">
                    {counts.incorrect} câu sai
                  </strong>
                </>
              )}
              {counts.skipped > 0 && (
                <>
                  {" "}và{" "}
                  <strong className="text-amber-600 dark:text-amber-400">
                    {counts.skipped} câu bỏ qua
                  </strong>
                </>
              )}
              . {tone.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 3-column analysis */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StrengthsCard counts={counts} accuracyPercentage={accuracyPercentage} />
        <WeaknessesCard counts={counts} accuracyPercentage={accuracyPercentage} />
        <ActionPlanCard
          needsImprovement={needsImprovement}
          missingCount={counts.incorrect + counts.skipped}
          onJumpToFilter={onJumpToFilter}
        />
      </div>
    </div>
  );
}

function StrengthsCard({
  counts,
  accuracyPercentage,
}: {
  counts: QuestionCounts;
  accuracyPercentage: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        </span>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Điểm mạnh
        </h4>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {counts.correct > 0 && (
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
            <span>
              Trả lời chính xác{" "}
              <strong className="text-gray-900 dark:text-white">
                {counts.correct}/{counts.all}
              </strong>{" "}
              câu hỏi
            </span>
          </li>
        )}
        {accuracyPercentage >= 70 && (
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
            <span>
              Độ chính xác{" "}
              <strong className="text-gray-900 dark:text-white">
                {accuracyPercentage}%
              </strong>{" "}
              — vượt mức trung bình
            </span>
          </li>
        )}
        {counts.skipped === 0 && counts.all > 0 && (
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
            <span>Hoàn thành toàn bộ câu hỏi, không bỏ trống câu nào</span>
          </li>
        )}
        {counts.correct === 0 && (
          <li className="text-xs italic text-gray-400 dark:text-gray-500">
            Chưa có điểm mạnh nổi bật trong bài làm này.
          </li>
        )}
      </ul>
    </div>
  );
}

function WeaknessesCard({
  counts,
  accuracyPercentage,
}: {
  counts: QuestionCounts;
  accuracyPercentage: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 dark:bg-rose-900/20">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
        </span>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Điểm cần cải thiện
        </h4>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {counts.incorrect > 0 && (
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
            <span>
              <strong className="text-gray-900 dark:text-white">
                {counts.incorrect} câu
              </strong>{" "}
              có đáp án sai — cần xem lại nội dung lý thuyết liên quan
            </span>
          </li>
        )}
        {counts.skipped > 0 && (
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
            <span>
              Bỏ qua{" "}
              <strong className="text-gray-900 dark:text-white">
                {counts.skipped} câu
              </strong>{" "}
              — dấu hiệu thiếu kiến thức nền hoặc thời gian
            </span>
          </li>
        )}
        {accuracyPercentage < 50 && counts.all > 0 && (
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
            <span>Tỷ lệ trả lời đúng dưới ngưỡng đạt — cần ôn tập từ nền tảng</span>
          </li>
        )}
        {counts.incorrect + counts.skipped === 0 && (
          <li className="text-xs italic text-gray-400 dark:text-gray-500">
            Tuyệt vời! Không phát hiện điểm yếu trong bài làm này.
          </li>
        )}
      </ul>
    </div>
  );
}

function ActionPlanCard({
  needsImprovement,
  missingCount,
  onJumpToFilter,
}: {
  needsImprovement: boolean;
  missingCount: number;
  onJumpToFilter: (filter: QuestionFilter) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
          <Target className="h-3.5 w-3.5 text-accent" />
        </span>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Hành động đề xuất
        </h4>
      </div>
      <ol className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {needsImprovement ? (
          <>
            <ActionStep step={1}>
              Xem lại{" "}
              <button
                type="button"
                onClick={() => onJumpToFilter("incorrect")}
                className="font-semibold text-accent hover:underline"
              >
                {missingCount} câu chưa đạt
              </button>{" "}
              ở phần phân tích chi tiết
            </ActionStep>
            <ActionStep step={2}>
              Bấm &ldquo;Giải thích với AI&rdquo; ở mỗi câu sai để hiểu rõ lỗi sai
            </ActionStep>
            <ActionStep step={3}>Làm lại bài hoặc thử bài tương tự để củng cố</ActionStep>
          </>
        ) : (
          <>
            <ActionStep step={1}>Thử thách bản thân với bài tập độ khó cao hơn</ActionStep>
            <ActionStep step={2}>Khám phá các chủ đề nâng cao trong cùng lĩnh vực</ActionStep>
          </>
        )}
      </ol>
    </div>
  );
}

function ActionStep({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
        {step}
      </span>
      <span>{children}</span>
    </li>
  );
}
