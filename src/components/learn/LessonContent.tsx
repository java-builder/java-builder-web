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
  isLoading?: boolean;
  onTimeUpdate: (time: number, duration: number) => void;
  onNext: () => void;
}

type TabType = "overview" | "notes" | "comments";

export default function LessonContent({
  lesson,
  initialTime,
  canNext,
  isLoading = false,
  onTimeUpdate,
  onNext,
}: LessonContentProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
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

  // Loading overlay
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Video skeleton */}
        <div className="bg-black flex-shrink-0">
          <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-3"></div>
              <p className="text-gray-400 text-sm">Đang tải bài học...</p>
            </div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabType, label: "Tổng quan", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: "notes" as TabType, label: "Ghi chú", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )},
    { id: "comments" as TabType, label: "Bình luận", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )},
  ];

  return (
    <div className="animate-fadeIn">
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

      {/* Tabs & Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          {/* Tab Navigation */}
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "border-accent text-accent bg-accent/5 dark:bg-accent/10"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {lesson.lessonName}
                </h1>
                
                {lesson.description && (
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base whitespace-pre-wrap">
                      {lesson.description}
                    </p>
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
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <LessonNotes
                lessonId={lesson.id}
                currentTime={currentTime}
                onSeekTo={handleSeekTo}
              />
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <LessonComments lessonId={lesson.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
