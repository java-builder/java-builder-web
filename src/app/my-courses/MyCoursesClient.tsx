"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { enrollmentApi } from "@/services/enrollment.service";
import { MyEnrolledCourseResponse, CourseLevel, CourseFormat } from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { formatShortDate } from "@/utils/dateUtils";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

export default function MyCoursesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const [courses, setCourses] = useState<MyEnrolledCourseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !userLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, userLoading, router, mounted]);

  useEffect(() => {
    if (currentUser) {
      const fetchMyCourses = async () => {
        setIsLoading(true);
        try {
          const response = await enrollmentApi.getMyCourses(currentPage, pageSize);
          if (response.data) {
            setCourses(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
          toast.error(t("myCoursesPage.loadError"));
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyCourses();
    }
  }, [currentPage, currentUser, t]);

  const getLevelText = (level?: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER: return t("courseDetail.beginner");
      case CourseLevel.INTERMEDIATE: return t("courseDetail.intermediate");
      case CourseLevel.ADVANCED: return t("courseDetail.advanced");
      default: return t("common.all");
    }
  };

  const getLevelColor = (level?: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER: return "bg-green-100 text-green-700";
      case CourseLevel.INTERMEDIATE: return "bg-yellow-100 text-yellow-700";
      case CourseLevel.ADVANCED: return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-accent";
    return "bg-amber-500";
  };

  if (!mounted || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t("myCoursesPage.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("myCoursesPage.subtitle")}
              </p>
            </div>
            
            {/* Stats */}
            {!isLoading && courses.length > 0 && (
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{courses.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("myCoursesPage.statsCourses")}</div>
                </div>
                <div className="w-px bg-gray-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {courses.filter(c => c.completed).length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("myCoursesPage.statsCompleted")}</div>
                </div>
                <div className="w-px bg-gray-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {courses.filter(c => !c.completed && c.progress > 0).length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("myCoursesPage.statsLearning")}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t("myCoursesPage.emptyTitle")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {t("myCoursesPage.emptyDesc")}
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-8 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t("myCoursesPage.exploreCourses")}
            </Link>
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={course.courseFormat === CourseFormat.TEXT ? `/docs/${course.slug}` : `/learn/${course.slug}/${course.id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-accent/30 dark:hover:border-accent/50 transition-all duration-300"
                >
                  {/* Course Image */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className={`${
                          course.courseFormat === CourseFormat.TEXT
                            ? "object-contain"
                            : "object-cover group-hover:scale-105"
                        } transition-transform duration-300`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {course.completed ? (
                        <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1.5 shadow-lg">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {t("myCoursesPage.statusCompleted")}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-full shadow-lg">
                          {t("myCoursesPage.statusLearning")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {course.level && (
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${getLevelColor(course.level)}`}>
                          {getLevelText(course.level)}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {t("myCoursesPage.enrolledAt").replace("{date}", formatShortDate(course.enrolledAt))}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                    
                    {/* Progress Section - Only show for VIDEO/MIXED courses */}
                    {course.courseFormat !== CourseFormat.TEXT && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-gray-600 dark:text-gray-400">{t("myCoursesPage.progress")}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(course.progress)} transition-all duration-500`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs text-gray-400">
                            {t("myCoursesPage.lessonsCount")
                              .replace("{completed}", String(course.completedLessons))
                              .replace("{total}", String(course.totalLessons))}
                          </span>
                          {course.duration && (
                            <span className="text-xs text-gray-400">
                              {t("myCoursesPage.duration").replace("{hours}", String(course.duration))}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <button className="w-full py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      {course.progress === 0 
                        ? t("myCoursesPage.btnStart") 
                        : course.completed 
                          ? t("myCoursesPage.btnReview") 
                          : t("myCoursesPage.btnContinue")}
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("common.prev")}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-accent text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("common.next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
