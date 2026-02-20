import { LessonFormat } from "@/types/lesson";
import { CourseLevel, CourseFormat } from "@/types/course";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface LessonFormData {
  lessonName: string;
  content?: string;
  lessonFormat: LessonFormat;
  videoFile: File | null;
  isEdit?: boolean;
  hasExistingVideo?: boolean;
}

export const validateLessonForm = (data: LessonFormData): ValidationResult => {
  if (!data.lessonName.trim()) {
    return {
      isValid: false,
      error: "Vui lòng nhập tên bài học",
    };
  }

  if (data.lessonFormat === LessonFormat.TEXT && !data.content?.trim()) {
    return {
      isValid: false,
      error: "Vui lòng nhập nội dung bài học",
    };
  }

  if (data.lessonFormat === LessonFormat.VIDEO && !data.videoFile && !data.hasExistingVideo) {
    return {
      isValid: false,
      error: "Vui lòng chọn video",
    };
  }

  if (data.lessonFormat === LessonFormat.MIXED && (!data.content?.trim() || (!data.videoFile && !data.hasExistingVideo))) {
    return {
      isValid: false,
      error: "Vui lòng nhập nội dung và chọn video",
    };
  }

  return { isValid: true };
};

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: CourseLevel;
  courseFormat: CourseFormat;
}

export const validateCourseForm = (data: CourseFormData): ValidationResult => {
  if (!data.title.trim()) {
    return {
      isValid: false,
      error: "Vui lòng nhập tên khóa học",
    };
  }

  if (!data.description.trim()) {
    return {
      isValid: false,
      error: "Vui lòng nhập mô tả khóa học",
    };
  }

  if (data.price < 0) {
    return {
      isValid: false,
      error: "Giá khóa học không được âm",
    };
  }

  if (data.duration < 0) {
    return {
      isValid: false,
      error: "Thời lượng không được âm",
    };
  }

  return { isValid: true };
};

export interface ChapterFormData {
  chapterName: string;
  description?: string;
}

export const validateChapterForm = (data: ChapterFormData): ValidationResult => {
  if (!data.chapterName.trim()) {
    return {
      isValid: false,
      error: "Vui lòng nhập tên chương",
    };
  }

  return { isValid: true };
};

export const validateImageFile = (file: File): ValidationResult => {
  if (!file.type.startsWith("image/")) {
    return {
      isValid: false,
      error: "Vui lòng chọn file ảnh",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      isValid: false,
      error: "Kích thước file không được vượt quá 5MB",
    };
  }

  return { isValid: true };
};

export const validateVideoFile = (file: File): ValidationResult => {
  if (!file.type.startsWith("video/")) {
    return {
      isValid: false,
      error: "Vui lòng chọn file video",
    };
  }

  if (file.size > 2000 * 1024 * 1024) {
    return {
      isValid: false,
      error: "Kích thước video không được vượt quá 2000MB",
    };
  }

  return { isValid: true };
};

export interface FileHandlerCallbacks {
  onSuccess: (file: File, preview?: string) => void;
  onError: (error: string) => void;
}

export const handleImageFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  callbacks: FileHandlerCallbacks
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const validation = validateImageFile(file);
  if (!validation.isValid) {
    callbacks.onError(validation.error!);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = e.target?.result as string;
    callbacks.onSuccess(file, preview);
  };
  reader.readAsDataURL(file);
};

export const handleVideoFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  callbacks: FileHandlerCallbacks
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const validation = validateVideoFile(file);
  if (!validation.isValid) {
    callbacks.onError(validation.error!);
    return;
  }

  callbacks.onSuccess(file);
};
