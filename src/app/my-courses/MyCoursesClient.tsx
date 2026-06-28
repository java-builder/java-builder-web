"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { enrollmentApi } from "@/services/enrollment.service";
import {
  CourseLevel,
  MyEnrolledCourseResponse,
} from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatShortDate } from "@/utils/dateUtils";
import { useI18n } from "@/contexts/I18nContext";
import { Pagination } from "@/components/ui/Pagination";
import {
  MyCourseCard,
  MyCoursesEmptyState,
  MyCoursesFilter,
  MyCoursesHeader,
  MyCoursesLoadingState,
  MyCoursesStats,
  type CourseStatusFilter,
} from "@/components/my-courses";

const PAGE_SIZE = 8;

export default function MyCoursesClient() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const [courses, setCourses] = useState<MyEnrolledCourseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>("ALL");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, userLoading, router, mounted]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchMyCourses = async () => {
      setIsLoading(true);
      try {
        const response = await enrollmentApi.getMyCourses(
          currentPage,
          PAGE_SIZE
        );
        if (response.data) {
          setCourses(response.data.data || []);
          setTotalPages(response.data.totalPages || 1);
          setTotalElements(response.data.totalElements || 0);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error(t("myCoursesPage.loadError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyCourses();
  }, [currentPage, currentUser, t]);

  const counts = useMemo(() => {
    const completed = courses.filter((c) => c.completed).length;
    const learning = courses.filter(
      (c) => !c.completed && c.progress > 0
    ).length;
    return {
      ALL: courses.length,
      LEARNING: learning,
      COMPLETED: completed,
    } satisfies Record<CourseStatusFilter, number>;
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (statusFilter === "ALL") return courses;
    if (statusFilter === "COMPLETED") return courses.filter((c) => c.completed);
    return courses.filter((c) => !c.completed);
  }, [courses, statusFilter]);

  const getLevelText = (level?: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return t("courseDetail.beginner");
      case CourseLevel.INTERMEDIATE:
        return t("courseDetail.intermediate");
      case CourseLevel.ADVANCED:
        return t("courseDetail.advanced");
      case CourseLevel.EXPERT:
        return t("courseDetail.expert");
      default:
        return t("common.all");
    }
  };

  const filterLabels: Record<CourseStatusFilter, string> = {
    ALL: t("common.all"),
    LEARNING: t("myCoursesPage.statsLearning"),
    COMPLETED: t("myCoursesPage.statsCompleted"),
  };

  if (!mounted || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent" />
        </div>
      </div>
    );
  }

  if (isLoading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <MyCoursesLoadingState />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:space-y-6 sm:p-6">
        <MyCoursesHeader
          title={t("myCoursesPage.title")}
          subtitle={t("myCoursesPage.subtitle")}
          exploreLabel={t("myCoursesPage.exploreCourses")}
        />

        {courses.length > 0 && (
          <>
            <MyCoursesStats
              total={courses.length}
              completed={counts.COMPLETED}
              learning={counts.LEARNING}
              totalLabel={t("myCoursesPage.statsCourses")}
              completedLabel={t("myCoursesPage.statsCompleted")}
              learningLabel={t("myCoursesPage.statsLearning")}
            />

            <MyCoursesFilter
              filter={statusFilter}
              onChange={setStatusFilter}
              filterLabel={t("myCoursesPage.filterByStatus")}
              labels={filterLabels}
              counts={counts}
            />
          </>
        )}

        {courses.length === 0 ? (
          <MyCoursesEmptyState
            title={t("myCoursesPage.emptyTitle")}
            description={t("myCoursesPage.emptyDesc")}
            exploreLabel={t("myCoursesPage.exploreCourses")}
          />
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("myCoursesPage.noResultsForFilter")}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <MyCourseCard
                  key={course.id}
                  course={course}
                  enrolledAtDate={formatShortDate(course.enrolledAt)}
                  levelLabel={getLevelText(course.level)}
                  statusCompletedLabel={t("myCoursesPage.statusCompleted")}
                  statusLearningLabel={t("myCoursesPage.statusLearning")}
                  progressLabel={t("myCoursesPage.progress")}
                  lessonsLabel={t("myCoursesPage.lessonsCount")}
                  durationLabel={t("myCoursesPage.duration")}
                  enrolledAtLabel={t("myCoursesPage.enrolledAt")}
                  btnStartLabel={t("myCoursesPage.btnStart")}
                  btnContinueLabel={t("myCoursesPage.btnContinue")}
                  btnReviewLabel={t("myCoursesPage.btnReview")}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                itemName={t("myCoursesPage.statsCourses").toLowerCase()}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
