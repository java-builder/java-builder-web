"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  const [tasks, setTasks] = useState<ChallengeTaskResponse[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true);
      const res = await challengeService.getTasksByDayId(day.id);
      if (res.data) {
        setTasks(res.data);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoadingTasks(false);
    }
  }, [day.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden transition-all hover:border-accent/30">
      {/* Day Header Row */}
      <div className="p-4 sm:p-5 bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm shrink-0">
            D{day.dayNumber}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Thử thách Ngày {day.dayNumber}: {day.title}
              </h3>
              {day.isFreePreview && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Học thử miễn phí
                </span>
              )}
              {day.phaseNumber && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                  Chặng {day.phaseNumber}{day.phaseTitle ? `: ${day.phaseTitle}` : ""}
                </span>
              )}
            </div>

            {day.coreMission && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                <strong className="text-foreground font-medium">Nhiệm vụ:</strong> {day.coreMission}
              </p>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateTask({ id: day.id, dayNumber: day.dayNumber })}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm bài tập</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditDay(day)}
            className="h-8 w-8 p-0"
            title="Sửa thử thách ngày"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteDay(day.id, day.dayNumber, day.title)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Xóa ngày"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 text-muted-foreground"
            title={isExpanded ? "Thu gọn" : "Mở rộng"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Day Tasks List */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-2.5 bg-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-accent" />
              Nhiệm vụ & Bài tập ({tasks.length})
            </span>
          </div>

          {isLoadingTasks ? (
            <div className="py-3 text-xs text-muted-foreground animate-pulse">
              Đang tải danh sách bài tập...
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-2">
              Chưa có bài tập nào cho ngày này. Nhấn &quot;Thêm bài tập&quot; để thiết lập nhiệm vụ cho học viên.
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-[10px] shrink-0">
                      {task.orderIndex || idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground truncate">
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onEditTask({ id: day.id, dayNumber: day.dayNumber }, task)
                      }
                      className="h-7 w-7 p-0"
                      title="Sửa bài tập"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task.id, task.title, fetchTasks)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Xóa bài tập"
                    >
                      <Trash2 className="h-3 w-3" />
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
