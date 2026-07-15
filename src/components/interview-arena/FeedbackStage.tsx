import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ArrowRight
} from "lucide-react";
import { Question, QuestionResult } from "./types";

interface FeedbackStageProps {
  currentQuestionIdx: number;
  questions: Question[];
  currentFeedback: QuestionResult | null;
  onNextQuestion: () => void;
}

export const FeedbackStage: React.FC<FeedbackStageProps> = ({
  currentQuestionIdx,
  questions,
  currentFeedback,
  onNextQuestion
}) => {
  if (!currentFeedback) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Question Feedback Title Card */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-md">
          Đánh giá Câu hỏi {currentQuestionIdx + 1}
        </span>
        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-relaxed pt-1.5">
          {currentFeedback.questionText}
        </h3>
      </div>

      {/* Evaluation Results Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score Radial Circle Container */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-450">Điểm số đạt được</span>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-gray-100 dark:stroke-slate-900 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-indigo-500 fill-none"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentFeedback.score / 10)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-xl font-black text-indigo-600 dark:text-indigo-400">
              {currentFeedback.score} <span className="text-[10px] text-gray-500 dark:text-gray-400">/10</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            currentFeedback.score >= 8.0 
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
              : currentFeedback.score >= 6.5
                ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
          }`}>
            {currentFeedback.score >= 8.0 ? "Đạt xuất sắc" : currentFeedback.score >= 6.5 ? "Đạt yêu cầu" : "Cần ôn luyện thêm"}
          </span>
        </div>

        {/* Bullet points detailing strengths and weaknesses */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Điểm tốt câu trả lời
              </h4>
              <ul className="space-y-2">
                {currentFeedback.strengths.map((st, sIdx) => (
                  <li key={sIdx} className="text-[11px] text-gray-650 dark:text-gray-400 leading-relaxed pl-1.5 border-l-2 border-emerald-500">
                    {st}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Điểm cần bổ sung
              </h4>
              <ul className="space-y-2">
                {currentFeedback.weaknesses.map((wk, wIdx) => (
                  <li key={wIdx} className="text-[11px] text-gray-650 dark:text-gray-400 leading-relaxed pl-1.5 border-l-2 border-rose-500">
                    {wk}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* Student Answer VS Suggested Model Answer */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-indigo-500/10 pb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Câu trả lời mẫu gợi ý từ AI
        </h4>
        <div className="bg-gray-50 dark:bg-slate-900 p-4.5 rounded-xl border border-gray-100 dark:border-slate-850 text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-sans">
          {currentFeedback.sampleAnswer}
        </div>
      </div>

      {/* Action control button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNextQuestion}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer select-none group uppercase tracking-wider"
        >
          {currentQuestionIdx + 1 < questions.length ? "Tiếp tục câu hỏi sau" : "Hoàn thành buổi phỏng vấn"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
