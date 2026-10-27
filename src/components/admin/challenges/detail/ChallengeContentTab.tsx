"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  ChevronRight,
  Edit,
  Trash2,
  BookOpen,
  Lock,
  Unlock,
  ExternalLink,
  FileText,
  CheckSquare,
  Loader2,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  ChallengePhaseResponse,
  ChallengeDayResponse,
  ChallengeTaskResponse,
  getLinkDisplayTitle,
} from "@/types/challenge";
import { challengeService } from "@/services/challenge.service";
import toast from "react-hot-toast";

interface ChallengeContentTabProps {
  phases: ChallengePhaseResponse[];
  days: ChallengeDayResponse[];
  onAddPhase: () => void;
  onEditPhase: (phase: ChallengePhaseResponse) => void;
  onDeletePhase: (phaseId: string, phaseTitle: string) => void;
  onAddDay: (phaseId?: string) => void;
  onEditDay: (day: ChallengeDayResponse) => void;
  onDeleteDay: (dayId: string, dayNumber: number, dayTitle: string) => void;
  onAddTask: (dayInfo: { id: string; dayNumber: number }) => void;
  onEditTask: (dayInfo: { id: string; dayNumber: number }, task: ChallengeTaskResponse) => void;
  onDeleteTask: (taskId: string, title: string, onDone: () => void) => void;
  onRefreshDays?: () => void;
}

