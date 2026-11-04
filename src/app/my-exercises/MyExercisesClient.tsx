"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { exerciseSubmissionApi } from "@/services/exercise-submission.service";
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
  Loader2,
  Quote,
  Clock,
  HelpCircle,
  ArrowRight,
  Search,
  PieChart as PieChartIcon,
  BarChart3,
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
import { useI18n } from "@/contexts/I18nContext";

type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";

export default function MyExercisesClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, locale } = useI18n();
  const quote = useMemo(() => getRandomQuote(), []);
  const { submissions, statistics, loading, error } = useMyExercises(1);
  const [loadingSubmissionId, setLoadingSubmissionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("ALL");

  const handleViewSubmission = async (submissionId: string) => {
    if (loadingSubmissionId) return;
    setLoadingSubmissionId(submissionId);
    try {
      await queryClient.prefetchQuery({
        queryKey: ["submission", submissionId],
        queryFn: () => exerciseSubmissionApi.getSubmissionById(submissionId),
      });
    } catch {
      // Ignored: review page will fetch if prefetch fails
    } finally {
      router.push(`/my-exercises/review/${submissionId}`);
    }
  };

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

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesDifficulty =
        difficultyFilter === "ALL" || sub.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        sub.exerciseTitle.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesDifficulty && matchesSearch;
    });
  }, [submissions, difficultyFilter, searchQuery]);

  const formatDate = (dateString: string) => {
    const localeMap: Record<string, string> = {
      vi: "vi-VN",
      en: "en-US",
      ja: "ja-JP",
      ko: "ko-KR",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(localeMap[locale] || "vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
              <div className="space-y-2">
                <div className="h-7 bg-muted rounded-lg w-48" />
                <div className="h-4 bg-muted rounded w-72" />
              </div>
            </div>
            <div className="h-16 w-full max-w-md rounded-2xl bg-surface border border-border" />
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-surface rounded-2xl p-4 border border-border h-28"
              />
            ))}
          </div>

          {/* Charts grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 border border-border h-80" />
            <div className="bg-surface rounded-2xl p-6 border border-border h-80" />
          </div>

          {/* List skeleton */}
          <div className="bg-surface rounded-2xl p-6 border border-border space-y-4">
            <div className="h-6 bg-muted rounded w-40 mb-4" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 items-center p-4 rounded-xl border border-border"
              >
                <div className="w-14 h-14 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3.5 bg-muted rounded w-1/2" />
                </div>
                <div className="w-24 h-9 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {t("coursesPage.errorTitle")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-sm rounded-full transition-colors font-semibold shadow-xs cursor-pointer"
          >
            {t("coursesPage.retryBtn")}
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: t("myExercisesPage.statsTotal"),
      value: stats.total,
      icon: FileCheck,
      tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      label: t("myExercisesPage.statsAvgScore"),
      value: `${stats.avgScore}%`,
      icon: Percent,
      tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: t("myExercisesPage.statsAccuracy"),
      value: `${stats.accuracy}%`,
      icon: Target,
      tone: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      label: t("myExercisesPage.statsPerfect"),
      value: stats.perfectScores,
      icon: Trophy,
      tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      label: t("myExercisesPage.statsCorrect"),
      value: stats.totalCorrect,
      icon: CheckCheck,
      tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: t("myExercisesPage.statsIncorrect"),
      value: Math.max(0, stats.totalQuestions - stats.totalCorrect),
      icon: XCircle,
      tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("myExercisesPage.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {t("myExercisesPage.subtitle")}
            </p>
          </div>

          {/* Motivational Quote */}
          <div className="flex max-w-md items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-xs">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary border border-primary/15">
              <Quote className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="line-clamp-2 text-xs italic leading-relaxed text-foreground/90 font-medium">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <p className="mt-1 text-[11px] font-semibold text-primary">
                — {quote.author}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {statCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all hover:border-primary/30 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.tone}`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-2xl font-extrabold tabular-nums text-foreground">
                    {item.value}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground truncate">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        {stats.total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Tỷ lệ câu đúng/sai */}
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft border border-primary/15 text-primary">
                    <PieChartIcon className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-sm font-bold text-foreground">
                    {t("myExercisesPage.chartAnswersTitle")}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {stats.totalQuestions} câu
                </span>
              </div>

              <div className="relative h-60 flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="colorIncorrect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={[
                        {
                          name: t("myExercisesPage.chartCorrect"),
                          value: stats.totalCorrect,
                          color: "url(#colorCorrect)",
                        },
                        {
                          name: t("myExercisesPage.chartIncorrect"),
                          value: Math.max(0, stats.totalQuestions - stats.totalCorrect),
                          color: "url(#colorIncorrect)",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      <Cell fill="url(#colorCorrect)" />
                      <Cell fill="url(#colorIncorrect)" />
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const isCorrect =
                            payload[0].name === t("myExercisesPage.chartCorrect");
                          const color = isCorrect ? "#10b981" : "#f43f5e";
                          return (
                            <div className="bg-surface px-3.5 py-2.5 shadow-lg rounded-xl border border-border">
                              <p className="text-xs font-semibold text-muted-foreground mb-0.5">
                                {payload[0].name}
                              </p>
                              <p className="text-sm font-extrabold" style={{ color }}>
                                {t("myExercisesPage.chartCorrectCount").replace(
                                  "{count}",
                                  String(payload[0].value)
                                )}{" "}
                                (
                                {stats.totalQuestions > 0
                                  ? (
                                      ((payload[0].value as number) /
                                        stats.totalQuestions) *
                                      100
                                    ).toFixed(1)
                                  : 0}
                                %)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Stats overlay */}
                <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none select-none">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {t("myExercisesPage.statsAccuracy")}
                  </span>
                  <span className="text-2xl font-black text-foreground mt-0.5 tabular-nums">
                    {stats.accuracy}%
                  </span>
                </div>
              </div>

              {/* Legends Badges */}
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {t("myExercisesPage.chartCorrect")}: {stats.totalCorrect}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {t("myExercisesPage.chartIncorrect")}:{" "}
                    {Math.max(0, stats.totalQuestions - stats.totalCorrect)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bar Chart - Các chỉ số */}
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft border border-primary/15 text-primary">
                    <BarChart3 className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-sm font-bold text-foreground">
                    {t("myExercisesPage.chartStatsTitle")}
                  </h3>
                </div>
              </div>

              <div className="h-60 my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: t("myExercisesPage.chartAvgScore"),
                        value: stats.avgScore,
                        color: "#3b82f6",
                      },
                      {
                        name: t("myExercisesPage.chartAccuracy"),
                        value: stats.accuracy,
                        color: "#8b5cf6",
                      },
                      {
                        name: t("myExercisesPage.chartPerfect"),
                        value:
                          stats.total > 0
                            ? Math.round((stats.perfectScores / stats.total) * 100)
                            : 0,
                        color: "#f59e0b",
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAvgScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                      <linearGradient id="colorPerfect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="currentColor"
                      className="text-border"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-surface px-3.5 py-2.5 shadow-lg rounded-xl border border-border">
                              <p className="text-xs font-semibold text-muted-foreground mb-0.5">
                                {payload[0].payload.name}
                              </p>
                              <p
                                className="text-sm font-extrabold"
                                style={{ color: payload[0].payload.color }}
                              >
                                {payload[0].value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={44}>
                      <Cell fill="url(#colorAvgScore)" />
                      <Cell fill="url(#colorAccuracy)" />
                      <Cell fill="url(#colorPerfect)" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-[11px] font-semibold text-muted-foreground truncate">
                      {t("myExercisesPage.chartAvgScore")}
                    </p>
                  </div>
                  <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {stats.avgScore}%
                  </p>
                </div>
                <div className="text-center border-x border-border">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <p className="text-[11px] font-semibold text-muted-foreground truncate">
                      {t("myExercisesPage.chartAccuracy")}
                    </p>
                  </div>
                  <p className="text-base font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
                    {stats.accuracy}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-[11px] font-semibold text-muted-foreground truncate">
                      {t("myExercisesPage.chartPerfectLabel")}
                    </p>
                  </div>
                  <p className="text-base font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                    {stats.total > 0
                      ? Math.round((stats.perfectScores / stats.total) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Section */}
        <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
          {/* Submissions Header & Filter Bar */}
          <div className="flex flex-col gap-3.5 border-b border-border p-4 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft border border-primary/15 text-primary">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  Lịch sử bài làm
                </h2>
                <span className="inline-flex items-center rounded-full bg-primary-soft border border-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary tabular-nums">
                  {filteredSubmissions.length}
                </span>
              </div>

              {submissions.length > 0 && (
                <Link
                  href="/exercises"
                  className="inline-flex lg:hidden items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition shadow-xs"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{t("myExercisesPage.btnSolveMore")}</span>
                </Link>
              )}
            </div>

            {submissions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search input */}
                <div className="relative flex-1 sm:flex-initial sm:w-60">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên bài tập..."
                    className="h-9 w-full rounded-full border border-border bg-background pl-8 pr-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Difficulty filter pills */}
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: "ALL", label: "Tất cả" },
                      { id: "EASY", label: t("exercisesPage.filterEasy") },
                      { id: "MEDIUM", label: t("exercisesPage.filterMedium") },
                      { id: "HARD", label: t("exercisesPage.filterHard") },
                    ] as const
                  ).map((tab) => {
                    const active = difficultyFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDifficultyFilter(tab.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          active
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/exercises"
                  className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-4 py-1.5 text-xs font-semibold text-primary-foreground transition shadow-xs"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{t("myExercisesPage.btnSolveMore")}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Submissions List */}
          {submissions.length === 0 ? (
            <div className="p-10 sm:p-14 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-soft border border-primary/15 text-primary rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5">
                {t("myExercisesPage.emptyTitle")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                {t("myExercisesPage.emptyDesc")}
              </p>
              <Link
                href="/exercises"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-sm rounded-full transition font-semibold shadow-xs"
              >
                {t("myExercisesPage.btnSolveNew")}
              </Link>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Không tìm thấy bài làm nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredSubmissions.map((submission) => {
                const scorePercentage = Math.round(
                  (submission.score / submission.maxScore) * 100
                );

                const getDifficultyBadge = (difficulty: string) => {
                  switch (difficulty) {
                    case "EASY":
                      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
                    case "MEDIUM":
                      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
                    case "HARD":
                      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
                    default:
                      return "bg-muted text-muted-foreground border-border";
                  }
                };

                const getExerciseTypeLabel = (type: string) => {
                  switch (type) {
                    case "MULTIPLE_CHOICE":
                      return t("exercisesPage.typeMultipleChoice");
                    case "CODING":
                      return t("exercisesPage.typeCoding");
                    case "ESSAY":
                      return t("exercisesPage.typeEssay");
                    default:
                      return type;
                  }
                };

                const getDifficultyLabel = (difficulty: string) => {
                  switch (difficulty) {
                    case "EASY":
                      return t("exercisesPage.filterEasy");
                    case "MEDIUM":
                      return t("exercisesPage.filterMedium");
                    case "HARD":
                      return t("exercisesPage.filterHard");
                    default:
                      return difficulty;
                  }
                };

                const isCurrentLoading =
                  loadingSubmissionId === submission.submissionId;

                return (
                  <div
                    key={submission.submissionId}
                    onClick={() => handleViewSubmission(submission.submissionId)}
                    className="p-4 sm:px-6 sm:py-4.5 hover:bg-background/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                      {/* Circular Progress */}
                      <div className="shrink-0 relative w-14 h-14 sm:w-15 sm:h-15">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="27"
                            stroke="currentColor"
                            strokeWidth="4.5"
                            fill="none"
                            className="text-muted"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="27"
                            stroke="currentColor"
                            strokeWidth="4.5"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 27}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 27 * (1 - scorePercentage / 100)
                            }`}
                            className={`transition-all duration-500 ${
                              scorePercentage >= 80
                                ? "text-emerald-500"
                                : scorePercentage >= 50
                                  ? "text-amber-500"
                                  : "text-rose-500"
                            }`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={`text-xs font-extrabold tabular-nums ${
                              scorePercentage >= 80
                                ? "text-emerald-600 dark:text-emerald-400"
                                : scorePercentage >= 50
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {scorePercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getDifficultyBadge(
                              submission.difficulty
                            )}`}
                          >
                            {getDifficultyLabel(submission.difficulty)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-background border border-border text-muted-foreground text-[11px] font-semibold rounded-full">
                            {getExerciseTypeLabel(submission.exerciseType)}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold rounded-full">
                            <HelpCircle className="w-3 h-3" />
                            {t("myExercisesPage.questionsCount").replace(
                              "{count}",
                              String(submission.totalQuestions)
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-semibold rounded-full">
                            <Clock className="w-3 h-3" />
                            {t("myExercisesPage.durationMinutes").replace(
                              "{count}",
                              String(submission.timeLimit)
                            )}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {submission.exerciseTitle}
                        </h3>

                        <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="inline-flex items-center gap-1.5 tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/80" />
                            {formatDate(submission.submittedAt)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            {t("myExercisesPage.correctCount")
                              .replace("{correct}", String(submission.correctCount))
                              .replace("{total}", String(submission.totalQuestions))}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 w-full sm:w-auto text-right">
                        <button
                          type="button"
                          disabled={loadingSubmissionId !== null}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSubmission(submission.submissionId);
                          }}
                          className={`inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer active:scale-95 ${
                            isCurrentLoading
                              ? "border-primary/30 bg-primary-soft text-primary cursor-wait"
                              : "border-border bg-background text-foreground group-hover:border-primary/40 group-hover:bg-primary-soft group-hover:text-primary"
                          } ${
                            loadingSubmissionId !== null && !isCurrentLoading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isCurrentLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                              <span>Đang tải...</span>
                            </>
                          ) : (
                            <>
                              <span>{t("myExercisesPage.btnView")}</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
