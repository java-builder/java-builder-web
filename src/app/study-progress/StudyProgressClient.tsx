"use client";

import { useState, useMemo } from "react";
import { useUserActivities } from "@/hooks/useUserActivities";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";
import {
  ActivityType,
  ActivityTypeDisplayNames,
} from "@/types/user-activity";
import { parseDate } from "@/utils/dateUtils";
import { getRandomQuote } from "@/utils/motivationalQuotes";
import { useI18n } from "@/contexts/I18nContext";
import {
  StudyHeader,
  StudyStats,
  StudyDateFilter,
  StudyTimeline,
  StudyEmptyState,
  StudyLoadingState,
  StudyLoadMoreButton,
  StudyStreak,
  type DateFilterId,
} from "@/components/study-progress";
import { localizeQuote } from "@/components/study-progress/localizeQuote";

const PAGE_SIZE = 20;

export default function StudyProgressClient() {
  const { locale, t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<DateFilterId>("today");

  const { topics } = useInterviewTopics();
  const questionSetToTopicMap = useMemo(() => {
    const map = new Map<string, string>();
    topics.forEach((topic) => {
      topic.questionSets?.forEach((set) => {
        if (set.slug) {
          map.set(set.slug, topic.slug);
        }
      });
    });
    return map;
  }, [topics]);

  const dailyQuote = useMemo(() => getRandomQuote(), []);
  const localizedQuote = useMemo(
    () => localizeQuote(dailyQuote, locale),
    [dailyQuote, locale]
  );

  const getFilterDate = (filter: DateFilterId): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    let targetDate: Date;
    switch (filter) {
      case "today":
        targetDate = new Date(year, month, day);
        break;
      case "yesterday":
        targetDate = new Date(year, month, day - 1);
        break;
      case "days3":
        targetDate = new Date(year, month, day - 3);
        break;
      case "week":
        targetDate = new Date(year, month, day - 7);
        break;
      case "month":
        targetDate = new Date(year, month - 1, day);
        break;
      case "6months":
        targetDate = new Date(year, month - 6, day);
        break;
      case "custom":
        return selectedDate;
      default:
        return "";
    }

    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const filterDate =
    dateFilter === "custom" ? selectedDate : getFilterDate(dateFilter);

  const { data, isLoading, isFetching } = useUserActivities(
    currentPage,
    PAGE_SIZE,
    filterDate || undefined
  );

  const activities = useMemo(() => data?.data || [], [data?.data]);
  const totalPages = data?.totalPages || 1;
  const totalElements = data?.totalElements || 0;

  const groupedActivities = useMemo(() => {
    const groups: Record<string, typeof activities> = {};
    const dateLocale =
      locale === "vi"
        ? "vi-VN"
        : locale === "en"
          ? "en-US"
          : locale === "ja"
            ? "ja-JP"
            : "ko-KR";

    activities.forEach((activity) => {
      const activityDate = parseDate(activity.activityDateTime);
      if (!activityDate) return;

      const date = activityDate.toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[date]) groups[date] = [];
      groups[date].push(activity);
    });
    return groups;
  }, [activities, locale]);

  const stats = useMemo(() => {
    const typeCount: Record<ActivityType, number> = {
      [ActivityType.VIEW_LESSON]: 0,
      [ActivityType.READ_BLOG]: 0,
      [ActivityType.READ_INTERVIEW]: 0,
      [ActivityType.SUBMIT_EXERCISE]: 0,
    };
    activities.forEach((activity) => {
      typeCount[activity.activityType] =
        (typeCount[activity.activityType] || 0) + 1;
    });
    return typeCount;
  }, [activities]);

  const getActivityTypeName = (type: ActivityType) => {
    switch (type) {
      case ActivityType.VIEW_LESSON:
        return t("studyProgressPage.actViewLesson") || ActivityTypeDisplayNames[type];
      case ActivityType.READ_BLOG:
        return t("studyProgressPage.actReadBlog") || ActivityTypeDisplayNames[type];
      case ActivityType.READ_INTERVIEW:
        return t("studyProgressPage.actReadInterview") || ActivityTypeDisplayNames[type];
      case ActivityType.SUBMIT_EXERCISE:
        return t("studyProgressPage.actSubmitExercise") || ActivityTypeDisplayNames[type];
      default:
        return ActivityTypeDisplayNames[type];
    }
  };

  const handleQuickFilter = (filter: DateFilterId) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  const handleCustomDateChange = (value: string) => {
    setSelectedDate(value);
    setDateFilter("custom");
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setSelectedDate("");
    setDateFilter("today");
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const quickLabels: Record<DateFilterId, string> = {
    today: t("studyProgressPage.today"),
    yesterday: t("studyProgressPage.yesterday"),
    days3: t("studyProgressPage.daysAgo3"),
    week: t("studyProgressPage.daysAgo7"),
    month: t("studyProgressPage.monthAgo1"),
    "6months": t("studyProgressPage.monthsAgo6"),
    custom: t("studyProgressPage.chooseSpecificDate"),
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <StudyLoadingState />
        </div>
      </div>
    );
  }

  const isEmpty = Object.keys(groupedActivities).length === 0;
  const hasDateFilter = Boolean(selectedDate);

  // Get all activities fetched so far for streak and chart processing
  const allFetchedActivities = activities;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        <StudyHeader
          title={t("studyProgressPage.title")}
          subtitle={t("studyProgressPage.subtitle")}
          quote={localizedQuote}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Timeline, Stats, Filter */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">


            <StudyDateFilter
              filter={dateFilter}
              selectedDate={selectedDate}
              totalElements={totalElements}
              totalLabel={t("studyProgressPage.activities")}
              filterLabel={t("studyProgressPage.filterTime")}
              customDateLabel={t("studyProgressPage.orChooseDate")}
              customPlaceholder={t("studyProgressPage.chooseSpecificDate")}
              quickLabels={quickLabels}
              onQuickFilter={handleQuickFilter}
              onCustomDateChange={handleCustomDateChange}
              onClear={clearDateFilter}
            />

            <StudyStats
              stats={stats}
              totalElements={totalElements}
              getActivityTypeName={getActivityTypeName}
              isLoading={isLoading || isFetching}
            />

            {isEmpty ? (
              <StudyEmptyState
                hasDateFilter={hasDateFilter}
                title={
                  hasDateFilter
                    ? t("studyProgressPage.noActivity")
                    : t("studyProgressPage.startYourJourney")
                }
                description={
                  hasDateFilter
                    ? t("studyProgressPage.noActivityOnDate")
                    : t("studyProgressPage.startJourneyDesc")
                }
                exploreCoursesLabel={t("studyProgressPage.exploreCourses")}
                doExercisesLabel={t("studyProgressPage.doExercises")}
              />
            ) : (
              <StudyTimeline
                groupedActivities={groupedActivities}
                getActivityTypeName={getActivityTypeName}
                t={t}
                timelineLabel={t("studyProgressPage.timeline")}
                questionSetToTopicMap={questionSetToTopicMap}
              />
            )}

            {currentPage < totalPages && (
              <StudyLoadMoreButton
                isLoading={isFetching}
                loadingLabel={t("studyProgressPage.loadingMore")}
                buttonLabel={t("studyProgressPage.viewMore")}
                pageInfo={t("studyProgressPage.pageInfo")
                  .replace("{current}", String(currentPage))
                  .replace("{total}", String(totalPages))}
                onClick={handleLoadMore}
              />
            )}
          </div>

          {/* Right Column: Study Streak (Dashboard summary) */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <StudyStreak
              activities={allFetchedActivities}
              locale={locale}
              t={t}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
