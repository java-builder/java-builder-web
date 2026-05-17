"use client";

import { useMemo } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Trophy, 
  Target,
  FileCheck,
  Percent,
  CheckCheck,
  ClipboardCheck,
  Loader2
} from "lucide-react";
import { getRandomQuote } from "@/utils/motivationalQuotes";
import { useMyExercises } from "@/hooks/useMyExercises";

export default function MyExercisesClient() {
  // Get motivational quote
  const quote = useMemo(() => getRandomQuote(), []);

  // Fetch submissions from API
  const { submissions, statistics, loading, error } = useMyExercises(1);

  // Use statistics from API
  const stats = useMemo(() => {
    if (!statistics) {
      return {
        total: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        avgScore: 0,
        perfectScores: 0,
        accuracy: 0,
      };
    }

    return {
      total: statistics.totalSubmissions,
      totalQuestions: statistics.totalQuestions,
      totalCorrect: statistics.totalCorrect,
      avgScore: statistics.avgScore,
      perfectScores: statistics.perfectScores,
      accuracy: statistics.accuracy,
    };
  }, [statistics]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Lịch sử bài tập đã hoàn thành
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Theo dõi tiến độ học tập, xem lại kết quả và cải thiện kỹ năng của bạn qua từng bài tập
                </p>
              </div>
            </div>

            {/* Motivational Quote - Desktop */}
            <div className="hidden lg:block max-w-xs">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white italic leading-relaxed line-clamp-2">
                      &ldquo;{quote.quote}&rdquo;
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      — {quote.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote - Mobile */}
          <div className="lg:hidden mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white italic leading-relaxed">
                    &ldquo;{quote.quote}&rdquo;
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    — {quote.author}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Tổng bài</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Điểm TB</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Độ chính xác</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.accuracy}%</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Bài điểm tối đa</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.perfectScores}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Câu đúng</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCorrect}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Câu sai</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalQuestions - stats.totalCorrect}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Không tìm thấy bài tập
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
            <Link
              href="/exercises"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              Làm bài tập mới
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => {
              const scorePercentage = Math.round((submission.score / submission.maxScore) * 100);
              
              return (
                <div
                  key={submission.submissionId}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      scorePercentage >= 80 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : scorePercentage >= 50 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {scorePercentage >= 80 ? (
                        <Trophy className={`w-5 h-5 ${getScoreColor(scorePercentage)}`} />
                      ) : (
                        <Target className={`w-5 h-5 ${getScoreColor(scorePercentage)}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {submission.exerciseTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          {submission.totalQuestions} câu
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(submission.submittedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Score & Action */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(scorePercentage)}`}>
                          {scorePercentage}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {submission.correctCount}/{submission.totalQuestions} đúng
                        </div>
                      </div>

                      <Link
                        href={`/exercises/${submission.exerciseSlug}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
                      >
                        <span>Xem</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {submissions.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href="/exercises"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
            >
              <Trophy className="w-4 h-4" />
              Làm thêm bài tập mới
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
