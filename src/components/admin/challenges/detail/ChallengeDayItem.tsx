"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckSquare,
  ChevronRight,
  BookOpen,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  ChallengeDayResponse,
  ChallengeTaskResponse,
} from "@/types/challenge";
import { challengeService } from "@/services/challenge.service";

interface ChallengeDayItemProps {
  day: ChallengeDayResponse;
  onEditDay: (day: ChallengeDayResponse) => void;
  onDeleteDay: (id: string, dayNumber: number, title: string) => void;
  onCreateTask: (dayInfo: { id: string; dayNumber: number }) => void;
  onEditTask: (dayInfo: { id: string; dayNumber: number }, task: ChallengeTaskResponse) => void;
  onDeleteTask: (taskId: string, title: string, onDone: () => void) => void;
}

export default function ChallengeDayItem({
  day,
  onEditDay,
  onDeleteDay,
  onCreateTask,
  onEditTask,
  onDeleteTask,
}: ChallengeDayItemProps) {
  const [tasks, setTasks] = useState<ChallengeTaskResponse[]>(day.tasks || []);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFreePreview, setIsFreePreview] = useState<boolean>(Boolean(day.freePreview ?? day.isFreePreview));
  const [isTogglingFree, setIsTogglingFree] = useState(false);

  // Sync state when day prop updates
  useEffect(() => {
    setIsFreePreview(Boolean(day.freePreview ?? day.isFreePreview));
  }, [day.freePreview, day.isFreePreview]);

  useEffect(() => {
    if (day.tasks) {
      setTasks(day.tasks);
    }
  }, [day.tasks]);

  const fetchTasks = useCallback(async () => {
    try {
      if (tasks.length === 0) {
        setIsLoadingTasks(true);
      }
      const res = await challengeService.getTasksByDayId(day.id);
      if (res.data) {
        setTasks(res.data);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoadingTasks(false);
    }
  }, [day.id, tasks.length]);

  // Only auto-fetch if tasks are completely missing from day prop
  useEffect(() => {
    if (isExpanded && (!day.tasks || day.tasks.length === 0) && tasks.length === 0) {
      fetchTasks();
    }
  }, [isExpanded, day.tasks, tasks.length, fetchTasks]);

  // Instant 1-click toggle free preview with optimistic UI update
  const handleToggleFreePreview = async () => {
    if (isTogglingFree) return;
    const nextVal = !isFreePreview;
    setIsFreePreview(nextVal);
    setIsTogglingFree(true);

    try {
      await challengeService.updateDay(day.id, { isFreePreview: nextVal });
      toast.success(
        nextVal
          ? `Đã mở học thử miễn phí cho Ngày ${day.dayNumber}!`
          : `Đã khóa Ngày ${day.dayNumber} (Yêu cầu mua gói)!`
      );
    } catch {
      setIsFreePreview(!nextVal); // Rollback
      toast.error("Không thể cập nhật quyền học thử. Vui lòng thử lại!");
    } finally {
      setIsTogglingFree(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden transition-all hover:border-accent/40">
      {/* Day Header Row - Click to expand/collapse */}
      <div
        className="p-3 sm:p-4 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 cursor-pointer hover:bg-muted/30 transition-colors select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 mt-0.5 sm:mt-0 ${
              isExpanded ? "rotate-90 text-accent" : ""
            }`}
          />

          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs shrink-0 mt-0.5 sm:mt-0">
            D{day.dayNumber}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                Thử thách Ngày {day.dayNumber}: {day.title}
              </h3>

              {/* Free Preview Toggle Button Badge */}
              <button
                type="button"
                disabled={isTogglingFree}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFreePreview();
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer border active:scale-95 ${
                  isFreePreview
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                }`}
                title={isFreePreview ? "Bấm để khóa bài học (Chỉ học viên đã mua)" : "Bấm để cho phép học viên học thử miễn phí"}
              >
                {isTogglingFree ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : isFreePreview ? (
                  <Unlock className="w-2.5 h-2.5" />
                ) : (
                  <Lock className="w-2.5 h-2.5" />
                )}
                <span>{isFreePreview ? "Học thử miễn phí" : "Có phí (Khóa)"}</span>
              </button>

              {day.phaseNumber && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/60">
                  Giai đoạn {day.phaseNumber}{day.phaseTitle ? `: ${day.phaseTitle}` : ""}
                </span>
              )}
            </div>

            {day.coreMission && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1">
                <span className="font-medium text-foreground/80">Nhiệm vụ:</span> {day.coreMission}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center gap-1.5 self-end sm:self-center shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              onCreateTask({ id: day.id, dayNumber: day.dayNumber });
              if (!isExpanded) setIsExpanded(true);
            }}
            className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors border border-border/40 cursor-pointer"
            title="Thêm bài tập"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEditDay(day)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border/40 cursor-pointer"
            title="Sửa thử thách ngày"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteDay(day.id, day.dayNumber, day.title)}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40 cursor-pointer"
            title="Xóa ngày"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Tasks List (Collapsible) */}
      {isExpanded && (
        <div className="p-3.5 sm:p-5 space-y-3 bg-card border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/60">
            <span className="font-semibold flex items-center gap-1.5 text-foreground">
              <CheckSquare className="h-4 w-4 text-accent" />
              Nhiệm vụ & Bài tập ({tasks.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateTask({ id: day.id, dayNumber: day.dayNumber })}
              className="gap-1.5 cursor-pointer text-xs h-7.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm bài tập</span>
            </Button>
          </div>

          {isLoadingTasks && tasks.length === 0 ? (
            <div className="py-4 text-xs text-muted-foreground animate-pulse text-center">
              Đang tải danh sách bài tập...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border rounded-lg bg-muted/10">
              <p className="text-xs text-muted-foreground">
                Chưa có bài tập nào cho ngày này.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCreateTask({ id: day.id, dayNumber: day.dayNumber })}
                className="mt-2 text-xs text-accent hover:text-accent cursor-pointer"
              >
                <Plus className="h-3 w-3 mr-1" />
                Thêm bài tập đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-[10px] shrink-0">
                      {task.orderIndex || idx + 1}
                    </span>
                    <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground break-words line-clamp-2 sm:line-clamp-1">
                        {task.title}
                      </span>
                      {task.resourceLinks && task.resourceLinks.length > 0 && (
                        <div className="flex items-center gap-1 shrink-0">
                          {task.resourceLinks.map((link, lIdx) => (
                            <span
                              key={lIdx}
                              title={`${link.type}: ${link.title || link.url}`}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                link.type === "YOUTUBE"
                                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                  : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              }`}
                            >
                              {link.type === "YOUTUBE" ? (
                                <FaYoutube className="w-2.5 h-2.5" />
                              ) : (
                                <BookOpen className="w-2.5 h-2.5" />
                              )}
                              <span>{link.type === "YOUTUBE" ? "YT" : "Doc"}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onEditTask({ id: day.id, dayNumber: day.dayNumber }, task)
                      }
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                      title="Sửa bài tập"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task.id, task.title, fetchTasks)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Xóa bài tập"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
