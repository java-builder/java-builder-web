"use client";

import VideoPlayer, { VideoPlayerRef } from "@/components/common/VideoPlayer";
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
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-8 h-[70vh]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-gray-200/50 dark:border-slate-700/50 shadow-sm">
            <svg className="w-10 h-10 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-semibold text-sm sm:text-base">Chọn một bài học để bắt đầu học tập</p>
        </div>
      </div>
    );
  }

  // Loading overlay
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Video skeleton */}
        <div className="bg-black flex-shrink-0">
          <div className="aspect-video w-full max-w-5xl mx-auto bg-slate-950/80 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-600 dark:text-slate-450" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mb-5"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabType, label: "Tổng quan", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: "notes" as TabType, label: "Ghi chú", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )},
    { id: "comments" as TabType, label: "Bình luận", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )},
  ];

  return (
    <div className="animate-in fade-in duration-300 flex flex-col bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Video Player Section */}
      <div className="bg-black flex-shrink-0 w-full">
        {lesson.videoUrl ? (
          <div className="w-full max-w-5xl mx-auto shadow-2xl">
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
          <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-slate-950">
            <div className="text-center text-slate-400 px-4">
              <svg className="w-14 h-14 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-semibold text-slate-500">Chưa có video bài học cho nội dung này</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs & Content Section */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="bg-gray-50/50 dark:bg-slate-900/30 border-b border-gray-200 dark:border-slate-700/60">
            <div className="flex flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none px-6 py-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-accent text-accent bg-accent/5 dark:bg-accent/10 dark:text-sky-400"
                      : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-slate-700/30"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                  {lesson.lessonName}
                </h1>
                
                {lesson.description && (
                  <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                    <p className="text-gray-650 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {lesson.description}
                    </p>
                  </div>
                )}

                {/* Next Lesson CTA */}
                {canNext && (
                  <div className="mt-8 p-5 bg-accent/5 dark:bg-accent/10 border border-accent/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-accent dark:text-sky-400 uppercase tracking-widest leading-none mb-1">Bài tiếp theo</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-normal truncate">Tiếp tục hành trình học tập</p>
                    </div>
                    <button
                      onClick={onNext}
                      className="px-5 py-2.5 bg-accent hover:bg-accent-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto flex-shrink-0"
                    >
                      <span>Bài tiếp theo</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <div className="animate-in fade-in duration-200">
                <LessonNotes
                  lessonId={lesson.id}
                  currentTime={currentTime}
                  onSeekTo={handleSeekTo}
                />
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="animate-in fade-in duration-200">
                <LessonComments lessonId={lesson.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
