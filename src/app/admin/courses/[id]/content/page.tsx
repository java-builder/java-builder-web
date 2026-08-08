"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { CourseDetailResponse, ChapterDetailResponse, LessonDetailResponse } from "@/types/course";
import { LessonFormat } from "@/types/lesson";
import ConfirmModal from "@/components/ui/ConfirmModal";
import VideoPlayer from "@/components/common/VideoPlayer";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { ChapterModal, LessonModal, CourseEditHeader, CourseContentTab } from "@/components/admin/courses/edit";
import toast from "react-hot-toast";
import { courseApi } from "@/services/course.service";
import { courseEditHelpers } from "@/hooks/useCourses";
import { validateLessonForm } from "@/utils/validations";

export default function CourseContentPage() {
  const params = useParams();
  const courseId = params.id as string;
  const hasFetched = useRef(false);

  // Course state
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chapters state (from API)
  const [chapters, setChapters] = useState<ChapterDetailResponse[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [loadingLessons, setLoadingLessons] = useState<Set<string>>(new Set());

  // Modal states
  const [chapterModal, setChapterModal] = useState({
    isOpen: false,
    editId: "",
    chapterName: "",
    description: "",
    isSubmitting: false
  });
  const [lessonModal, setLessonModal] = useState({
    isOpen: false,
    editId: "",
    chapterId: "",
    lessonName: "",
    description: "",
    content: "",
    lessonFormat: LessonFormat.VIDEO,
    videoUrl: "",
    videoKey: "",
    videoFile: null as File | null,
    videoFileName: "",
    uploadProgress: 0,
    isUploading: false,
    isFreePreview: false,
    isSubmitting: false
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "" as "chapter" | "lesson",
    id: "",
    title: "",
    chapterId: "",
  });

  // Preview lesson modal
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    lesson: LessonDetailResponse | null;
  }>({
    isOpen: false,
    lesson: null,
  });

  // Fetch course data
  const fetchCourse = useCallback(async (force = false) => {
    if (!courseId) return;
    if (!force && hasFetched.current) return;

    try {
      setIsLoading(true);
      const res = await courseApi.getById(courseId);
      if (res.data) {
        setCourse(res.data);
        if (res.data.chapters) {
          setChapters(res.data.chapters);
        }
      }
    } catch {
      toast.error("Không thể tải thông tin khóa học");
    } finally {
      setIsLoading(false);
      hasFetched.current = true;
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Load lessons for a chapter
  const loadLessonsForChapter = useCallback(async (chapterId: string) => {
    setLoadingLessons(prev => new Set(prev).add(chapterId));
    try {
      const lessons = await courseEditHelpers.fetchLessonsByChapter(chapterId);
      setChapterLessons(prev => ({ ...prev, [chapterId]: lessons }));
    } catch {
      toast.error("Không thể tải danh sách bài học");
    } finally {
      setLoadingLessons(prev => {
        const next = new Set(prev);
        next.delete(chapterId);
        return next;
      });
    }
  }, []);

  // Fetch lessons for expanded chapters
  useEffect(() => {
    expandedChapters.forEach((chapterId) => {
      if (!chapterLessons[chapterId] && !loadingLessons.has(chapterId)) {
        loadLessonsForChapter(chapterId);
      }
    });
  }, [expandedChapters, chapterLessons, loadingLessons, loadLessonsForChapter]);

  // Toggle chapter expand/collapse
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Preview lesson click
  const handlePreviewLesson = async (lesson: LessonDetailResponse) => {
    try {
      const lessonDetail = await courseEditHelpers.getLessonDetail(lesson.id);
      if (lessonDetail) {
        setPreviewModal({ isOpen: true, lesson: lessonDetail });
      } else {
        toast.error("Không thể tải nội dung bài học");
      }
    } catch {
      toast.error("Không thể tải nội dung bài học");
    }
  };

  // Save Chapter
  const handleSaveChapter = async () => {
    if (!chapterModal.chapterName.trim()) {
      toast.error("Vui lòng nhập tên chương");
      return;
    }

    setChapterModal(prev => ({ ...prev, isSubmitting: true }));

    try {
      if (chapterModal.editId) {
        const response = await courseEditHelpers.updateChapter({
          id: chapterModal.editId,
          chapterName: chapterModal.chapterName,
          description: chapterModal.description || undefined,
        });

        if (response.code === 200 && response.data) {
          toast.success("Cập nhật chương thành công!");
          await fetchCourse(true);
        }
      } else {
        const response = await courseEditHelpers.createChapter({
          courseId: courseId,
          chapterName: chapterModal.chapterName,
          description: chapterModal.description || undefined,
        });

        if (response.code === 201 && response.data) {
          toast.success("Thêm chương thành công!");
          await fetchCourse(true);
        }
      }
      setChapterModal({ isOpen: false, editId: "", chapterName: "", description: "", isSubmitting: false });
    } catch (error) {
      console.error("Save chapter error:", error);
      toast.error(error instanceof Error ? error.message : "Lưu chương thất bại");
    } finally {
      setChapterModal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle video selection change
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLessonModal(prev => ({
        ...prev,
        videoFile: file,
        videoFileName: file.name,
      }));
    }
  };

  // Save Lesson
  const handleSaveLesson = async () => {
    const validation = validateLessonForm({
      lessonName: lessonModal.lessonName,
      content: lessonModal.content,
      lessonFormat: lessonModal.lessonFormat,
      videoFile: lessonModal.videoFile,
      isEdit: !!lessonModal.editId,
      hasExistingVideo: !!lessonModal.videoFileName && !lessonModal.videoFile,
    });

    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setLessonModal(prev => ({ ...prev, isSubmitting: true, isUploading: !!lessonModal.videoFile }));

    try {
      if (lessonModal.editId) {
        const response = await courseEditHelpers.updateLesson(
          lessonModal.editId,
          {
            lessonName: lessonModal.lessonName,
            description: lessonModal.description || undefined,
            content: lessonModal.content || undefined,
            lessonFormat: lessonModal.lessonFormat,
            isFreePreview: lessonModal.isFreePreview,
          },
          lessonModal.videoFile,
          (percent: number) => {
            setLessonModal(prev => ({ ...prev, uploadProgress: percent }));
          }
        );

        if (response.code === 200 && response.data) {
          toast.success("Cập nhật bài học thành công!");
          await loadLessonsForChapter(lessonModal.chapterId);
        }
      } else {
        const response = await courseEditHelpers.createLesson(
          {
            chapterId: lessonModal.chapterId,
            lessonName: lessonModal.lessonName,
            description: lessonModal.description || undefined,
            content: lessonModal.content || undefined,
            lessonFormat: lessonModal.lessonFormat,
            isFreePreview: lessonModal.isFreePreview,
          },
          lessonModal.videoFile,
          (percent: number) => {
            setLessonModal(prev => ({ ...prev, uploadProgress: percent }));
          }
        );

        if (response.code === 201 && response.data) {
          toast.success("Thêm bài học thành công!");
          await loadLessonsForChapter(lessonModal.chapterId);
        }
      }
      setLessonModal({
        isOpen: false,
        editId: "",
        chapterId: "",
        lessonName: "",
        description: "",
        content: "",
        lessonFormat: LessonFormat.VIDEO,
        videoUrl: "",
        videoKey: "",
        videoFile: null,
        videoFileName: "",
        uploadProgress: 0,
        isUploading: false,
        isFreePreview: false,
        isSubmitting: false
      });
    } catch (error) {
      console.error("Save lesson error:", error);
      toast.error(error instanceof Error ? error.message : "Lưu bài học thất bại");
    } finally {
      setLessonModal(prev => ({ ...prev, isSubmitting: false, isUploading: false }));
    }
  };

  // Delete Chapter / Lesson
  const handleDelete = async () => {
    try {
      if (deleteModal.type === "chapter") {
        await courseEditHelpers.deleteChapter(deleteModal.id);
        toast.success("Xóa chương thành công!");
        await fetchCourse(true);
      } else if (deleteModal.type === "lesson") {
        await courseEditHelpers.deleteLesson(deleteModal.id);
        toast.success("Xóa bài học thành công!");
        if (deleteModal.chapterId) {
          await loadLessonsForChapter(deleteModal.chapterId);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Xóa thất bại");
    } finally {
      setDeleteModal({ isOpen: false, type: "chapter", id: "", title: "", chapterId: "" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-10 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <CourseEditHeader
        courseTitle={course?.title}
      />

      {/* Main Content Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Nội dung khóa học (Chương & Bài học)</h2>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <CourseContentTab
            chapters={chapters}
            expandedChapters={expandedChapters}
            chapterLessons={chapterLessons}
            loadingLessons={loadingLessons}
            onToggleChapter={toggleChapter}
            onAddChapter={() => setChapterModal({ isOpen: true, editId: "", chapterName: "", description: "", isSubmitting: false })}
            onEditChapter={(chapter) => setChapterModal({
              isOpen: true,
              editId: chapter.id,
              chapterName: chapter.chapterName,
              description: chapter.description || "",
              isSubmitting: false
            })}
            onDeleteChapter={(chapterId, chapterName) => setDeleteModal({ isOpen: true, type: "chapter", id: chapterId, title: chapterName, chapterId: "" })}
            onAddLesson={(chapterId) => setLessonModal({
              isOpen: true,
              editId: "",
              chapterId,
              lessonName: "",
              description: "",
              content: "",
              lessonFormat: LessonFormat.VIDEO,
              videoUrl: "",
              videoKey: "",
              videoFile: null,
              videoFileName: "",
              uploadProgress: 0,
              isUploading: false,
              isFreePreview: false,
              isSubmitting: false
            })}
            onEditLesson={async (lesson, chapterId) => {
              try {
                const lessonDetail = await courseEditHelpers.getLessonDetail(lesson.id);
                if (!lessonDetail) {
                  toast.error("Không thể tải thông tin bài học");
                  return;
                }
                setLessonModal({
                  isOpen: true,
                  editId: lesson.id,
                  chapterId,
                  lessonName: lessonDetail.lessonName,
                  description: lessonDetail.description || "",
                  content: lessonDetail.content || "",
                  lessonFormat: lessonDetail.lessonFormat,
                  videoUrl: lessonDetail.videoUrl || "",
                  videoKey: lessonDetail.videoKey || "",
                  videoFile: null,
                  videoFileName: lessonDetail.videoKey ? "Video hiện tại" : "",
                  uploadProgress: 0,
                  isUploading: false,
                  isFreePreview: lessonDetail.isFreePreview,
                  isSubmitting: false
                });
              } catch {
                toast.error("Không thể tải thông tin bài học");
              }
            }}
            onPreviewLesson={handlePreviewLesson}
            onDeleteLesson={(lessonId, lessonName, chapterId) => setDeleteModal({ isOpen: true, type: "lesson", id: lessonId, title: lessonName, chapterId })}
          />
        </div>
      </div>

      {/* Chapter Modal */}
      <ChapterModal
        isOpen={chapterModal.isOpen}
        editId={chapterModal.editId}
        chapterName={chapterModal.chapterName}
        description={chapterModal.description}
        isSubmitting={chapterModal.isSubmitting}
        onClose={() => setChapterModal({ isOpen: false, editId: "", chapterName: "", description: "", isSubmitting: false })}
        onSave={handleSaveChapter}
        onChapterNameChange={(value) => setChapterModal({ ...chapterModal, chapterName: value })}
        onDescriptionChange={(value) => setChapterModal({ ...chapterModal, description: value })}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: "chapter", id: "", title: "", chapterId: "" })}
        onConfirm={handleDelete}
        title={deleteModal.type === "chapter" ? "Xóa chương" : "Xóa bài học"}
        message={`Bạn có chắc chắn muốn xóa ${deleteModal.type === "chapter" ? "chương" : "bài học"} <strong>${deleteModal.title}</strong>?`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      {/* Lesson Modal */}
      <LessonModal
        isOpen={lessonModal.isOpen}
        editId={lessonModal.editId}
        lessonName={lessonModal.lessonName}
        description={lessonModal.description}
        content={lessonModal.content}
        lessonFormat={lessonModal.lessonFormat}
        videoUrl={lessonModal.videoUrl}
        videoFileName={lessonModal.videoFileName}
        uploadProgress={lessonModal.uploadProgress}
        isUploading={lessonModal.isUploading}
        isFreePreview={lessonModal.isFreePreview}
        isSubmitting={lessonModal.isSubmitting}
        onClose={() => setLessonModal({ isOpen: false, editId: "", chapterId: "", lessonName: "", description: "", content: "", lessonFormat: LessonFormat.VIDEO, videoUrl: "", videoKey: "", videoFile: null, videoFileName: "", uploadProgress: 0, isUploading: false, isFreePreview: false, isSubmitting: false })}
        onSave={handleSaveLesson}
        onLessonNameChange={(value) => setLessonModal(prev => ({ ...prev, lessonName: value }))}
        onDescriptionChange={(value) => setLessonModal(prev => ({ ...prev, description: value }))}
        onContentChange={(value) => setLessonModal(prev => ({ ...prev, content: value }))}
        onFormatChange={(format) => setLessonModal(prev => ({ ...prev, lessonFormat: format }))}
        onFreePreviewChange={(checked) => setLessonModal(prev => ({ ...prev, isFreePreview: checked }))}
        onVideoChange={handleVideoChange}
        onVideoRemove={() => setLessonModal(prev => ({ ...prev, videoFile: null, videoFileName: "", videoKey: "" }))}
      />

      {/* Preview Modal */}
      {previewModal.isOpen && previewModal.lesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {previewModal.lesson.lessonName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {previewModal.lesson.lessonFormat === LessonFormat.VIDEO ? "Bài học dạng Video" : "Bài học dạng Tài liệu (Markdown)"}
                </p>
              </div>
              <button
                onClick={() => setPreviewModal({ isOpen: false, lesson: null })}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {previewModal.lesson.description && (
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  {previewModal.lesson.description}
                </div>
              )}
              {previewModal.lesson.lessonFormat === LessonFormat.VIDEO ? (
                previewModal.lesson.videoUrl ? (
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <VideoPlayer src={previewModal.lesson.videoUrl} className="w-full h-full" />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400">
                    Chưa có video
                  </div>
                )
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <PublicMarkdownRenderer content={previewModal.lesson.content || "Chưa có nội dung"} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
