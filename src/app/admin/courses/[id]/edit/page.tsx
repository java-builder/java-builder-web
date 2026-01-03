"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { courseApi, chapterApi, lessonApi, fileApi } from "@/services/course.service";
import { CourseDetailResponse, CourseLevel, ChapterDetailResponse, LessonDetailResponse } from "@/types/course";
import ConfirmModal from "@/components/ui/ConfirmModal";
import VideoPlayer from "@/components/VideoPlayer";
import toast from "react-hot-toast";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;

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
  const [courseCover, setCourseCover] = useState("");
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
    chapterId: "",
    lessonName: "",
    description: "",
    videoUrl: "",
    videoFile: null as File | null,
    videoFileName: "",
    uploadProgress: 0,
    isUploading: false,
    isFreePreview: false,
    isSubmitting: false
  });
  const videoInputRef = useRef<HTMLInputElement>(null);
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
  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await courseApi.getById(courseId);
      if (response.result) {
        const data = response.result;
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setDuration(data.duration || 0);
        setLevel(data.level || CourseLevel.BEGINNER);
        setCourseCover(data.courseCover || "");
        setImagePreview(data.courseCover || null);
        // Set chapters from API response
        setChapters(data.chapters || []);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Không thể tải thông tin khóa học");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);


  // Handle image upload - chỉ preview, chưa upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Chỉ preview, lưu file để upload khi save
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setPendingImageFile(file);
  };

  // Save course info
  const handleSaveCourse = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên khóa học");
      return;
    }
    setIsSaving(true);
    try {
      let finalCourseCover = courseCover;

      // Upload ảnh mới nếu có
      if (pendingImageFile) {
        const uploadResult = await fileApi.uploadSingleMedia(pendingImageFile);
        if (uploadResult.result) {
          finalCourseCover = uploadResult.result.url;
        }
      }

      const response = await courseApi.update({
        id: courseId,
        title: title.trim(),
        description: description.trim(),
        price,
        duration,
        level,
        courseCover: finalCourseCover || undefined,
      });
      if (response.code === 200) {
        toast.success("Cập nhật khóa học thành công!");
        setPendingImageFile(null);
        setCourseCover(finalCourseCover);
        if (response.result) {
          setCourse(response.result);
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
      // Load lessons if not loaded yet
      if (!chapterLessons[chapterId]) {
        await fetchLessons(chapterId);
      }
    }
    setExpandedChapters(newExpanded);
  };

  // Fetch lessons for a chapter
  const fetchLessons = async (chapterId: string) => {
    setLoadingLessons(prev => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.result) {
        setChapterLessons(prev => ({ ...prev, [chapterId]: response.result || [] }));
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoadingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  };

  // Create chapter via API
  const handleSaveChapter = async () => {
    if (!chapterModal.chapterName.trim()) {
      toast.error("Vui lòng nhập tên chương");
      return;
    }

    setChapterModal(prev => ({ ...prev, isSubmitting: true }));

    try {
      if (chapterModal.editId) {
        // Update chapter
        const response = await chapterApi.update({
          id: chapterModal.editId,
          chapterName: chapterModal.chapterName,
          description: chapterModal.description || undefined,
        });

        if (response.code === 200 && response.result) {
          toast.success("Cập nhật chương thành công!");
          await fetchCourse();
        }
      } else {
        // Create new chapter
        const response = await chapterApi.create({
          courseId: courseId,
          chapterName: chapterModal.chapterName,
          description: chapterModal.description || undefined,
        });

        if (response.code === 201 && response.result) {
          toast.success("Thêm chương thành công!");
          // Refresh course data to get updated chapters
          await fetchCourse();
        }
      }
      setChapterModal({ isOpen: false, editId: "", chapterName: "", description: "", isSubmitting: false });
    } catch (error) {
      console.error("Save chapter error:", error);
    } finally {
      setChapterModal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Delete chapter
  const handleDelete = async () => {
    try {
      if (deleteModal.type === "chapter") {
        await chapterApi.delete(deleteModal.id);
        toast.success("Xóa chương thành công!");
        await fetchCourse();
      } else if (deleteModal.type === "lesson") {
        await lessonApi.delete(deleteModal.id);
        toast.success("Xóa bài học thành công!");
        // Refresh lessons for this chapter
        if (deleteModal.chapterId) {
          await fetchLessons(deleteModal.chapterId);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteModal({ isOpen: false, type: "chapter", id: "", title: "", chapterId: "" });
    }
  };

  // Create lesson via API
  const handleSaveLesson = async () => {
    if (!lessonModal.lessonName.trim()) {
      toast.error("Vui lòng nhập tên bài học");
      return;
    }

    setLessonModal(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Upload video first if selected
      let videoUrl = lessonModal.videoUrl;
      if (lessonModal.videoFile) {
        setLessonModal(prev => ({ ...prev, isUploading: true }));
        const uploadResult = await fileApi.uploadVideo(lessonModal.videoFile, (percent) => {
          setLessonModal(prev => ({ ...prev, uploadProgress: percent }));
        });
        if (uploadResult.result) {
          videoUrl = uploadResult.result.url;
        }
        setLessonModal(prev => ({ ...prev, isUploading: false }));
      }

      const response = await lessonApi.create({
        chapterId: lessonModal.chapterId,
        lessonName: lessonModal.lessonName,
        description: lessonModal.description || undefined,
        videoUrl: videoUrl || undefined,
        isFreePreview: lessonModal.isFreePreview,
      });

      if (response.code === 201 && response.result) {
        toast.success("Thêm bài học thành công!");
        // Refresh lessons for this chapter
        await fetchLessons(lessonModal.chapterId);
      }
      setLessonModal({ isOpen: false, chapterId: "", lessonName: "", description: "", videoUrl: "", videoFile: null, videoFileName: "", uploadProgress: 0, isUploading: false, isFreePreview: false, isSubmitting: false });
    } catch (error) {
      console.error("Save lesson error:", error);
    } finally {
      setLessonModal(prev => ({ ...prev, isSubmitting: false, isUploading: false }));
    }
  };

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Vui lòng chọn file video");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Kích thước video không được vượt quá 500MB");
      return;
    }

    setLessonModal(prev => ({ 
      ...prev, 
      videoFile: file, 
      videoFileName: file.name,
      videoUrl: "" 
    }));
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Chỉnh sửa khóa học</h1>
            <p className="text-sm text-gray-500">{course?.title}</p>
          </div>
        </div>
        <button
          onClick={handleSaveCourse}
          disabled={isSaving}
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          {isSaving && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          Lưu thay đổi
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "info" ? "border-accent text-accent" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Thông tin cơ bản
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "content" ? "border-accent text-accent" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Nội dung khóa học
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "info" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên khóa học</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                    placeholder="Nhập tên khóa học"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
                    placeholder="Nhập mô tả khóa học"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá (VNĐ)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời lượng (giờ)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cấp độ</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as CourseLevel)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  >
                    <option value={CourseLevel.BEGINNER}>Cơ bản</option>
                    <option value={CourseLevel.INTERMEDIATE}>Trung cấp</option>
                    <option value={CourseLevel.ADVANCED}>Nâng cao</option>
                  </select>
                </div>
              </div>
              {/* Right Column - Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-accent cursor-pointer overflow-hidden transition-colors"
                >
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Cover" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Nhấn để chọn ảnh</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </div>
          ) : (
            /* Content Tab - Chapters */
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Danh sách chương ({chapters.length})</h3>
                <button
                  onClick={() => setChapterModal({ isOpen: true, editId: "", chapterName: "", description: "", isSubmitting: false })}
                  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm chương
                </button>
              </div>

              {chapters.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p>Chưa có chương nào</p>
                  <p className="text-sm">Nhấn &quot;Thêm chương&quot; để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleChapter(chapter.id)}
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="text-sm font-medium text-gray-500">Chương {index + 1}</span>
                          <span className="font-medium text-gray-900">{chapter.chapterName}</span>
                          <span className="text-xs text-gray-400">({chapterLessons[chapter.id]?.length || 0} bài học)</span>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setLessonModal({ 
                              isOpen: true, 
                              chapterId: chapter.id, 
                              lessonName: "",
                              description: "",
                              videoUrl: "",
                              videoFile: null,
                              videoFileName: "",
                              uploadProgress: 0,
                              isUploading: false,
                              isFreePreview: false,
                              isSubmitting: false 
                            })}
                            className="p-1.5 text-gray-500 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                            title="Thêm bài học"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setChapterModal({ 
                              isOpen: true, 
                              editId: chapter.id, 
                              chapterName: chapter.chapterName,
                              description: chapter.description || "",
                              isSubmitting: false 
                            })}
                            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                            title="Sửa chương"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: "chapter", id: chapter.id, title: chapter.chapterName, chapterId: "" })}
                            className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                            title="Xóa chương"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {expandedChapters.has(chapter.id) && (
                        <div className="border-t border-gray-200">
                          {chapter.description && (
                            <p className="text-sm text-gray-600 px-4 py-2 bg-gray-50/50">{chapter.description}</p>
                          )}
                          {/* Lessons list */}
                          <div className="divide-y divide-gray-100">
                            {loadingLessons.has(chapter.id) ? (
                              <div className="px-4 py-6 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang tải...
                              </div>
                            ) : chapterLessons[chapter.id] && chapterLessons[chapter.id].length > 0 ? (
                              chapterLessons[chapter.id].map((lesson, lessonIndex) => (
                                <div 
                                  key={lesson.id} 
                                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                                  onClick={() => setPreviewModal({ isOpen: true, lesson })}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 group-hover:bg-accent group-hover:text-white transition-colors">
                                      {lessonIndex + 1}
                                    </span>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 group-hover:text-accent transition-colors">{lesson.lessonName}</span>
                                        {lesson.isFreePreview && (
                                          <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                            Miễn phí
                                          </span>
                                        )}
                                        {lesson.videoUrl && (
                                          <svg className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                          </svg>
                                        )}
                                      </div>
                                      {lesson.videoUrl && (
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Có video
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteModal({ isOpen: true, type: "lesson", id: lesson.id, title: lesson.lessonName, chapterId: chapter.id });
                                    }}
                                    className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                                    title="Xóa bài học"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                                Chưa có bài học nào
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Chapter Modal */}
      {chapterModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !chapterModal.isSubmitting && setChapterModal({ isOpen: false, editId: "", chapterName: "", description: "", isSubmitting: false })} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {chapterModal.editId ? "Sửa chương" : "Thêm chương mới"}
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên chương *</label>
                <input
                  type="text"
                  value={chapterModal.chapterName}
                  onChange={(e) => setChapterModal({ ...chapterModal, chapterName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  placeholder="Nhập tên chương"
                  autoFocus
                  disabled={chapterModal.isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea
                  value={chapterModal.description}
                  onChange={(e) => setChapterModal({ ...chapterModal, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                  placeholder="Nhập mô tả chương (tùy chọn)"
                  rows={3}
                  disabled={chapterModal.isSubmitting}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setChapterModal({ isOpen: false, editId: "", chapterName: "", description: "", isSubmitting: false })}
                disabled={chapterModal.isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChapter}
                disabled={chapterModal.isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2"
              >
                {chapterModal.isSubmitting && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {chapterModal.editId ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

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
      {lessonModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !lessonModal.isSubmitting && !lessonModal.isUploading && setLessonModal({ isOpen: false, chapterId: "", lessonName: "", description: "", videoUrl: "", videoFile: null, videoFileName: "", uploadProgress: 0, isUploading: false, isFreePreview: false, isSubmitting: false })} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Thêm bài học mới</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên bài học *</label>
                <input
                  type="text"
                  value={lessonModal.lessonName}
                  onChange={(e) => setLessonModal({ ...lessonModal, lessonName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  placeholder="Nhập tên bài học"
                  autoFocus
                  disabled={lessonModal.isSubmitting || lessonModal.isUploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea
                  value={lessonModal.description}
                  onChange={(e) => setLessonModal({ ...lessonModal, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                  placeholder="Nhập mô tả bài học (tùy chọn)"
                  rows={3}
                  disabled={lessonModal.isSubmitting || lessonModal.isUploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Video bài học</label>
                {lessonModal.videoFileName ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{lessonModal.videoFileName}</p>
                      {lessonModal.isUploading && (
                        <div className="mt-1">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent transition-all duration-300" 
                              style={{ width: `${lessonModal.uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Đang tải lên... {lessonModal.uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                    {!lessonModal.isUploading && (
                      <button
                        onClick={() => setLessonModal({ ...lessonModal, videoFile: null, videoFileName: "" })}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => !lessonModal.isSubmitting && videoInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent cursor-pointer transition-colors"
                  >
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">Nhấn để chọn video</p>
                    <p className="text-xs text-gray-400 mt-1">Tối đa 500MB</p>
                  </div>
                )}
                <input 
                  ref={videoInputRef} 
                  type="file" 
                  accept="video/*" 
                  onChange={handleVideoChange} 
                  className="hidden" 
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFreePreview"
                  checked={lessonModal.isFreePreview}
                  onChange={(e) => setLessonModal({ ...lessonModal, isFreePreview: e.target.checked })}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                  disabled={lessonModal.isSubmitting || lessonModal.isUploading}
                />
                <label htmlFor="isFreePreview" className="text-sm text-gray-700">
                  Cho phép xem miễn phí (không cần mua khóa học)
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setLessonModal({ isOpen: false, chapterId: "", lessonName: "", description: "", videoUrl: "", videoFile: null, videoFileName: "", uploadProgress: 0, isUploading: false, isFreePreview: false, isSubmitting: false })}
                disabled={lessonModal.isSubmitting || lessonModal.isUploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveLesson}
                disabled={lessonModal.isSubmitting || lessonModal.isUploading}
                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2"
              >
                {(lessonModal.isSubmitting || lessonModal.isUploading) && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {lessonModal.isUploading ? "Đang tải video..." : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Lesson Modal */}
      {previewModal.isOpen && previewModal.lesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPreviewModal({ isOpen: false, lesson: null })} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewModal.lesson.lessonName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {previewModal.lesson.isFreePreview && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      Miễn phí
                    </span>
                  )}
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

            {/* Video Player */}
            <div className="bg-black">
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
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mô tả bài học</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{previewModal.lesson.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
