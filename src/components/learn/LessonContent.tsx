"use client";

import VideoPlayer, { VideoPlayerRef } from "@/components/common/VideoPlayer";
import { LessonDetailResponse } from "@/types/course";
import LessonComments from "./LessonComments";
import LessonNotes from "./LessonNotes";
import { useState, useRef, useCallback } from "react";
import {
  ChevronRight,
  FileText,
  Info,
  MessageSquare,
  PlayCircle,
  VideoOff,
} from "lucide-react";

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
      <div className="flex-1 flex items-center justify-center bg-background p-8 h-[70vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-2xl flex items-center justify-center border border-border shadow-xs">
            <PlayCircle className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-muted font-semibold text-sm sm:text-base">
            Chọn một bài học để bắt đầu học tập
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        {/* Video skeleton */}
        <div className="bg-black shrink-0">
          <div className="aspect-video w-full max-w-5xl mx-auto bg-neutral-950 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-neutral-800/60 flex items-center justify-center animate-pulse">
              <PlayCircle className="w-7 h-7 text-neutral-500" />
            </div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
          <div className="h-6 bg-muted rounded-lg w-3/4 mb-5 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "overview" as TabType,
      label: "Tổng quan",
      icon: <Info className="w-4 h-4" />,
    },
    {
      id: "notes" as TabType,
      label: "Ghi chú",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "comments" as TabType,
      label: "Bình luận",
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  return (
    <div className="animate-in fade-in duration-300 flex flex-col bg-background min-h-screen">
      {/* Video Player Section */}
      <div className="bg-black shrink-0 w-full">
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
          <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-neutral-950">
            <div className="text-center px-4">
              <VideoOff className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
              <p className="text-sm font-semibold text-neutral-400">
                Chưa có video bài học cho nội dung này
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs & Content Section */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-muted/30 border-b border-border px-2 sm:px-4">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 sm:flex-none px-5 py-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                      isActive
                        ? "border-primary text-primary bg-primary-soft/40"
                        : "border-transparent text-text-muted hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-4 leading-tight">
                  {lesson.lessonName}
                </h1>

                {lesson.description ? (
                  <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {lesson.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic mb-6">
                    Chưa có mô tả chi tiết cho bài học này.
                  </p>
                )}

                {/* Next Lesson CTA */}
                {canNext && (
                  <div className="mt-8 p-5 bg-primary-soft/60 border border-primary/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-primary uppercase tracking-wider leading-none mb-1">
                        Bài tiếp theo
                      </p>
                      <p className="text-sm font-bold text-foreground leading-normal truncate">
                        Tiếp tục hành trình học tập của bạn
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onNext}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full transition-all shadow-sm hover:shadow active:scale-95 text-sm flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto shrink-0"
                    >
                      <span>Bài tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
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
