"use client";

import { useCallback, useEffect, useState } from "react";
import CourseCard from "@/components/courses/CourseCard";
import {
  CoursesEmptyState,
  CoursesErrorState,
  CoursesFilterBar,
  CoursesHero,
  CoursesLoadingState,
} from "@/components/courses/page";
import { Pagination } from "@/components/ui/Pagination";
import { courseApi } from "@/services/course.service";
import { CourseDetailResponse, CourseLevel } from "@/types/course";
import { useI18n } from "@/contexts/I18nContext";

const PAGE_SIZE = 9;

export default function CoursesPage() {
  const { t } = useI18n();
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [courseLevel, setCourseLevel] = useState<CourseLevel | "">("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const handleSearchSubmit = () => {
    setCurrentSearch(searchText.trim());
    setPage(1);
  };

  const handleLevelChange = (level: CourseLevel | "") => {
    setCourseLevel(level);
    setPage(1);
  };

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await courseApi.getCourses(
        page,
        PAGE_SIZE,
        currentSearch || undefined,
        courseLevel || undefined,
        undefined
      );

      if (response.code === 200 && response.data) {
        setCourses(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      } else {
        throw new Error(
          t("courseDetail.loadError") ||
            "Không thể tải danh sách khóa học"
        );
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("courseDetail.loadError") ||
              "Có lỗi xảy ra khi tải khóa học"
      );
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, currentSearch, courseLevel, t]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <CoursesHero
        badgeLabel={t("coursesPage.heroBadge")}
        titleStart={t("coursesPage.heroTitleStart")}
        titleAccent={t("coursesPage.heroTitleAccent")}
        description={t("coursesPage.heroDesc")}
        exploreLabel={t("coursesPage.exploreBtn")}
      />

      <section
        id="courses-list"
        className="mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6 lg:px-8"
      >
        <CoursesFilterBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          level={courseLevel}
          onLevelChange={handleLevelChange}
          totalElements={totalElements}
          filterLabel={t("coursesPage.filterLabel")}
          searchPlaceholder={t("coursesPage.searchPlaceholder")}
          totalLabel={t("coursesPage.countLabel")}
          labels={{
            all: t("coursesPage.filterAll"),
            beginner: t("coursesPage.filterBeginner"),
            intermediate: t("coursesPage.filterIntermediate"),
            advanced: t("coursesPage.filterAdvanced"),
            expert: t("coursesPage.filterExpert") || "Expert",
          }}
        />

        {isLoading ? (
          <CoursesLoadingState />
        ) : error ? (
          <CoursesErrorState
            title={t("coursesPage.errorTitle")}
            description={error}
            retryLabel={t("coursesPage.retryBtn")}
            onRetry={fetchCourses}
          />
        ) : courses.length === 0 ? (
          <CoursesEmptyState
            title={t("coursesPage.noCoursesTitle")}
            description={t("coursesPage.noCoursesDesc")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        )}

        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            itemName={t("coursesPage.countLabel")}
          />
        )}
      </section>
    </main>
  );
}
