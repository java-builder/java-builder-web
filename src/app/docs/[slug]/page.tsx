"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DocsHeader from "@/components/docs/DocsHeader";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsArticle from "@/components/docs/DocsArticle";
import DocsTableOfContents from "@/components/docs/DocsTableOfContents";
import CourseOverview from "@/components/docs/CourseOverview";
import { courseApi, lessonApi } from "@/services/course.service";
import { CourseDetailResponse, LessonDetailResponse } from "@/types/course";
import { formatDate } from "@/utils/formatters";
import { extractHeadings } from "@/utils/markdown";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DocsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const currentLessonIdRef = useRef<string | null>(null);

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const lessonIdFromUrl = searchParams.get('lessonId');
  const [showOverview, setShowOverview] = useState(!lessonIdFromUrl);
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [loadedChapters, setLoadedChapters] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailResponse | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(!!lessonIdFromUrl);
  const lessonCacheRef = useRef<Record<string, LessonDetailResponse>>({});

  useEffect(() => {
    if (isLoadingUser) {
      return;
    }

    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setIsLoading(true);

        const response = await courseApi.getBySlug(slug);
        if (response.code === 200 && response.data) {
          const courseData = response.data;
          setCourse(courseData);



          if (courseData.chapters && courseData.chapters.length > 0) {
            const fetchAllLessonNames = async () => {
              const lessonsMap: Record<string, LessonDetailResponse[]> = {};
              const loadedIds = new Set<string>();
              await Promise.all(
                courseData.chapters!.map(async (chapter) => {
                  try {
                    const lessonsResponse = await lessonApi.getByChapterId(chapter.id);
                    if (lessonsResponse.data) {
                      lessonsMap[chapter.id] = lessonsResponse.data.map(lesson => ({
                        ...lesson,
                        content: undefined,
                      }));
                    } else {
                      lessonsMap[chapter.id] = [];
                    }
                    loadedIds.add(chapter.id);
                  } catch (error) {
                    console.error(`Error fetching lessons for chapter ${chapter.id}:`, error);
                    lessonsMap[chapter.id] = [];
                    loadedIds.add(chapter.id);
                  }
                })
              );
              setChapterLessons(lessonsMap);
              setLoadedChapters(loadedIds);
            };
            fetchAllLessonNames();
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug, currentUser, isLoadingUser]);

  const loadLessonContent = useCallback(async (lessonId: string) => {
    if (lessonCacheRef.current[lessonId]) {
      setSelectedLesson(lessonCacheRef.current[lessonId]);
      return lessonCacheRef.current[lessonId];
    }

    const response = await lessonApi.getById(lessonId);
    if (response.data) {
      const lesson = response.data;
      if (lesson.content) {
        if (course?.description) {
          lesson.content = lesson.content.replace(course.description, '').trim();
        }
        lesson.content = lesson.content.replace(/\n*\*Tiếp theo:[\s\S]*?\*\s*$/, '').trim();
      }
      lessonCacheRef.current[lessonId] = lesson;
      setSelectedLesson(lesson);
      return lesson;
    }
    return null;
  }, [course?.description]);

  useEffect(() => {
    if (!course || !chapterLessons || Object.keys(chapterLessons).length === 0) return;
    if (currentLessonIdRef.current) return;

    const lessonId = searchParams.get('lessonId');
    if (!lessonId) return;

    const loadInitialLesson = async () => {
      for (const [chapterId, lessons] of Object.entries(chapterLessons)) {
        const targetLesson = lessons.find(l => l.id === lessonId);
        if (targetLesson) {
          setOpenCategories(prev => {
            if (!prev.includes(chapterId)) {
              return [...prev, chapterId];
            }
            return prev;
          });
          try {
            currentLessonIdRef.current = lessonId;
            setSelectedChapter(lessonId);
            await loadLessonContent(lessonId);
          } catch (error) {
            console.error("Error fetching lesson:", error);
            currentLessonIdRef.current = null;
          } finally {
            setIsLoadingLesson(false);
          }
          break;
        }
      }
    };

    loadInitialLesson();
  }, [course, chapterLessons, searchParams, loadLessonContent]);

  const handleLessonClick = useCallback(async (lessonId: string) => {
    if (currentLessonIdRef.current === lessonId || isLoadingLesson) {
      return;
    }

    try {
      currentLessonIdRef.current = lessonId;

      setSelectedChapter(lessonId);
      setShowOverview(false);
      setIsLoadingLesson(true);

      // Find the chapter containing the lesson and expand it in the sidebar
      let parentChapterId: string | null = null;
      for (const [chapterId, lessons] of Object.entries(chapterLessons)) {
        if (lessons.some(l => l.id === lessonId)) {
          parentChapterId = chapterId;
          break;
        }
      }

      if (parentChapterId) {
        setOpenCategories(prev => {
          if (!prev.includes(parentChapterId!)) {
            return [...prev, parentChapterId!];
          }
          return prev;
        });
      }

      const url = new URL(window.location.href);
      url.searchParams.set('lessonId', lessonId);
      window.history.replaceState({}, '', url.pathname + url.search);

      await loadLessonContent(lessonId);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      currentLessonIdRef.current = null;
    } finally {
      setIsLoadingLesson(false);
    }
  }, [isLoadingLesson, loadLessonContent, chapterLessons]);

  const handleOverviewClick = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('lessonId');
    window.history.replaceState({}, '', url.pathname + url.search);

    setShowOverview(true);
    setSelectedChapter(null);
    setSelectedLesson(null);
    setIsLoadingLesson(false);
    currentLessonIdRef.current = null;
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newOpenCategories = openCategories.includes(categoryId)
      ? openCategories.filter(id => id !== categoryId)
      : [...openCategories, categoryId];

    setOpenCategories(newOpenCategories);
  };

  const categories = useMemo(() => [
    {
      id: "overview",
      title: "📋 Tổng quan",
      topics: []
    },
    ...(course?.chapters?.map(chapter => ({
      id: chapter.id,
      title: chapter.chapterName,
      topics: chapterLessons[chapter.id]?.map(lesson => ({
        id: lesson.id,
        title: lesson.lessonName,
        slug: lesson.id,
        completed: lesson.completed,
      })) || []
    })) || [])
  ], [course?.chapters, chapterLessons]);

  const currentLesson = selectedLesson;

  const currentChapter = useMemo(() =>
    course?.chapters?.find(c =>
      chapterLessons[c.id]?.some(l => l.id === selectedChapter)
    ), [course?.chapters, chapterLessons, selectedChapter]
  );

  const tocItems = useMemo(() =>
    showOverview ? [] : extractHeadings(currentLesson?.content || ""),
    [showOverview, currentLesson?.content]
  );

  const isCurrentLessonCompleted = useMemo(() => {
    const lessonId = selectedChapter;
    if (!lessonId) return false;
    for (const lessons of Object.values(chapterLessons)) {
      const found = lessons.find(l => l.id === lessonId);
      if (found) return !!found.completed;
    }
    return false;
  }, [selectedChapter, chapterLessons]);

  const handleToggleComplete = useCallback(async () => {
    const lessonId = selectedChapter;
    if (!lessonId) return;

    let isCompleted = false;
    let targetChapterId = "";
    for (const [chapterId, lessons] of Object.entries(chapterLessons)) {
      const found = lessons.find(l => l.id === lessonId);
      if (found) {
        isCompleted = !!found.completed;
        targetChapterId = chapterId;
        break;
      }
    }

    const nextCompletedState = !isCompleted;

    try {
      await lessonApi.updateProgress({
        lessonId,
        completed: nextCompletedState
      });

      setChapterLessons(prev => {
        const updated = { ...prev };
        if (updated[targetChapterId]) {
          updated[targetChapterId] = updated[targetChapterId].map(l =>
            l.id === lessonId ? { ...l, completed: nextCompletedState } : l
          );
        }
        return updated;
      });

      const { default: toast } = await import("react-hot-toast");
      toast.success(nextCompletedState ? "Đã hoàn thành bài học" : "Đã bỏ hoàn thành bài học");
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      const { default: toast } = await import("react-hot-toast");
      toast.error("Không thể cập nhật tiến độ bài học");
    }
  }, [selectedChapter, chapterLessons]);

  if (isLoadingUser || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <DocsHeader
          showMenuButton={false}
          onMenuClick={() => { }}
        />
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Yêu cầu đăng nhập</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn cần đăng nhập để xem nội dung này
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors text-sm"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <DocsHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy khóa học</h3>
            <p className="text-gray-600 dark:text-gray-400">Khóa học này không tồn tại hoặc đã bị xóa</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DocsHeader
        showMenuButton={true}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        course={course}
      />

      <div className="flex w-full px-4 sm:px-6 lg:px-8">
        <DocsSidebar
          categories={categories}
          openCategories={openCategories}
          onCategoryToggle={handleCategoryToggle}
          onOverviewClick={handleOverviewClick}
          onLessonClick={handleLessonClick}
          onBackClick={() => window.history.back()}
          isOpen={isSidebarOpen}
          loadedChapters={loadedChapters}
          selectedLessonId={selectedChapter}
        />

        <main className="flex-1 min-w-0 transition-opacity duration-200">
          {showOverview ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <nav className="flex flex-wrap items-center text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                <svg className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <Link href="/docs" className="hover:text-accent dark:hover:text-accent-400 transition-colors duration-150">Tài liệu</Link>
                <svg className="w-3 h-3 text-slate-300 dark:text-slate-600 mx-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-800 dark:text-slate-200 font-semibold truncate" title={course?.title || ""}>{course?.title || ""}</span>
              </nav>

              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {course?.title || ""}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {course?.description || ""}
                </p>
              </header>

              {course && (
                <CourseOverview
                  course={course}
                  chapterLessons={chapterLessons}
                  onLessonClick={handleLessonClick}
                  selectedLessonId={selectedChapter}
                />
              )}
            </div>
          ) : isLoadingLesson ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-40"></div>
              </div>

              <div className="mb-6">
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5"></div>
              </div>
            </div>
          ) : (
            <div key={currentLesson?.id || 'overview'} className="animate-in fade-in duration-300">
              <DocsArticle
                title={currentLesson?.lessonName || course?.title || ""}
                description={currentLesson?.description || ""}
                readTime="15 phút"
                lastUpdated={formatDate(course?.updatedAt || course?.createdAt || "")}
                content={currentLesson?.content || ""}
                lessonId={currentLesson?.id}
                canAccess={currentLesson?.canAccess}
                isFreePreview={currentLesson?.isFreePreview}
                courseSlug={course?.slug}
                completed={isCurrentLessonCompleted}
                onToggleComplete={handleToggleComplete}
                breadcrumbs={[
                  { label: "Tài liệu", href: "/docs" },
                  ...(currentChapter ? [{ label: currentChapter.chapterName }] : []),
                  ...(currentLesson ? [{ label: currentLesson.lessonName }] : [])
                ]}
              />
            </div>
          )}
        </main>

        <DocsTableOfContents items={tocItems} />
      </div>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
