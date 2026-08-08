"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseDetailResponse, CourseLevel, CourseFormat, CourseStatus } from "@/types/course";
import { CourseEditHeader, CourseInfoTab } from "@/components/admin/courses/edit";
import toast from "react-hot-toast";
import { courseApi } from "@/services/course.service";
import { courseEditHelpers } from "@/hooks/useCourses";
import { handleImageFileChange } from "@/utils/validations";

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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse max-w-5xl bg-gray-50 min-h-screen">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-10 bg-muted rounded w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-20 bg-muted rounded w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
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
        isSaving={isSaving}
        onSave={handleSaveCourse}
      />

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h2>
          <Link href={`/admin/courses/${courseId}/content`}>
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
              <BookOpen className="w-4 h-4 text-accent" />
              Quản lý nội dung khóa học
            </Button>
          </Link>
        </div>

        <div className="p-6">
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
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 rounded-b-xl">
          <Link href="/admin/courses">
            <Button variant="outline" type="button" className="px-5 cursor-pointer">
              Hủy bỏ
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Link href={`/admin/courses/${courseId}/content`}>
              <Button variant="outline" type="button" className="gap-2 cursor-pointer">
                <BookOpen className="w-4 h-4 text-accent" />
                Nội dung khóa học
              </Button>
            </Link>
            <Button
              variant="accent"
              onClick={handleSaveCourse}
              disabled={isSaving}
              className="gap-2 font-semibold px-6 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
