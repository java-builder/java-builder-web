"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const slug = params.slug as string;
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(true);
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [loadedChapters, setLoadedChapters] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailResponse | null>(null);

  useEffect(() => {
    // Chỉ fetch khi user đã authenticated
    if (isLoadingUser) {
      // Đang check auth, giữ loading state
      return;
    }

    if (!currentUser) {
      // Chưa login, không fetch
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
          setShowOverview(true);
          const firstLesson = courseData.chapters?.[0]?.lessons?.[0];
          if (firstLesson && courseData.chapters?.[0]) {
            setOpenCategories([courseData.chapters[0].id]);
          }

          if (courseData.chapters && courseData.chapters.length > 0) {
            const fetchAllLessons = async () => {
              const lessonsMap: Record<string, LessonDetailResponse[]> = {};
              const loadedIds = new Set<string>();
              await Promise.all(
                courseData.chapters!.map(async (chapter) => {
                  try {
                    const lessonsResponse = await lessonApi.getByChapterId(chapter.id);
                    if (lessonsResponse.data) {
                      lessonsMap[chapter.id] = lessonsResponse.data;
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
            fetchAllLessons();
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

  const handleLessonClick = async (lessonId: string) => {
    try {
      const response = await lessonApi.getById(lessonId);
      if (response.data) {
        const lesson = response.data;
        if (lesson.content) {
          lesson.content = lesson.content.replace(/\n*\*Tiếp theo:[\s\S]*?\*\s*$/, '').trim();
        }
        setSelectedLesson(lesson);
        setSelectedChapter(lessonId);
        setShowOverview(false);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  };

  const handleOverviewClick = () => {
    setShowOverview(true);
    setSelectedChapter(null);
    setSelectedLesson(null);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newOpenCategories = openCategories.includes(categoryId)
      ? openCategories.filter(id => id !== categoryId)
      : [...openCategories, categoryId];
    
    setOpenCategories(newOpenCategories);
  };

  const categories = [
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
      })) || []
    })) || [])
  ];

  const currentLesson = selectedLesson;

  const currentChapter = course?.chapters?.find(c => 
    c.lessons?.some(l => l.id === selectedChapter)
  );

  // Loading state: đang check auth hoặc đang load course
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

  // Chưa đăng nhập
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <DocsHeader 
          showMenuButton={false}
          onMenuClick={() => {}}
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
      />

      <div className="flex max-w-[1600px] mx-auto">
        <DocsSidebar
          categories={categories}
          openCategories={openCategories}
          onCategoryToggle={handleCategoryToggle}
          onOverviewClick={handleOverviewClick}
          onLessonClick={handleLessonClick}
          onBackClick={() => window.history.back()}
          isOpen={isSidebarOpen}
          loadedChapters={loadedChapters}
          selectedLessonId={selectedLesson?.id || null}
        />

        <main className="flex-1 min-w-0">
          {showOverview ? (
            <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
              <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <Link href="/docs" className="hover:text-accent">Tài liệu</Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white">{course?.title || ""}</span>
              </nav>

              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {course?.title || ""}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {course?.description || ""}
                </p>
              </header>

              {course && <CourseOverview course={course} />}
            </div>
          ) : (
            <DocsArticle
              title={currentLesson?.lessonName || course?.title || ""}
              description={currentLesson?.description || course?.description || ""}
              readTime="15 phút"
              lastUpdated={formatDate(course?.updatedAt || course?.createdAt || "")}
              content={currentLesson?.content || course?.description || ""}
              breadcrumbs={[
                { label: "Tài liệu", href: "/docs" },
                { label: course?.title || "", href: `/docs/${course?.slug}` },
                ...(currentChapter ? [{ label: currentChapter.chapterName }] : []),
                ...(currentLesson ? [{ label: currentLesson.lessonName }] : [])
              ]}
            />
          )}
        </main>

        <DocsTableOfContents items={showOverview ? [] : extractHeadings(currentLesson?.content || "")} />
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
