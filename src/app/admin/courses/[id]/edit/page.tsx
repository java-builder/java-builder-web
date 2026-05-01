"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { CourseDetailResponse, CourseLevel, CourseFormat, CourseStatus, ChapterDetailResponse, LessonDetailResponse } from "@/types/course";
import { LessonFormat } from "@/types/lesson";
import ConfirmModal from "@/components/ui/ConfirmModal";
import VideoPlayer from "@/components/VideoPlayer";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { ChapterModal, LessonModal, CourseEditHeader, CourseInfoTab, CourseContentTab } from "@/components/admin/courses/edit";
import toast from "react-hot-toast";
import { courseApi } from "@/services/course.service";
import { courseEditHelpers } from "@/hooks/useCourses";
import { validateLessonForm, handleImageFileChange, handleVideoFileChange } from "@/utils/validations";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const hasFetched = useRef(false);

  // Course info state
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [level, setLevel] = useState<CourseLevel>(CourseLevel.BEGINNER);
  const [courseFormat, setCourseFormat] = useState<CourseFormat>(CourseFormat.VIDEO);
  const [courseStatus, setCourseStatus] = useState<CourseStatus>(CourseStatus.ACTIVE);
  const [imageKey, setImageKey] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Active tab
  const [activeTab, setActiveTab] = useState<"info" | "content">("info");

  // Fetch course data
  const fetchCourse = useCallback(async (force = false) => {
    if (!courseId) return;
    if (!force && hasFetched.current) return;

    try {
      setIsLoading(true);
      hasFetched.current = true;
      const response = await courseApi.getById(courseId);
      if (response.data) {
        const data = response.data;
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setDuration(data.duration || 0);
        setLevel(data.level || CourseLevel.BEGINNER);
        setCourseFormat(data.courseFormat || CourseFormat.VIDEO);
        setCourseStatus(data.courseStatus || CourseStatus.ACTIVE);
        setImageKey("");
        setImagePreview(data.thumbnailUrl || null);
        setChapters(data.chapters || []);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Không thể tải thông tin khóa học");
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageFileChange(e, {
      onSuccess: (file, preview) => {
        setImagePreview(preview || null);
        setPendingImageFile(file);
      },
      onError: (error) => toast.error(error),
    });
  };

  // Save course info
  const handleSaveCourse = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên khóa học");
      return;
    }
    setIsSaving(true);
    try {
      const response = await courseEditHelpers.updateCourse(
        courseId,
        {
          title: title.trim(),
          description: description.trim(),
          price,
          duration,
          level,
          courseFormat,
          courseStatus,
          key: imageKey,
        },
        pendingImageFile
      );

      if (response.code === 200) {
        toast.success("Cập nhật khóa học thành công!");
        setPendingImageFile(null);
        if (response.data) {
          setCourse(response.data);
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle chapter expand
  const toggleChapter = async (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
      if (!chapterLessons[chapterId]) {
        try {
          await fetchLessons(chapterId);
        } catch (error) {
          console.error("Error toggling chapter:", error);
          toast.error("Không thể tải nội dung chương");
        }
      }
    }
    setExpandedChapters(newExpanded);
  };

  // Fetch lessons for a chapter
  const fetchLessons = async (chapterId: string) => {
    setLoadingLessons(prev => new Set(prev).add(chapterId));
    try {
      const lessons = await courseEditHelpers.fetchLessonsByChapter(chapterId);
      setChapterLessons(prev => ({ ...prev, [chapterId]: lessons }));
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Không thể tải danh sách bài học");
    } finally {
      setLoadingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  };

  // Create/Update chapter via API
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

  // Delete chapter or lesson
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
          await fetchLessons(deleteModal.chapterId);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Xóa thất bại");
    } finally {
      setDeleteModal({ isOpen: false, type: "chapter", id: "", title: "", chapterId: "" });
    }
  };

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
          (percent) => {
            setLessonModal(prev => ({ ...prev, uploadProgress: percent }));
          }
        );

        if (response.code === 200 && response.data) {
          toast.success("Cập nhật bài học thành công!");
          await fetchLessons(lessonModal.chapterId);
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
          (percent) => {
            setLessonModal(prev => ({ ...prev, uploadProgress: percent }));
          }
        );

        if (response.code === 201 && response.data) {
          toast.success("Thêm bài học thành công!");
          await fetchLessons(lessonModal.chapterId);
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

  // Handle preview lesson - gọi API để lấy videoUrl
  const handlePreviewLesson = async (lesson: LessonDetailResponse) => {
    try {
      const lessonDetail = await courseEditHelpers.getLessonDetail(lesson.id);
      if (lessonDetail) {
        setPreviewModal({ isOpen: true, lesson: lessonDetail });
      }
    } catch {
      toast.error("Không thể tải thông tin bài học");
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleVideoFileChange(e, {
      onSuccess: (file) => {
        setLessonModal(prev => ({
          ...prev,
          videoFile: file,
          videoFileName: file.name,
          videoUrl: ""
        }));
      },
      onError: (error) => toast.error(error),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <CourseEditHeader
        courseTitle={course?.title}
        isSaving={isSaving}
        onSave={handleSaveCourse}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "info" ? "border-accent text-accent" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Thông tin cơ bản
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "content" ? "border-accent text-accent" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Nội dung khóa học
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "info" ? (
            <CourseInfoTab
              title={title}
              description={description}
              price={price}
              duration={duration}
              level={level}
              courseFormat={courseFormat}
              courseStatus={courseStatus}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onPriceChange={setPrice}
              onDurationChange={setDuration}
              onLevelChange={setLevel}
              onCourseFormatChange={setCourseFormat}
              onCourseStatusChange={setCourseStatus}
              onImageChange={handleImageChange}
            />
          ) : (
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
          )}
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
        onLessonNameChange={(value) => setLessonModal({ ...lessonModal, lessonName: value })}
        onDescriptionChange={(value) => setLessonModal({ ...lessonModal, description: value })}
        onContentChange={(value) => setLessonModal({ ...lessonModal, content: value })}
        onFormatChange={(format) => setLessonModal({ ...lessonModal, lessonFormat: format })}
        onFreePreviewChange={(checked) => setLessonModal({ ...lessonModal, isFreePreview: checked })}
        onVideoChange={handleVideoChange}
        onVideoRemove={() => setLessonModal({ ...lessonModal, videoFile: null, videoFileName: "", videoKey: "" })}
      />

      {/* Preview Lesson Modal */}
      {previewModal.isOpen && previewModal.lesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPreviewModal({ isOpen: false, lesson: null })} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewModal.lesson.lessonName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {previewModal.lesson.isFreePreview && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      Miễn phí
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {previewModal.lesson.lessonFormat === LessonFormat.TEXT ? "Văn bản" : 
                     previewModal.lesson.lessonFormat === LessonFormat.VIDEO ? "Video" : "Hỗn hợp"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewModal({ isOpen: false, lesson: null })}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            {previewModal.lesson.lessonFormat === LessonFormat.TEXT ? (
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {previewModal.lesson.content ? (
                  <PublicMarkdownRenderer 
                    content={previewModal.lesson.content} 
                    className="prose prose-lg max-w-none" 
                  />
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600">Chưa có nội dung cho bài học này</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Video Player */}
                <div className="bg-black flex-shrink-0">
                  {previewModal.lesson.videoUrl ? (
                    <VideoPlayer
                      src={previewModal.lesson.videoUrl}
                      autoPlay
                      className="w-full"
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center bg-gray-900">
                      <div className="text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p>Chưa có video cho bài học này</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {previewModal.lesson.description && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Mô tả bài học</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{previewModal.lesson.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
