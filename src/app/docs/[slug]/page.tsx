"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DocsHeader from "@/components/docs/DocsHeader";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsArticle from "@/components/docs/DocsArticle";
import DocsTableOfContents from "@/components/docs/DocsTableOfContents";
import { courseApi } from "@/services/course.service";
import { CourseDetailResponse } from "@/types/course";
import { formatDate } from "@/utils/formatters";

export default function DocsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await courseApi.getBySlug(slug);
        if (response.code === 200 && response.data) {
          setCourse(response.data);
          setShowOverview(true);
          const firstLesson = response.data.chapters?.[0]?.lessons?.[0];
          if (firstLesson && response.data.chapters?.[0]) {
            setOpenCategories([response.data.chapters[0].id]);
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
  }, [slug]);

  const handleLessonClick = (lessonId: string) => {
    setSelectedChapter(lessonId);
    setShowOverview(false);
  };

  const handleOverviewClick = () => {
    setShowOverview(true);
    setSelectedChapter(null);
  };

  const generateOverviewContent = (course: CourseDetailResponse | null) => {
    if (!course) return "";

    const levelText: Record<string, string> = {
      BEGINNER: "Cơ bản",
      INTERMEDIATE: "Trung cấp",
      ADVANCED: "Nâng cao",
      EXPERT: "Chuyên gia"
    };

    const levelDisplay = course.level ? (levelText[course.level] || course.level) : "Chưa xác định";
    const totalLessons = course.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0;

    return `
## Giới thiệu

${course.description}

## Thông tin khóa học

- **Cấp độ:** ${levelDisplay}
- **Số chương:** ${course.chapters?.length || 0} chương
- **Tổng số bài học:** ${totalLessons} bài học
- **Cập nhật:** ${formatDate(course.updatedAt || course.createdAt)}

## Nội dung khóa học

${course.chapters?.map((chapter, index) => `
### Chương ${index + 1}: ${chapter.chapterName}

${chapter.description}

*${chapter.lessons?.length || 0} bài học*
`).join('\n') || ''}
    `.trim();
  };

  const handleCategoryToggle = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
      topics: chapter.lessons?.map(lesson => ({
        id: lesson.id,
        title: lesson.lessonName,
        slug: lesson.id,
      })) || []
    })) || [])
  ];

  const currentLesson = course?.chapters
    ?.flatMap(c => c.lessons || [])
    .find(l => l.id === selectedChapter);

  const currentChapter = course?.chapters?.find(c => 
    c.lessons?.some(l => l.id === selectedChapter)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải tài liệu...</p>
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
        />

        <main className="flex-1 min-w-0">
          {showOverview ? (
            <DocsArticle
              title={course?.title || ""}
              description={course?.description || ""}
              readTime={`${course?.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0} bài học`}
              lastUpdated={formatDate(course?.updatedAt || course?.createdAt || "")}
              content={generateOverviewContent(course)}
              breadcrumbs={[
                { label: "Tài liệu", href: "/docs" },
                { label: course?.title || "" }
              ]}
            />
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

        <DocsTableOfContents items={[]} />
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
