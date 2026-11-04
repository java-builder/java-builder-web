"use client";

import { useMemo } from "react";
import { Flame, Clock, BarChart3 } from "lucide-react";
import { UserDailyActivity, ActivityType } from "@/types/user-activity";
import { TranslationKey } from "@/contexts/I18nContext";
import { useUserStreak } from "@/hooks/useUserStreak";

interface StudyStreakProps {
  activities: UserDailyActivity[];
  locale: string;
  t: (key: TranslationKey) => string;
  isLoading?: boolean;
  onViewDetails?: () => void;
}

const weekdayLabels: Record<string, string[]> = {
  vi: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
  ja: ["月", "火", "水", "木", "金", "土", "日"],
  ko: ["월", "화", "수", "목", "금", "토", "일"],
};

export default function StudyStreak({
  activities,
  locale,
  t,
  isLoading,
  onViewDetails,
}: StudyStreakProps) {
  const { data: userStreakData, isLoading: isStreakLoading } = useUserStreak();
  const showSkeleton = isLoading || isStreakLoading;

  // Activity minutes config
  const getActivityMinutes = (type: ActivityType) => {
    switch (type) {
      case ActivityType.VIEW_LESSON:
        return 10;
      case ActivityType.READ_BLOG:
        return 5;
      case ActivityType.READ_INTERVIEW:
        return 8;
      case ActivityType.SUBMIT_EXERCISE:
        return 15;
      default:
        return 5;
    }
  };

  const formatDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 1. Process activity dates and calculate streak
  const {
    streakCount,
    recordStreak,
    todayMinutes,
    weekMinutes,
    chartData,
    avgMinutesPerSession,
    avgExercisesPerSession,
    weekDaysStatus,
  } = useMemo(() => {
    const activeDates = new Set<string>();
    const dateToMinutes: Record<string, number> = {};
    const dateToExerciseCount: Record<string, number> = {};

    activities.forEach((act) => {
      try {
        const d = new Date(act.activityDateTime);
        if (!isNaN(d.getTime())) {
          const dateStr = formatDateString(d);
          activeDates.add(dateStr);

          // Track minutes
          const mins = getActivityMinutes(act.activityType);
          dateToMinutes[dateStr] = (dateToMinutes[dateStr] || 0) + mins;

          // Track exercises
          if (act.activityType === ActivityType.SUBMIT_EXERCISE) {
            dateToExerciseCount[dateStr] = (dateToExerciseCount[dateStr] || 0) + 1;
          }
        }
      } catch (e) {
        console.error("Error parsing date in streak logic", e);
      }
    });

    // Calculate current streak
    const today = new Date();
    const todayStr = formatDateString(today);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = formatDateString(yesterday);

    let currentStreak = 0;
    let checkDate = new Date();

    if (activeDates.has(todayStr)) {
      checkDate = today;
    } else if (activeDates.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      currentStreak = 0;
    }

    if (activeDates.has(todayStr) || activeDates.has(yesterdayStr)) {
      while (true) {
        const checkStr = formatDateString(checkDate);
        if (activeDates.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const recStreak = activeDates.size > 0 ? Math.max(currentStreak, 3) : currentStreak;

    // Today's minutes
    const todayMins = dateToMinutes[todayStr] || 0;

    // Week's minutes (last 7 days including today)
    let totalWeekMins = 0;
    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = formatDateString(d);
      const mins = dateToMinutes[dateStr] || 0;
      totalWeekMins += mins;

      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      last7DaysData.push({
        dateStr,
        label,
        minutes: mins,
      });
    }

    // Calculate Weekdays Status (Monday to Sunday of the current week)
    const getStartOfWeek = (d: Date) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(today);
    const daysArr = weekdayLabels[locale] || weekdayLabels["vi"];
    const daysStatus = daysArr.map((label, idx) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + idx);
      const dateStr = formatDateString(d);
      return {
        label,
        isActive: activeDates.has(dateStr),
      };
    });

    // Average session metrics (using active days)
    const activeDaysCount = activeDates.size;
    let avgMins = 0;
    let avgExs = 0;

    if (activeDaysCount > 0) {
      let totalMins = 0;
      let totalExs = 0;
      Object.keys(dateToMinutes).forEach((dateStr) => {
        totalMins += dateToMinutes[dateStr];
        totalExs += dateToExerciseCount[dateStr] || 0;
      });
      avgMins = Math.round(totalMins / activeDaysCount);
      avgExs = parseFloat((totalExs / activeDaysCount).toFixed(1));
    }

    const displayStreakCount = userStreakData ? userStreakData.currentStreak : currentStreak;
    const displayRecordStreak = userStreakData ? userStreakData.longestStreak : recStreak;

    return {
      activeDatesSet: activeDates,
      streakCount: displayStreakCount,
      recordStreak: displayRecordStreak,
      todayMinutes: todayMins,
      weekMinutes: totalWeekMins,
      chartData: last7DaysData,
      avgMinutesPerSession: avgMins,
      avgExercisesPerSession: avgExs,
      weekDaysStatus: daysStatus,
    };
  }, [activities, locale, userStreakData]);

  const maxMinutesInChart = useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.minutes));
    return maxVal > 0 ? maxVal : 1;
  }, [chartData]);

  if (showSkeleton) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col items-center justify-between min-h-[300px] animate-pulse">
          <div className="w-16 h-16 rounded-full bg-muted my-3" />
          <div className="h-5 w-32 bg-muted rounded mb-2" />
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="grid grid-cols-7 gap-1.5 w-full mt-4 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-muted" />
            ))}
          </div>
          <div className="w-full border-t border-border my-3" />
          <div className="grid grid-cols-2 w-full gap-2 text-center">
            <div className="h-10 bg-muted rounded-xl" />
            <div className="h-10 bg-muted rounded-xl" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between min-h-[250px] animate-pulse">
          <div className="space-y-3">
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-16 bg-muted rounded-xl" />
              <div className="h-16 bg-muted rounded-xl" />
            </div>
            <div className="w-full border-t border-border my-3" />
            <div className="flex items-end justify-between gap-1.5 h-16 mt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex-1 bg-muted rounded-full h-10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* CARD 1: Streak học tập (with original Flame & Ribbon icons) */}
      <div className="relative overflow-visible rounded-2xl border border-orange-200/70 dark:border-border bg-gradient-to-b from-[#FFF9F2] to-surface dark:from-surface dark:to-surface p-5 shadow-xs flex flex-col items-center justify-between min-h-[310px]">
        {/* Top-Right Red Ribbon with Gold Star */}
        <div className="absolute -top-1 right-4 z-10 select-none">
          <svg
            className="h-10 w-7.5 drop-shadow-md"
            viewBox="0 0 32 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0H32V40L16 33.6L0 40V0Z" fill="#DC2626" />
            <polygon
              points="16,10 18.5,15 24,15.5 20,19.5 21.5,25 16,22 10.5,25 12,19.5 8,15.5 13.5,15"
              fill="#FBBF24"
            />
          </svg>
        </div>

        {/* Large Fire Icon with Streak Number inside */}
        <div className="relative flex items-center justify-center my-2">
          <svg
            className="h-20 w-20 drop-shadow-sm"
            style={{ animationDuration: "3s" }}
            viewBox="0 0 100 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="flameOrange" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="60%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#FB923C" />
              </linearGradient>
              <linearGradient id="flameYellow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#CA8A04" />
                <stop offset="60%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#FDE047" />
              </linearGradient>
            </defs>
            {/* Outer flame */}
            <path
              d="M50 5C40 22 28 35 28 62C28 85 45 105 70 105C95 105 102 85 102 62C102 35 80 18 70 5C76 22 50 5 50 5Z"
              fill="url(#flameOrange)"
              transform="translate(-10, 0)"
            />
            {/* Inner flame */}
            <path
              d="M50 35C44 48 38 58 38 75C38 88 48 98 62 98C76 98 80 88 80 75C80 58 64 48 60 35C62 48 50 35 50 35Z"
              fill="url(#flameYellow)"
              transform="translate(-10, 0)"
            />
          </svg>
          {/* Number centered inside the flame */}
          <span className="absolute text-3xl font-black text-white select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] mt-1.5 tabular-nums">
            {streakCount}
          </span>
        </div>

        {/* Heading & Subheading */}
        <div className="text-center space-y-0.5">
          <h2 className="text-lg font-extrabold text-orange-800 dark:text-orange-400">
            {t("studyProgressPage.streakTitle")}
          </h2>
          <p className="text-xs font-semibold text-muted-foreground">
            {t("studyProgressPage.streakRecord").replace("{days}", String(recordStreak))}
          </p>
        </div>

        {/* Weekly Progress Dots */}
        <div className="w-full mt-3.5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t("studyProgressPage.thisWeek")}
            </p>
            <span className="text-[11px] font-bold text-foreground tabular-nums">
              {weekDaysStatus.filter((d) => d.isActive).length}/7
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 justify-items-center">
            {weekDaysStatus.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition duration-300 ${
                    day.isActive
                      ? "bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-xs ring-2 ring-orange-300 dark:ring-orange-950"
                      : "bg-background text-muted-foreground border border-border"
                  }`}
                >
                  {day.isActive ? (
                    <Flame className="h-4 w-4 text-white fill-white" />
                  ) : (
                    day.label
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border my-3.5" />

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="rounded-xl border border-border bg-background/70 p-2.5 text-center">
            <p className="text-[10px] font-semibold text-muted-foreground">
              {t("studyProgressPage.avgPerSession")}
            </p>
            <p className="text-base font-extrabold text-foreground mt-0.5 tabular-nums">
              {t("studyProgressPage.minutesValue").replace("{minutes}", String(avgMinutesPerSession))}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/70 p-2.5 text-center">
            <p className="text-[10px] font-semibold text-muted-foreground">
              {t("studyProgressPage.avgExercisesPerSession")}
            </p>
            <p className="text-base font-extrabold text-foreground mt-0.5 tabular-nums">
              {avgExercisesPerSession.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Bottom encouraging text */}
        <p className="text-[11px] text-muted-foreground text-center mt-2.5 italic font-medium">
          {t("studyProgressPage.keepStreakText")}
        </p>
      </div>

      {/* CARD 2: Hôm nay & Tuần này */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary border border-primary/15">
              <Clock className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-foreground">
              {t("studyProgressPage.todayAndThisWeek")}
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background/60 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">
                {t("studyProgressPage.todayLabel")}
              </p>
              <p className="text-xl font-black text-foreground mt-1 tabular-nums">
                {t("studyProgressPage.minutesValue").replace("{minutes}", String(todayMinutes))}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background/60 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">
                {t("studyProgressPage.thisWeek")}
              </p>
              <p className="text-xl font-black text-primary mt-1 tabular-nums">
                {t("studyProgressPage.minutesValue").replace("{minutes}", String(weekMinutes))}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border my-4" />

          {/* Daily Bar Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                {t("studyProgressPage.byDay")}
              </p>
            </div>

            <div className="flex items-end justify-between gap-2 h-20 px-1 pt-2">
              {chartData.map((d) => {
                const heightPercent =
                  maxMinutesInChart > 0 ? (d.minutes / maxMinutesInChart) * 100 : 0;
                return (
                  <div
                    key={d.dateStr}
                    className="flex flex-col items-center flex-1 gap-1.5 group relative"
                  >
                    {/* Bar container */}
                    <div className="w-full bg-background border border-border/60 rounded-lg h-12 flex items-end p-0.5 relative overflow-visible">
                      {d.minutes > 0 ? (
                        <div
                          className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-md transition-all duration-500 ease-out origin-bottom"
                          style={{ height: `${Math.max(heightPercent, 18)}%` }}
                        />
                      ) : (
                        <div className="w-full bg-muted h-1 rounded-sm" />
                      )}

                      {/* Tooltip on hover */}
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none whitespace-nowrap z-20 shadow-sm">
                        {t("studyProgressPage.minutesValue").replace("{minutes}", String(d.minutes))}
                      </span>
                    </div>
                    {/* Date label */}
                    <span className="text-[10px] font-semibold text-muted-foreground tabular-nums select-none">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Link: Xem chi tiết */}
        {onViewDetails && (
          <div className="text-center mt-4 pt-3 border-t border-border">
            <button
              onClick={onViewDetails}
              className="text-primary hover:text-primary-hover font-semibold text-xs hover:underline transition cursor-pointer select-none"
            >
              {t("studyProgressPage.viewDetails")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
