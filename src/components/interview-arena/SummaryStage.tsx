import React from "react";
import { 
  Trophy, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Award, 
  Crown,
  RefreshCw 
} from "lucide-react";
import { QuestionResult } from "./types";

interface SummaryStageProps {
  results: QuestionResult[];
  totalScore: number;
  finalGrade: string;
  finalSalaryProposal: number;
  selectedLevel: string;
  onResetInterview: () => void;
}

export const SummaryStage: React.FC<SummaryStageProps> = ({
  results,
  totalScore,
  finalGrade,
  finalSalaryProposal,
  selectedLevel,
  onResetInterview
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Top Certificate Header Widget */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 text-white text-center space-y-4 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shadow-lg relative animate-pulse">
            <Trophy className="w-7 h-7 text-indigo-400" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">KẾT QUẢ ĐÁNH GIÁ CUỐI BUỔI</span>
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Báo Cáo Khả Năng Tuyển Dụng
          </h2>
        </div>
      </div>

      {/* Key stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Score bar */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Điểm trung bình</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {totalScore} <span className="text-xs text-gray-500">/10đ</span>
          </div>
          <div className="text-xs font-extrabold mt-1 text-gray-800 dark:text-white">{finalGrade}</div>
        </div>

        {/* Salary simulation */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Lương thử việc đề xuất</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            {finalSalaryProposal.toLocaleString()}
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal ml-1">đ</span>
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-450 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Dựa trên cấp độ {selectedLevel.toUpperCase()}
          </div>
        </div>

        {/* XP Rewards */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Phần thưởng thi đấu</span>
          <div className="text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
            <Zap className="w-6 h-6 fill-amber-500 text-amber-500" />
            +200 <span className="text-xs text-gray-500">XP</span>
          </div>
          <button
            onClick={() => alert("Đã nhận 200 XP thành công! Thứ hạng của bạn đã được cập nhật.")}
            className="px-4 py-1.5 bg-amber-50 hover:bg-amber-400 text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase shadow-sm cursor-pointer select-none mt-1 transition"
          >
            Nhận thưởng XP
          </button>
        </div>

      </div>

      {/* Detail analysis breakdown per questions */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-750/80 pb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-500" />
          Chi tiết đánh giá từng câu hỏi
        </h3>

        <div className="divide-y divide-gray-150 dark:divide-slate-750/80">
          {results.map((res, index) => (
            <div key={index} className="py-4.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  Câu {index + 1}: {res.questionText}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-455 leading-relaxed truncate max-w-[500px]">
                  Trả lời của bạn: {res.studentAnswer}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  res.score >= 8.0
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                    : res.score >= 6.5
                      ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                      : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                }`}>
                  {res.score} / 10đ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium CTA (Monetization component) */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl border border-indigo-700/35 p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 text-center md:text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            VIP MEMBERSHIP PREVIEW
          </span>
          <h3 className="text-xl font-black">Nâng Cấp Gói VIP Mock Interview</h3>
          <p className="text-xs text-indigo-200 leading-relaxed max-w-lg">
            Mở khóa 20+ người phỏng vấn ảo mô phỏng các Tech Architect từ Google, Netflix, Amazon. Nhận báo cáo năng lực chi tiết gửi kèm hồ sơ xin việc của bạn.
          </p>
        </div>

        <div className="flex-shrink-0 relative z-10 w-full md:w-auto">
          <button
            onClick={() => alert("Cảm ơn bạn đã quan tâm! Gói phỏng vấn VIP sẽ sớm được cập nhật.")}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-yellow-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/15 cursor-pointer select-none transition hover:brightness-105"
          >
            Mở khóa VIP ngay
            <Crown className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Back to setup button */}
      <div className="flex justify-center">
        <button
          onClick={onResetInterview}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-bold flex items-center gap-1 cursor-pointer select-none transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Thử lại buổi phỏng vấn khác
        </button>
      </div>

    </div>
  );
};
