"use client";

import { useQuery } from "@tanstack/react-query";
import { courseApi, chapterApi, lessonApi, fileApi } from "@/services/course.service";
import { CourseLevel, CourseFormat, UpdateCourseRequest, UpdateLessonRequest } from "@/types/course";
import { LessonFormat } from "@/types/lesson";

export const useCourses = (
  page?: number,
  size?: number,
  title?: string,
  level?: CourseLevel,
  courseFormat?: CourseFormat
) => {
  return useQuery({
    queryKey: ["courses", page, size, title, level, courseFormat],
    queryFn: async () => {
      const res = await courseApi.getCourses(page, size, title, level, courseFormat);
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useCourseDetail = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await courseApi.getById(courseId);
      return res.data;
    },
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useFeaturedCourses = () => {
  return useCourses();
};

// Helper functions for course edit operations
export const courseEditHelpers = {
  updateCourse: async (
    courseId: string,
    data: UpdateCourseRequest & { key?: string },
    imageFile?: File | null
  ) => {
    let key = data.key;

    if (imageFile) {
      const result = await fileApi.uploadPublicImage(imageFile);
      key = result.key;
    }

    return await courseApi.update(courseId, {
      ...data,
      key: key || undefined,
    });
  },

  // Fetch lessons by chapter
  fetchLessonsByChapter: async (chapterId: string) => {
    const response = await lessonApi.getByChapterId(chapterId);
    return response.data || [];
  },

  // Create chapter
  createChapter: async (data: {
    courseId: string;
    chapterName: string;
    description?: string;
  }) => {
    return await chapterApi.create(data);
  },

  // Update chapter
  updateChapter: async (data: {
    id: string;
    chapterName: string;
    description?: string;
  }) => {
    return await chapterApi.update(data);
  },

  // Delete chapter
  deleteChapter: async (id: string) => {
    return await chapterApi.delete(id);
  },

  // Create lesson with optional video upload
  createLesson: async (
    data: {
      chapterId: string;
      lessonName: string;
      description?: string;
      content?: string;
      lessonFormat: LessonFormat;
      isFreePreview: boolean;
    },
    videoFile?: File | null,
    onProgress?: (percent: number) => void
  ) => {
    let videoKey: string | undefined;

    // Upload video if provided
    if (videoFile && (data.lessonFormat === LessonFormat.VIDEO || data.lessonFormat === LessonFormat.MIXED)) {
      const uploadResult = await fileApi.uploadPrivateVideo(videoFile, onProgress);
      videoKey = uploadResult.key;
    }

    return await lessonApi.create({
      chapterId: data.chapterId,
      lessonName: data.lessonName,
      description: data.description,
      content: data.content,
      lessonFormat: data.lessonFormat,
      videoKey: videoKey,
      isFreePreview: data.isFreePreview,
    });
  },

  // Delete lesson
  deleteLesson: async (id: string) => {
    return await lessonApi.delete(id);
  },

  // Get lesson detail (with video URL)
  getLessonDetail: async (lessonId: string) => {
    const response = await lessonApi.getById(lessonId);
    return response.data;
  },

  // Update lesson with optional video upload
  updateLesson: async (
    lessonId: string,
    data: {
      lessonName: string;
      description?: string;
      content?: string;
      lessonFormat: LessonFormat;
      isFreePreview: boolean;
    },
    videoFile?: File | null,
    onProgress?: (percent: number) => void
  ) => {
    let videoKey: string | undefined;

    if (videoFile) {
      const uploadResult = await fileApi.uploadPrivateVideo(videoFile, onProgress);
      videoKey = uploadResult.key;
    }

    const updateData: UpdateLessonRequest = {
      lessonName: data.lessonName,
      description: data.description || undefined,
      content: data.content || undefined,
      lessonFormat: data.lessonFormat,
      isFreePreview: data.isFreePreview,
    };

    if (videoKey) {
      updateData.videoKey = videoKey;
    }

    return await lessonApi.update(lessonId, updateData);
  },
};
