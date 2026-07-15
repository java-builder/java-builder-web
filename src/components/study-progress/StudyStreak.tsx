"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
import { UserDailyActivity, ActivityType } from "@/types/user-activity";
import { TranslationKey } from "@/contexts/I18nContext";

interface StudyStreakProps {
  activities: UserDailyActivity[];
  locale: string;
  t: (key: TranslationKey) => string;
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
  onViewDetails,
}: StudyStreakProps) {
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

    // Mock record streak (always at least the current streak, default 3 if user has active history)
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

      // Label: e.g. "5/7"
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

    return {
      activeDatesSet: activeDates,
      streakCount: currentStreak,
      recordStreak: recStreak,
      todayMinutes: todayMins,
      weekMinutes: totalWeekMins,
      chartData: last7DaysData,
      avgMinutesPerSession: avgMins,
      avgExercisesPerSession: avgExs,
      weekDaysStatus: daysStatus,
    };
  }, [activities, locale]);

  const maxMinutesInChart = useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.minutes));
    return maxVal > 0 ? maxVal : 1;
  }, [chartData]);

  return (
    <div className="flex flex-col gap-5">
      {/* CARD 1: Streak học tập (Cream/Warm Card) */}
      <div className="relative overflow-visible rounded-2xl border border-orange-100 bg-[#FFF9F2] p-4 sm:p-5 shadow-sm dark:border-amber-950/40 dark:bg-[#1E1A16] flex flex-col items-center justify-between min-h-[300px]">
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
            className="h-20 w-20 drop-shadow-sm animate-pulse"
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
          <span className="absolute text-3xl font-black text-white select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] mt-1.5">
            {streakCount}
          </span>
        </div>

        {/* Heading & Subheading */}
        <div className="text-center space-y-0.5">
          <h2 className="text-lg font-bold text-orange-800 dark:text-orange-300">
            {t("studyProgressPage.streakTitle")}
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("studyProgressPage.streakRecord").replace("{days}", String(recordStreak))}
          </p>
        </div>

        {/* Weekly Progress Dots */}
        <div className="w-full mt-3">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t("studyProgressPage.thisWeek")}
          </p>
          <div className="grid grid-cols-7 gap-1 justify-items-center">
            {weekDaysStatus.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition duration-300 ${
                    day.isActive
                      ? "bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-sm ring-2 ring-orange-300 dark:ring-orange-950"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800"
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
        <div className="w-full border-t border-orange-100/80 dark:border-amber-950/20 my-3" />

        {/* Stats Row */}
        <div className="grid grid-cols-2 w-full text-center divide-x divide-orange-100/80 dark:divide-amber-950/20">
          <div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {t("studyProgressPage.avgPerSession")}
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {t("studyProgressPage.minutesValue").replace("{minutes}", String(avgMinutesPerSession))}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {t("studyProgressPage.avgExercisesPerSession")}
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {avgExercisesPerSession.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Bottom encouraging text */}
        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-2.5 italic font-medium">
          {t("studyProgressPage.keepStreakText")}
        </p>
      </div>

      {/* CARD 2: Hôm nay & Tuần này (White/Dark-gray Card) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between min-h-[260px]">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {t("studyProgressPage.todayAndThisWeek")}
          </h2>

          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t("studyProgressPage.todayLabel")}
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {t("studyProgressPage.minutesValue").replace("{minutes}", String(todayMinutes))}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t("studyProgressPage.thisWeek")}
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {t("studyProgressPage.minutesValue").replace("{minutes}", String(weekMinutes))}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-100 dark:border-slate-800 my-3" />

          {/* Daily Bar Chart */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              {t("studyProgressPage.byDay")}
            </p>

            <div className="flex items-end justify-between gap-1 h-14 px-0.5 mt-2.5">
              {chartData.map((d) => {
                const heightPercent =
                  maxMinutesInChart > 0 ? (d.minutes / maxMinutesInChart) * 100 : 0;
                return (
                  <div
                    key={d.dateStr}
                    className="flex flex-col items-center flex-1 gap-1 group relative"
                  >
                    {/* Bar container */}
                    <div className="w-full bg-slate-100/60 dark:bg-slate-800/40 rounded-full h-8 flex items-end relative overflow-visible">
                      {d.minutes > 0 ? (
                        <div
                          className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-full transition-all duration-700 ease-out origin-bottom"
                          style={{ height: `${Math.max(heightPercent, 15)}%` }}
                        />
                      ) : (
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mb-0.5" />
                      )}

                      {/* Tooltip on hover */}
                      <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-20 shadow-md">
                        {t("studyProgressPage.minutesValue").replace("{minutes}", String(d.minutes))}
                      </span>
                    </div>
                    {/* Date label */}
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 select-none">
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
          <div className="text-center mt-4">
            <button
              onClick={onViewDetails}
              className="text-red-800 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-sm hover:underline transition cursor-pointer select-none"
            >
              {t("studyProgressPage.viewDetails")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
