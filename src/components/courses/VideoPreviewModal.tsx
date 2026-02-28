"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { LessonDetailResponse } from "@/types/course";

interface VideoPreviewModalProps {
  isOpen: boolean;
  lesson: LessonDetailResponse | null;
  isEnrolled: boolean;
  isPremiumUser: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

export default function VideoPreviewModal({
  isOpen,
  lesson,
  isEnrolled,
  isPremiumUser,
  onClose,
  onEnroll,
}: VideoPreviewModalProps) {
  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700 gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {lesson.lessonName}
            </h3>
            {isPremiumUser && !isEnrolled ? (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800">
                Premium Member
              </span>
            ) : isEnrolled ? (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800">
                Đã đăng ký
              </span>
            ) : (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800">
                Xem miễn phí
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="bg-black">
          {lesson.videoUrl ? (
            <VideoPlayer src={lesson.videoUrl} autoPlay className="w-full" />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-gray-900">
              <div className="text-center text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p>Chưa có video cho bài học này</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {lesson.description && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả bài học
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {lesson.description}
            </p>
          </div>
        )}

        {/* CTA - Only show if not enrolled and not premium */}
        {!isEnrolled && !isPremiumUser && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-accent-50 dark:bg-accent-900/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                Đăng ký khóa học để xem tất cả bài học
              </p>
              <button
                onClick={onEnroll}
                className="w-full sm:w-auto px-4 py-2 bg-accent hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