export default function ChallengeContentTab({
  phases,
  days,
  onAddPhase,
  onEditPhase,
  onDeletePhase,
  onAddDay,
  onEditDay,
  onDeleteDay,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onRefreshDays,
}: ChallengeContentTabProps) {
  // Expanded phases (all expanded by default)
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() => {
    return new Set(phases.map((p) => p.id));
  });

  // Expanded days to view tasks inline
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [loadingDayTasks, setLoadingDayTasks] = useState<Set<string>>(new Set());
  const [dayTasksMap, setDayTasksMap] = useState<Record<string, ChallengeTaskResponse[]>>({});

  // Toggling free preview loading state per dayId
  const [togglingFreeId, setTogglingFreeId] = useState<string | null>(null);

  // Group days by phase
  const { phaseDaysMap, unassignedDays } = useMemo(() => {
    const map = new Map<string, ChallengeDayResponse[]>();
    const unassigned: ChallengeDayResponse[] = [];

    phases.forEach((p) => {
      map.set(p.id, []);
    });

    days.forEach((day) => {
      let matchedPhase: ChallengePhaseResponse | undefined;

      if (day.phaseId) {
        matchedPhase = phases.find((p) => p.id === day.phaseId);
      }
      if (!matchedPhase && day.phaseNumber) {
        matchedPhase = phases.find((p) => p.phaseNumber === day.phaseNumber);
      }
      if (!matchedPhase) {
        matchedPhase = phases.find((p) => {
          if (p.startDay && p.endDay) {
            return day.dayNumber >= p.startDay && day.dayNumber <= p.endDay;
          }
          if (p.daysNumber && p.daysNumber.includes(day.dayNumber)) {
            return true;
          }
          return false;
        });
      }

      if (matchedPhase) {
        const list = map.get(matchedPhase.id) || [];
        list.push(day);
        map.set(matchedPhase.id, list);
      } else {
        unassigned.push(day);
      }
    });

    map.forEach((list) => {
      list.sort((a, b) => a.dayNumber - b.dayNumber);
    });
    unassigned.sort((a, b) => a.dayNumber - b.dayNumber);

    return { phaseDaysMap: map, unassignedDays: unassigned };
  }, [phases, days]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const toggleDayTasks = async (day: ChallengeDayResponse) => {
    const isCurrentlyExpanded = expandedDays.has(day.id);
    const next = new Set(expandedDays);

    if (isCurrentlyExpanded) {
      next.delete(day.id);
      setExpandedDays(next);
      return;
    }

    next.add(day.id);
    setExpandedDays(next);

    // If tasks not yet loaded and day.tasks is empty, fetch them
    if (!dayTasksMap[day.id] && (!day.tasks || day.tasks.length === 0)) {
      setLoadingDayTasks((prev) => new Set(prev).add(day.id));
      try {
        const res = await challengeService.getTasksByDayId(day.id);
        if (res.data) {
          setDayTasksMap((prev) => ({ ...prev, [day.id]: res.data || [] }));
        }
      } catch {
        toast.error("Không thể tải danh sách bài tập của ngày này");
      } finally {
        setLoadingDayTasks((prev) => {
          const updated = new Set(prev);
          updated.delete(day.id);
          return updated;
        });
      }
    }
  };

  const handleToggleFreePreview = async (day: ChallengeDayResponse) => {
    if (togglingFreeId === day.id) return;
    const currentVal = Boolean(day.freePreview ?? day.isFreePreview);
    const nextVal = !currentVal;
    setTogglingFreeId(day.id);

    try {
      await challengeService.updateDay(day.id, { isFreePreview: nextVal });
      toast.success(
        nextVal
          ? `Đã mở học thử miễn phí cho Ngày ${day.dayNumber}!`
          : `Đã khóa Ngày ${day.dayNumber} (Yêu cầu trả phí)!`
      );
      if (onRefreshDays) onRefreshDays();
    } catch {
      toast.error("Không thể cập nhật quyền học thử. Vui lòng thử lại!");
    } finally {
      setTogglingFreeId(null);
    }
  };

  const getTasksForDay = (day: ChallengeDayResponse): ChallengeTaskResponse[] => {
    if (dayTasksMap[day.id]) return dayTasksMap[day.id];
    return day.tasks || [];
  };

  return (
    <div className="space-y-4">
      {/* Action Header Card - Modeled after CourseContentTab */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card border border-border p-4 rounded-xl shadow-xs">
        <div>
          <h3 className="font-bold text-foreground text-base">
            Danh sách giai đoạn & ngày học ({phases.length} giai đoạn • {days.length} ngày)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tổ chức lộ trình theo giai đoạn, thiết lập ngày học và giao bài tập thực chiến
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddDay()}
            className="gap-1.5 font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm ngày học</span>
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={onAddPhase}
            className="gap-1.5 font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm giai đoạn</span>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {phases.length === 0 && days.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground border border-dashed border-border rounded-xl bg-card">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="font-semibold text-foreground text-base">Chưa có giai đoạn nào</p>
          <p className="text-sm mt-1 max-w-sm mx-auto">
            Nhấn &quot;Thêm giai đoạn&quot; để bắt đầu xây dựng cấu trúc lộ trình cho thử thách.
          </p>
          <Button
            variant="accent"
            size="sm"
            onClick={onAddPhase}
            className="mt-4 gap-1.5 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm giai đoạn đầu tiên</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {phases.map((phase) => {
            const phaseDays = phaseDaysMap.get(phase.id) || [];
            const isExpanded = expandedPhases.has(phase.id);

            return (
              <div
                key={phase.id}
                className="border border-border rounded-xl overflow-hidden bg-card shadow-xs transition-colors"
              >
                {/* Phase Header Row */}
                <div
                  className="flex items-center justify-between px-4 py-3.5 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors select-none"
                  onClick={() => togglePhase(phase.id)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
                        isExpanded ? "rotate-90 text-accent" : ""
                      }`}
                    />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider whitespace-nowrap bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                      Giai đoạn {phase.phaseNumber}
                    </span>
                    <span
                      className="font-semibold text-foreground truncate text-sm sm:text-base"
                      title={phase.title}
                    >
                      {phase.title}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                      ({phaseDays.length} ngày học
                      {phase.startDay && phase.endDay
                        ? ` • Ngày ${phase.startDay} - ${phase.endDay}`
                        : ""}
                      )
                    </span>
                  </div>

                  {/* Phase Actions */}
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onAddDay(phase.id)}
                      className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors border border-border/40 cursor-pointer"
                      title="Thêm ngày học vào giai đoạn này"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditPhase(phase)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border/40 cursor-pointer"
                      title="Sửa giai đoạn"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePhase(phase.id, phase.title)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40 cursor-pointer"
                      title="Xóa giai đoạn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Phase Body (Days List) */}
                {isExpanded && (
                  <div className="border-t border-border">

                    {phaseDays.length === 0 ? (
                      <div className="px-5 py-6 text-center text-muted-foreground text-xs sm:text-sm">
                        <span>Chưa có ngày học nào trong giai đoạn này. </span>
                        <button
                          type="button"
                          onClick={() => onAddDay(phase.id)}
                          className="font-medium text-accent hover:underline cursor-pointer"
                        >
                          + Thêm ngày học ngay
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {phaseDays.map((day) => {
                          const isFree = Boolean(day.freePreview ?? day.isFreePreview);
                          const dayTasks = getTasksForDay(day);
                          const isTasksExpanded = expandedDays.has(day.id);
                          const isLoadingTasks = loadingDayTasks.has(day.id);
                          const isTogglingFree = togglingFreeId === day.id;

                          return (
                            <div key={day.id} className="transition-colors">
                              {/* Day Row */}
                              <div className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-muted/30 transition-all duration-200 group">
                                <div
                                  className="flex items-start sm:items-center gap-3 flex-1 min-w-0 cursor-pointer"
                                  onClick={() => toggleDayTasks(day)}
                                >
                                  {/* Day Number Badge */}
                                  <span className="w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-200 shrink-0 mt-0.5 sm:mt-0">
                                    D{day.dayNumber}
                                  </span>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                                        Ngày {day.dayNumber}: {day.title}
                                      </span>

                                      {/* Free Preview Toggle Pill */}
                                      <button
                                        type="button"
                                        disabled={isTogglingFree}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleFreePreview(day);
                                        }}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full font-semibold border transition-all cursor-pointer ${
                                          isFree
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                        }`}
                                        title={
                                          isFree
                                            ? "Bấm để khóa bài học (Chỉ học viên trả phí)"
                                            : "Bấm để mở học thử miễn phí"
                                        }
                                      >
                                        {isTogglingFree ? (
                                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                        ) : isFree ? (
                                          <Unlock className="w-2.5 h-2.5" />
                                        ) : (
                                          <Lock className="w-2.5 h-2.5" />
                                        )}
                                        <span>{isFree ? "Học thử miễn phí" : "Có phí"}</span>
                                      </button>

                                      {/* Task count badge */}
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <CheckSquare className="w-3.5 h-3.5 text-accent/70" />
                                        <span>{dayTasks.length} bài tập</span>
                                      </span>
                                    </div>

                                    {/* Mission Snippet */}
                                    {day.coreMission && (
                                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 font-normal">
                                        <span className="font-medium text-foreground/80">
                                          Nhiệm vụ:
                                        </span>{" "}
                                        {day.coreMission}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Day Actions */}
                                <div
                                  className="flex items-center gap-1.5 shrink-0 ml-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {/* Toggle Tasks Button */}
                                  <button
                                    type="button"
                                    onClick={() => toggleDayTasks(day)}
                                    className={`px-2 py-1 text-xs rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                                      isTasksExpanded
                                        ? "bg-accent/10 text-accent border-accent/30 font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted border-border/40"
                                    }`}
                                    title="Xem và quản lý bài tập"
                                  >
                                    <span>Bài tập</span>
                                    <ChevronRight
                                      className={`w-3 h-3 transition-transform ${
                                        isTasksExpanded ? "rotate-90 text-accent" : ""
                                      }`}
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      onAddTask({ id: day.id, dayNumber: day.dayNumber })
                                    }
                                    className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors border border-border/40 cursor-pointer"
                                    title="Thêm bài tập"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onEditDay(day)}
                                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border/40 cursor-pointer"
                                    title="Sửa ngày học"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onDeleteDay(day.id, day.dayNumber, day.title)
                                    }
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40 cursor-pointer"
                                    title="Xóa ngày học"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Nested Tasks List (when expanded) */}
                              {isTasksExpanded && (
                                <div className="pl-6 sm:pl-14 pr-4 sm:pr-5 py-3 bg-muted/15 border-t border-border/40 space-y-2">
                                  {/* Day Key Concepts if any */}
                                  {day.keyConcepts && day.keyConcepts.length > 0 && (
                                    <div className="flex items-center gap-1.5 flex-wrap pb-1">
                                      <span className="text-[11px] text-muted-foreground font-medium">
                                        Khái niệm:
                                      </span>
                                      {day.keyConcepts.map((c, i) => (
                                        <span
                                          key={i}
                                          className="text-[10.5px] px-2 py-0.5 rounded bg-muted border border-border text-foreground font-medium"
                                        >
                                          {c}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {isLoadingTasks ? (
                                    <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                                      <span>Đang tải danh sách bài tập...</span>
                                    </div>
                                  ) : dayTasks.length === 0 ? (
                                    <div className="py-3 text-center border border-dashed border-border/80 rounded-lg bg-card/60 p-3">
                                      <p className="text-xs text-muted-foreground">
                                        Chưa có bài tập nào cho ngày này.
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onAddTask({ id: day.id, dayNumber: day.dayNumber })
                                        }
                                        className="text-xs font-semibold text-accent hover:underline mt-1 cursor-pointer inline-flex items-center gap-1"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Thêm bài tập đầu tiên</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {dayTasks.map((task, tIdx) => (
                                        <div
                                          key={task.id}
                                          className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/80 hover:border-accent/40 transition-colors gap-3"
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <span className="w-5 h-5 rounded text-[10px] font-bold bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                              #{tIdx + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                              <span className="text-xs font-medium text-foreground block truncate">
                                                {task.title}
                                              </span>
                                              {/* Resource Links */}
                                              {task.resourceLinks &&
                                                task.resourceLinks.length > 0 && (
                                                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                                    {task.resourceLinks.map((link, lIdx) => {
                                                      const displayTitle =
                                                        getLinkDisplayTitle(link);
                                                      return (
                                                        <a
                                                          key={lIdx}
                                                          href={link.url}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground hover:text-accent border border-border transition-colors truncate max-w-[180px]"
                                                        >
                                                          {link.type === "YOUTUBE" && (
                                                            <FaYoutube className="w-3 h-3 text-rose-500 shrink-0" />
                                                          )}
                                                          {link.type === "OFFICIAL" && (
                                                            <BookOpen className="w-3 h-3 text-blue-500 shrink-0" />
                                                          )}
                                                          {link.type === "DOCUMENTATION" && (
                                                            <FileText className="w-3 h-3 text-sky-500 shrink-0" />
                                                          )}
                                                          {link.type === "GITHUB" && (
                                                            <CheckSquare className="w-3 h-3 text-foreground shrink-0" />
                                                          )}
                                                          <span className="truncate">
                                                            {displayTitle}
                                                          </span>
                                                          <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
                                                        </a>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                            </div>
                                          </div>

                                          {/* Task Actions */}
                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                onEditTask(
                                                  {
                                                    id: day.id,
                                                    dayNumber: day.dayNumber,
                                                  },
                                                  task
                                                )
                                              }
                                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                              title="Sửa bài tập"
                                            >
                                              <Edit className="w-3 h-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                onDeleteTask(task.id, task.title, () => {
                                                  setDayTasksMap((prev) => ({
                                                    ...prev,
                                                    [day.id]: (prev[day.id] || []).filter(
                                                      (t) => t.id !== task.id
                                                    ),
                                                  }));
                                                })
                                              }
                                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                              title="Xóa bài tập"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                      ))}

                                      <div className="pt-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onAddTask({ id: day.id, dayNumber: day.dayNumber })
                                          }
                                          className="text-xs font-semibold text-accent hover:underline cursor-pointer inline-flex items-center gap-1"
                                        >
                                          <Plus className="w-3 h-3" />
                                          <span>Thêm bài tập cho Ngày {day.dayNumber}</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Unassigned Days Section (if any) */}
          {unassignedDays.length > 0 && (
            <div className="border border-amber-500/30 rounded-xl overflow-hidden bg-card shadow-xs">
              <div className="flex items-center justify-between px-4 py-3 bg-amber-500/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
                    Chưa phân giai đoạn
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({unassignedDays.length} ngày học)
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border/60">
                {unassignedDays.map((day) => {
                  const isFree = Boolean(day.freePreview ?? day.isFreePreview);
                  return (
                    <div
                      key={day.id}
                      className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-muted/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                          D{day.dayNumber}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground truncate">
                              Ngày {day.dayNumber}: {day.title}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[11px] rounded-full font-semibold border ${
                                isFree
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {isFree ? "Học thử miễn phí" : "Có phí"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => onEditDay(day)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border/40 cursor-pointer"
                          title="Sửa ngày học"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteDay(day.id, day.dayNumber, day.title)
                          }
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40 cursor-pointer"
                          title="Xóa ngày học"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
