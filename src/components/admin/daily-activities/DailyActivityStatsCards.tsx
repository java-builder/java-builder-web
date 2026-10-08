"use client";

import { useMemo } from "react";
import { UserDailyActivity, ActivityType, UserDailyActivityStats } from "@/types/user-activity";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, BookOpen, FileText, HelpCircle, Code2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface DailyActivityStatsCardsProps {
  activities?: UserDailyActivity[];
  totalElements?: number;
  stats?: UserDailyActivityStats | null;
  isLoading?: boolean;
  hasDateFilter?: boolean;
}

export const DailyActivityStatsCards = ({
  activities = [],
  totalElements = 0,
  stats,
  isLoading = false,
  hasDateFilter = false,
}: DailyActivityStatsCardsProps) => {
  const { t } = useI18n();

  const fallbackCounts = useMemo(() => {
    let lessons = 0;
    let blogs = 0;
    let interviews = 0;
    let exercises = 0;

    for (const item of activities) {
      switch (item.activityType) {
        case ActivityType.VIEW_LESSON:
          lessons++;
          break;
        case ActivityType.READ_BLOG:
          blogs++;
          break;
        case ActivityType.READ_INTERVIEW:
          interviews++;
          break;
        case ActivityType.SUBMIT_EXERCISE:
          exercises++;
          break;
      }
    }

    return { lessons, blogs, interviews, exercises };
  }, [activities]);

  const totalVal = stats ? stats.totalActivities : totalElements;
  const lessonsVal = stats ? stats.lessonViews : fallbackCounts.lessons;
  const blogsVal = stats ? stats.blogReads : fallbackCounts.blogs;
  const interviewsVal = stats ? stats.interviewReads : fallbackCounts.interviews;
  const exercisesVal = stats ? stats.exerciseSubmissions : fallbackCounts.exercises;

  const totalSubtext = stats
    ? hasDateFilter
      ? "Theo khoảng ngày đã chọn"
      : "Hôm nay (toàn hệ thống)"
    : `${activities.length} trên trang này`;

  const items = [
    {
      label: t("admin.dailyActivities.statTotalActivities"),
      value: totalVal.toLocaleString("vi-VN"),
      subtext: totalSubtext,
      icon: <Activity className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
      bg: "bg-sky-50 dark:bg-sky-950/30",
      accent: "border-sky-100 dark:border-sky-900/30",
      valueClass: "text-foreground",
    },
    {
      label: t("admin.dailyActivities.statLessons"),
      value: lessonsVal.toLocaleString("vi-VN"),
      subtext: "Lượt xem bài học",
      icon: <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accent: "border-emerald-100 dark:border-emerald-900/30",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: t("admin.dailyActivities.statBlogs"),
      value: blogsVal.toLocaleString("vi-VN"),
      subtext: "Lượt đọc bài viết",
      icon: <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-50 dark:bg-purple-950/30",
      accent: "border-purple-100 dark:border-purple-900/30",
      valueClass: "text-purple-600 dark:text-purple-400",
    },
    {
      label: t("admin.dailyActivities.statInterviews"),
      value: interviewsVal.toLocaleString("vi-VN"),
      subtext: "Luyện phỏng vấn",
      icon: <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accent: "border-blue-100 dark:border-blue-900/30",
      valueClass: "text-blue-600 dark:text-blue-400",
    },
    {
      label: t("admin.dailyActivities.statExercises"),
      value: exercisesVal.toLocaleString("vi-VN"),
      subtext: "Nộp bài tập code",
      icon: <Code2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
      bg: "bg-orange-50 dark:bg-orange-950/30",
      accent: "border-orange-100 dark:border-orange-900/30",
      valueClass: "text-orange-600 dark:text-orange-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((idx) => (
          <Card key={idx} className="border border-border/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-2 flex-1 mr-3">
                <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                <div className="h-7 w-16 rounded bg-muted animate-pulse" />
                <div className="h-2.5 w-24 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-10 w-10 rounded-xl bg-muted animate-pulse shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <Card
          key={item.label}
          className={`border ${item.accent} hover:shadow-sm transition-all duration-200`}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {item.label}
              </p>
              <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
                {item.value}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {item.subtext}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl shrink-0 ${item.bg}`}>
              {item.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

