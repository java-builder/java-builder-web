"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  Target,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Tag,
  ListTodo,
  X,
  Lightbulb,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  PlayCircle,
  Video,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { DayChallenge } from "@/app/challenges/types";
import { challengeService } from "@/services/challenge.service";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import VideoPlayer from "@/components/common/VideoPlayer";

interface ChallengeDayDetailProps {
  activeDay?: DayChallenge;
  totalDays: number;
  isChallengeFree?: boolean;
  isEnrolled?: boolean;
  onToggleTask?: (taskId: string) => void;
  onCompleteDay: (dayNum: number) => void;
  onSelectDay: (dayNum: number) => void;
  onOpenDrawer?: () => void;
}

type ParsedVideoSource = {
  type: "iframe" | "direct";
  srcOrEmbedUrl: string;
  cleanOriginalUrl: string;
  providerLabel: string;
};

function parseVideoUrl(rawUrl: string): ParsedVideoSource | null {
  const cleanOriginalUrl = rawUrl
    .trim()
    .replace(/#orientation=(vertical|horizontal)$/i, "")
    .trim();
  if (!cleanOriginalUrl) return null;

  try {
    const u = new URL(cleanOriginalUrl);
    const host = u.hostname.toLowerCase();

    // 1. YouTube (watch, youtu.be, embed, shorts, live)
    if (host.includes("youtube.com") || host.includes("youtu.be") || host.includes("youtube-nocookie.com")) {
      let videoId = "";
      if (host.includes("youtu.be")) {
        videoId = u.pathname.replace(/^\/+/, "").split("/")[0];
      } else if (u.pathname.startsWith("/watch")) {
        videoId = u.searchParams.get("v") || "";
      } else if (
        u.pathname.startsWith("/embed/") ||
        u.pathname.startsWith("/shorts/") ||
        u.pathname.startsWith("/live/")
      ) {
        const parts = u.pathname.split("/").filter(Boolean);
        videoId = parts[1] || "";
      }

      if (videoId) {
        return {
          type: "iframe",
          srcOrEmbedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
          cleanOriginalUrl,
          providerLabel: "YouTube",
        };
      }
    }

    // 2. Vimeo
    if (host.includes("vimeo.com")) {
      const match = u.pathname.match(/\/(?:video\/)?(\d+)/);
      if (match && match[1]) {
        return {
          type: "iframe",
          srcOrEmbedUrl: `https://player.vimeo.com/video/${match[1]}`,
          cleanOriginalUrl,
          providerLabel: "Vimeo",
        };
      }
    }

    // 3. Loom
    if (host.includes("loom.com") && u.pathname.includes("/share/")) {
      return {
        type: "iframe",
        srcOrEmbedUrl: cleanOriginalUrl.replace("/share/", "/embed/"),
        cleanOriginalUrl,
        providerLabel: "Loom",
      };
    }

    // 4. Google Drive
    if (host.includes("drive.google.com") && u.pathname.includes("/file/d/")) {
      const embedUrl = cleanOriginalUrl.replace(/\/(view|edit)(\?.*)?$/, "/preview");
      return {
        type: "iframe",
        srcOrEmbedUrl: embedUrl,
        cleanOriginalUrl,
        providerLabel: "Google Drive",
      };
    }
  } catch {
    // Fallback if relative URL or non-standard URL
  }

  return {
    type: "direct",
    srcOrEmbedUrl: cleanOriginalUrl,
    cleanOriginalUrl,
    providerLabel: "Video bài giảng",
  };
}

export function ChallengeDayDetail({
  activeDay,
  totalDays,
  isChallengeFree,
  onCompleteDay,
  onSelectDay,
  onOpenDrawer,
}: ChallengeDayDetailProps) {
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [isLoadingSolution, setIsLoadingSolution] = useState(false);
  const [solutionCache, setSolutionCache] = useState<Record<string, string>>({});
  const [isVideoExpanded, setIsVideoExpanded] = useState(true);

  const rawVideoUrl = activeDay?.videoUrl?.trim() || "";
  const parsedVideo = rawVideoUrl ? parseVideoUrl(rawVideoUrl) : null;

  // Reset solution open state & expand video when switching days
  useEffect(() => {
    setIsSolutionOpen(false);
    setIsVideoExpanded(true);
  }, [activeDay?.id, activeDay?.day]);

  if (!activeDay) {
    return (
      <div className="rounded-2xl border border-[#E8E8E8] bg-white p-8 text-center shadow-xs dark:border-border dark:bg-surface space-y-3">
        <Compass className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
        <h3 className="text-base font-bold text-foreground">Chưa có nội dung cho ngày này</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Lộ trình thử thách đang được cập nhật nội dung chi tiết từng ngày.
        </p>
      </div>
    );
  }

  const tasks = activeDay.tasks || [];
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const isAllTasksCompleted = tasks.length > 0 && completedTasksCount === tasks.length;

  const whyLearnText = activeDay.whyLearn?.trim() || "";
  const coreMissionText = activeDay.coreMission?.trim() || "";
  const validKeyConcepts = (activeDay.keyConcepts || [])
    .map((c) => (c || "").trim())
    .filter(Boolean);

  const dayId = activeDay.id || "";
  const currentSolutionContent =
    (dayId && solutionCache[dayId]) || activeDay.contentSolution || "";

  const handleToggleSolution = async () => {
    if (isSolutionOpen) {
      setIsSolutionOpen(false);
      return;
    }

    setIsSolutionOpen(true);

    if (currentSolutionContent || !dayId) {
      return;
    }

    setIsLoadingSolution(true);
    try {
      const res = await challengeService.getDaySolutionById(dayId);
      const fetchedSolution = res?.data?.contentSolution?.trim() || "";
      if (fetchedSolution) {
        setSolutionCache((prev) => ({
          ...prev,
          [dayId]: fetchedSolution,
        }));
      } else {
        toast.error("Chưa có nội dung lời giải cho ngày này.");
        setIsSolutionOpen(false);
      }
    } catch {
      toast.error("Không thể tải lời giải. Vui lòng thử lại!");
      setIsSolutionOpen(false);
    } finally {
      setIsLoadingSolution(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5 sm:p-7 shadow-xs dark:border-border dark:bg-surface space-y-6">
      {/* 1. DAY HEADER */}
      <div className="space-y-3 border-b border-[#E8E8E8] dark:border-border pb-5">
        {/* Badges & Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-bold text-white shadow-xs">
            NGÀY {activeDay.day}
          </span>
          <span className="rounded-full bg-[#F8F8F8] px-2.5 py-1 text-xs font-medium text-[#171717] dark:bg-background dark:text-slate-200 border border-[#E8E8E8] dark:border-border">
            Tuần {activeDay.week}{activeDay.phaseName ? ` • ${activeDay.phaseName}` : ""}
          </span>
          {activeDay.isFreePreview && (
            <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-bold border border-emerald-500/20">
              {isChallengeFree ? "Miễn phí" : "Học thử miễn phí"}
            </span>
          )}
          {parsedVideo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 text-xs font-bold border border-blue-500/25">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Có video hướng dẫn</span>
            </span>
          )}
          {activeDay.hasSolution && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-xs font-bold border border-amber-500/25">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Có hướng dẫn giải</span>
            </span>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] dark:text-white tracking-tight">
            {activeDay.title}
          </h1>
        </div>

        {/* Key Concepts / Keywords - Chỉ hiển thị khi có dữ liệu */}
        {validKeyConcepts.length > 0 && (
          <div className="pt-1.5 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Từ khóa trọng tâm:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {validKeyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary/20 transition-colors"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. WHY LEARN & CORE MISSION - Chỉ hiển thị khi có ít nhất 1 trong 2 trường */}
      {(whyLearnText || coreMissionText) && (
        <div
          className={`grid grid-cols-1 gap-4 ${
            whyLearnText && coreMissionText ? "md:grid-cols-2" : ""
          }`}
        >
          {/* Why Learn */}
          {whyLearnText && (
            <div className="rounded-xl border border-border bg-muted/25 dark:bg-background/60 p-4 sm:p-5 border-l-3 border-l-primary flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide">
                  Ý nghĩa thực tế
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {whyLearnText}
              </p>
            </div>
          )}

          {/* Core Mission */}
          {coreMissionText && (
            <div className="rounded-xl border border-border bg-muted/25 dark:bg-background/60 p-4 sm:p-5 border-l-3 border-l-emerald-500 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide">
                  Mục tiêu ngày học
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {coreMissionText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. COMPACT TASK SUMMARY BAR */}
      {tasks.length > 0 && (
        <div
          onClick={onOpenDrawer}
          className="rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-background p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:shadow-2xs cursor-pointer group"
        >
          {/* Left: Icon + Title + Task count */}
          <div className="flex items-center gap-2.5 min-w-0">
            <ListTodo className="w-4.5 h-4.5 text-[#FF5A1F] shrink-0" />
            <div className="min-w-0 flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#171717] dark:text-white leading-tight">
                Nhiệm vụ thực hành Ngày {activeDay.day}
              </h3>
              {isAllTasksCompleted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Đã hoàn thành
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FFF0E8] text-[#FF5A1F] border border-[#FF5A1F]/30 dark:bg-[#FF5A1F]/15">
                  {completedTasksCount}/{tasks.length} nhiệm vụ
                </span>
              )}
            </div>
          </div>

          {/* Right: Progress bar + CTA button */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between sm:justify-end">
            <div className="flex items-center gap-2 min-w-[110px] sm:min-w-[130px]">
              <div className="h-1.5 flex-1 bg-gray-200 dark:bg-muted rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-sm ${
                    isAllTasksCompleted ? "bg-emerald-500" : "bg-[#FF5A1F]"
                  }`}
                  style={{
                    width: `${Math.round((completedTasksCount / tasks.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[11px] font-bold tabular-nums text-muted-foreground">
                {Math.round((completedTasksCount / tasks.length) * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDrawer) onOpenDrawer();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] text-white shadow-md shadow-[#FF5A1F]/25 font-bold text-xs shadow-2xs transition-all cursor-pointer group-hover:bg-[#e04b16] active:scale-95"
            >
              <span>Xem nhiệm vụ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* 4. VIDEO LESSON SECTION (Chỉ hiển thị khi bài học có videoUrl) */}
      {parsedVideo && (
        <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8]/70 dark:bg-background overflow-hidden shadow-2xs">
          {/* Video Header Bar */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0E8] dark:bg-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-[#171717] dark:text-white uppercase tracking-wider">
                    Video bài giảng & hướng dẫn
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {parsedVideo.providerLabel}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Xem video minh họa trực quan trước khi bắt tay vào thực hành Ngày {activeDay.day}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {parsedVideo.type === "iframe" && (
                <a
                  href={parsedVideo.cleanOriginalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-[#FF5A1F] hover:bg-[#FFF0E8]/60 dark:hover:bg-muted transition-colors border border-[#E8E8E8] dark:border-border"
                  title="Mở video trong tab mới"
                >
                  <span>Mở tab mới</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsVideoExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-background text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {isVideoExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Thu gọn</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Xem video</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Video Player Container (Standard 16:9 Horizontal Cinema Frame) */}
          {isVideoExpanded && (
            <div className="p-3 sm:p-4 bg-[#0F172A] dark:bg-slate-950">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/15 shadow-lg">
                {parsedVideo.type === "iframe" ? (
                  <iframe
                    src={parsedVideo.srcOrEmbedUrl}
                    title={`Video Ngày ${activeDay.day}: ${activeDay.title}`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <VideoPlayer
                    src={parsedVideo.srcOrEmbedUrl}
                    className="w-full h-full [&_[data-vjs-player]]:w-full [&_[data-vjs-player]]:h-full [&_.video-js]:!w-full [&_.video-js]:!h-full [&_.video-js]:!pt-0"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DETAILED GUIDE CONTENT (MARKDOWN) - Học sinh đọc và làm theo trước */}
      {activeDay.content && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8E8] dark:border-border text-sm font-bold text-[#171717] dark:text-white uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#FF5A1F]" />
            <span>Nội dung hướng dẫn chi tiết</span>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F8F8] border border-[#E8E8E8] dark:bg-background dark:border-border text-sm leading-relaxed overflow-hidden">
            <PublicMarkdownRenderer content={activeDay.content} />
          </div>
        </div>
      )}

      {/* 6. ON-DEMAND SOLUTION SECTION (Chỉ hiển thị khi bài học có contentSolution) */}
      {activeDay.hasSolution && (
        <div className="pt-2">
          <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-gradient-to-br from-[#FFF9F5] via-white to-[#FFF5EE] dark:from-surface dark:via-background dark:to-surface overflow-hidden shadow-2xs transition-all">
            {/* Banner Header */}
            <div className="p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0E8] dark:bg-[#FF5A1F]/15 border border-[#FF5A1F]/25 text-[#FF5A1F] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-[#171717] dark:text-white">
                      Lời giải & Hướng dẫn thực hành Ngày {activeDay.day}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0E8] text-[#FF5A1F] border border-[#FF5A1F]/25 dark:bg-[#FF5A1F]/15">
                      <Sparkles className="w-2.5 h-2.5" />
                      Gợi ý & Đáp án
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hãy tự mình suy nghĩ và thực hiện các nhiệm vụ trước khi mở xem lời giải chi tiết.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleSolution}
                disabled={isLoadingSolution}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 ${
                  isSolutionOpen
                    ? "border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface text-foreground hover:bg-muted"
                    : "bg-[#FF5A1F] hover:bg-[#e04b16] text-white shadow-md shadow-[#FF5A1F]/25"
                }`}
              >
                {isLoadingSolution ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang tải lời giải...</span>
                  </>
                ) : isSolutionOpen ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ẩn lời giải</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem lời giải</span>
                  </>
                )}
              </button>
            </div>

            {/* Solution Content Body (Loaded on demand) */}
            {isSolutionOpen && (
              <div className="border-t border-[#E8E8E8] dark:border-border bg-white dark:bg-background p-5 sm:p-6 animate-in fade-in slide-in-from-top-1 duration-200">
                {isLoadingSolution ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2.5 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FF5A1F]" />
                    <p className="text-xs font-medium">
                      Đang tải nội dung lời giải chi tiết...
                    </p>
                  </div>
                ) : currentSolutionContent ? (
                  <div className="text-sm leading-relaxed overflow-hidden">
                    <PublicMarkdownRenderer content={currentSolutionContent} />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. NAVIGATION & COMPLETION ACTIONS */}
      <div className="pt-4 border-t border-[#E8E8E8] dark:border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={activeDay.day <= 1}
            onClick={() => onSelectDay(Math.max(1, activeDay.day - 1))}
            className="px-4 py-2 rounded-full border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface hover:text-[#FF5A1F] hover:bg-[#FFF0E8]/50 text-[#171717] dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ngày trước</span>
          </button>

          <button
            type="button"
            disabled={activeDay.day >= totalDays}
            onClick={() => onSelectDay(Math.min(totalDays, activeDay.day + 1))}
            className="px-4 py-2 rounded-full border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface hover:text-[#FF5A1F] hover:bg-[#FFF0E8]/50 text-[#171717] dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Ngày sau</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeDay.status === "completed" ? (
          <button
            type="button"
            onClick={() => onCompleteDay(activeDay.day)}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 font-semibold text-xs sm:text-sm border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Bấm để hủy hoàn thành ngày này"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:hidden" />
            <X className="w-4 h-4 text-rose-500 hidden group-hover:inline" />
            <span className="group-hover:hidden">Đã hoàn thành Ngày {activeDay.day}</span>
            <span className="hidden group-hover:inline">Hủy hoàn thành Ngày {activeDay.day}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCompleteDay(activeDay.day)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 ${
              isAllTasksCompleted
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 ring-2 ring-emerald-500/30"
                : "bg-[#FF5A1F] hover:bg-[#e04b16] shadow-[#FF5A1F]/25"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isAllTasksCompleted
                ? `Xác nhận xong Ngày ${activeDay.day} 🚀`
                : `Hoàn thành Ngày ${activeDay.day}`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
