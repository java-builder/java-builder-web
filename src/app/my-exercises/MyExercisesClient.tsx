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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getRandomQuote } from "@/utils/motivationalQuotes";
import { useMyExercises } from "@/hooks/useMyExercises";

export default function MyExercisesClient() {
  const quote = useMemo(() => getRandomQuote(), []);
  const { submissions, statistics, loading, error } = useMyExercises(1);

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

        {/* Charts Section */}
        {stats.total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart - Tỷ lệ câu đúng/sai */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-red-500 rounded-full"></span>
                Tỷ lệ câu trả lời
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Câu đúng', value: stats.totalCorrect, color: '#10b981' },
                        { name: 'Câu sai', value: stats.totalQuestions - stats.totalCorrect, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-slate-800 px-4 py-3 shadow-xl rounded-xl border border-gray-200 dark:border-slate-700">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {payload[0].name}
                              </p>
                              <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
                                {payload[0].value} câu ({((payload[0].value / stats.totalQuestions) * 100).toFixed(1)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Câu đúng: {stats.totalCorrect}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Câu sai: {stats.totalQuestions - stats.totalCorrect}</span>
                </div>
              </div>
            </div>

            {/* Bar Chart - Các chỉ số */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                Thống kê tổng quan
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Điểm TB', value: stats.avgScore, color: '#3b82f6' },
                      { name: 'Độ chính xác', value: stats.accuracy, color: '#8b5cf6' },
                      { name: 'Tỷ lệ hoàn hảo', value: stats.total > 0 ? Math.round((stats.perfectScores / stats.total) * 100) : 0, color: '#f59e0b' }
                    ]}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-slate-800 px-4 py-3 shadow-xl rounded-xl border border-gray-200 dark:border-slate-700">
                              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                {payload[0].payload.name}
                              </p>
                              <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
                                {payload[0].value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
                      {[
                        { name: 'Điểm TB', value: stats.avgScore, color: '#3b82f6' },
                        { name: 'Độ chính xác', value: stats.accuracy, color: '#8b5cf6' },
                        { name: 'Tỷ lệ hoàn hảo', value: stats.total > 0 ? Math.round((stats.perfectScores / stats.total) * 100) : 0, color: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Điểm TB</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.avgScore}%</p>
                </div>
                <div className="text-center border-l border-r border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded bg-purple-500"></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Độ chính xác</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.accuracy}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded bg-amber-500"></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hoàn hảo</p>
                  </div>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {stats.total > 0 ? Math.round((stats.perfectScores / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
              
              // Difficulty badge color
              const getDifficultyColor = (difficulty: string) => {
                switch (difficulty) {
                  case 'EASY': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
                  case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                  case 'HARD': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                  default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
                }
              };

              // Exercise type label
              const getExerciseTypeLabel = (type: string) => {
                switch (type) {
                  case 'MULTIPLE_CHOICE': return 'Trắc nghiệm';
                  case 'CODING': return 'Lập trình';
                  case 'ESSAY': return 'Tự luận';
                  default: return type;
                }
              };

              // Difficulty label
              const getDifficultyLabel = (difficulty: string) => {
                switch (difficulty) {
                  case 'EASY': return 'Dễ';
                  case 'MEDIUM': return 'Trung bình';
                  case 'HARD': return 'Khó';
                  default: return difficulty;
                }
              };
              
              return (
                <div
                  key={submission.submissionId}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Circular Progress */}
                    <div className="flex-shrink-0 relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - scorePercentage / 100)}`}
                          className={`transition-all duration-500 ${
                            scorePercentage >= 80
                              ? 'text-green-500'
                              : scorePercentage >= 50
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${
                          scorePercentage >= 80
                            ? 'text-green-600 dark:text-green-400'
                            : scorePercentage >= 50
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {scorePercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                          {submission.totalQuestions} câu
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded">
                          {submission.timeLimit} phút
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${getDifficultyColor(submission.difficulty)}`}>
                          {getDifficultyLabel(submission.difficulty)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded">
                          {getExerciseTypeLabel(submission.exerciseType)}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                        {submission.exerciseTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(submission.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {submission.correctCount}/{submission.totalQuestions} đúng
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
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
