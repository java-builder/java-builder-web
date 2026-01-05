"use client";

import VideoPlayer, { VideoPlayerRef } from "@/components/VideoPlayer";
import { LessonDetailResponse } from "@/types/course";
import LessonComments from "./LessonComments";
import LessonNotes from "./LessonNotes";
import { useState, useRef, useCallback } from "react";

interface LessonContentProps {
  lesson: LessonDetailResponse | null;
  initialTime: number;
  canNext: boolean;
  onTimeUpdate: (time: number, duration: number) => void;
  onNext: () => void;
}

export default function LessonContent({
  lesson,
  initialTime,
  canNext,
  onTimeUpdate,
  onNext,
}: LessonContentProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<VideoPlayerRef>(null);

  const handleTimeUpdate = useCallback(
    (time: number, duration: number) => {
      setCurrentTime(time);
      onTimeUpdate(time, duration);
    },
    [onTimeUpdate]
  );

  const handleSeekTo = useCallback((timestamp: number) => {
    videoRef.current?.seekTo(timestamp);
  }, []);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Chọn một bài học để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Video Player */}
      <div className="bg-black flex-shrink-0">
        {lesson.videoUrl ? (
          <div className="w-full max-w-5xl mx-auto">
            <VideoPlayer
              ref={videoRef}
              key={lesson.id}
              src={lesson.videoUrl}
              autoPlay
              initialTime={initialTime}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>
        ) : (
          <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-gray-800">
            <div className="text-center text-gray-400 px-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm sm:text-base">Chưa có video cho bài học này</p>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">{lesson.lessonName}</h1>
          
          {lesson.description && (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base whitespace-pre-wrap">{lesson.description}</p>
            </div>
          )}

          {/* Next Lesson CTA */}
          {canNext && (
            <div className="mt-6 sm:mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bài tiếp theo</p>
                <p className="text-gray-900 dark:text-white font-medium">Tiếp tục học</p>
              </div>
              <button
                onClick={onNext}
                className="px-4 py-2 bg-accent hover:bg-accent-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Bài tiếp theo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Notes Section */}
          <LessonNotes
            lessonId={lesson.id}
            currentTime={currentTime}
            onSeekTo={handleSeekTo}
          />

          {/* Comments Section */}
          <LessonComments lessonId={lesson.id} />
        </div>
      </div>
    </>
  );
}
