"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  useChallengeById,
  useChallengePhases,
  useChallengeDays,
} from "@/hooks/useChallenges";
import { challengeService } from "@/services/challenge.service";
import {
  ChallengePhaseResponse,
  ChallengeDayResponse,
  ChallengeTaskResponse,
  CreateChallengePhaseRequest,
  UpdateChallengePhaseRequest,
  CreateChallengeDayRequest,
  UpdateChallengeDayRequest,
  CreateChallengeTaskRequest,
  UpdateChallengeTaskRequest,
} from "@/types/challenge";
import { PhaseModal, DayModal, TaskModal } from "@/components/admin/challenges";
import ChallengeDetailHeader from "@/components/admin/challenges/detail/ChallengeDetailHeader";
import ChallengePhaseList from "@/components/admin/challenges/detail/ChallengePhaseList";
import ChallengeDayList from "@/components/admin/challenges/detail/ChallengeDayList";
import { useConfirm } from "@/hooks/useConfirm";
import toast from "react-hot-toast";

export default function AdminChallengeDetailPage() {
  const params = useParams();
  const challengeId = (params.id as string) || "";
  const queryClient = useQueryClient();

  // Data fetching
  const {
    data: challenge,
    isLoading: isLoadingChallenge,
    isFetching: isFetchingChallenge,
    refetch: refetchChallenge,
  } = useChallengeById(challengeId);

  const {
    data: phases = [],
    isLoading: isLoadingPhases,
    refetch: refetchPhases,
  } = useChallengePhases(challengeId);

  const {
    data: days = [],
    isLoading: isLoadingDays,
    refetch: refetchDays,
  } = useChallengeDays(challengeId);

  // Modals state
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<ChallengePhaseResponse | null>(null);

  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<ChallengeDayResponse | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ChallengeTaskResponse | null>(null);
  const [activeTaskDay, setActiveTaskDay] = useState<{ id: string; dayNumber: number } | null>(null);

  const [activeTab, setActiveTab] = useState<"days" | "phases">("days");

  const { confirm } = useConfirm();

  const handleRefreshAll = () => {
    refetchChallenge();
    refetchPhases();
    refetchDays();
    toast.success("Đã làm mới dữ liệu!");
  };

  // Phase Actions
  const handleOpenCreatePhase = () => {
    setEditingPhase(null);
    setIsPhaseModalOpen(true);
  };

  const handleOpenEditPhase = (phase: ChallengePhaseResponse) => {
    setEditingPhase(phase);
    setIsPhaseModalOpen(true);
  };

  const handleSubmitPhase = async (
    formData: CreateChallengePhaseRequest | UpdateChallengePhaseRequest
  ) => {
    try {
      if (editingPhase) {
        await challengeService.updatePhase(editingPhase.id, formData as UpdateChallengePhaseRequest);
        toast.success("Cập nhật giai đoạn thành công!");
      } else {
        await challengeService.createPhase(formData as CreateChallengePhaseRequest);
        toast.success("Thêm giai đoạn mới thành công!");
      }
      setIsPhaseModalOpen(false);
      setEditingPhase(null);
      refetchPhases();
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      const msg = errorResponse?.response?.data?.message || "Không thể lưu giai đoạn. Vui lòng thử lại!";
      toast.error(msg);
    }
  };

  const handleDeletePhase = (id: string, title: string) => {
    confirm(
      async () => {
        await challengeService.deletePhase(id);
        toast.success("Đã xóa giai đoạn!");
        refetchPhases();
      },
      {
        title: "Xóa giai đoạn?",
        message: `Bạn có chắc muốn xóa giai đoạn "<strong>${title}</strong>"?`,
        type: "error",
      }
    );
  };

  // Day Actions
  const handleOpenCreateDay = () => {
    setEditingDay(null);
    setIsDayModalOpen(true);
  };

  const handleOpenEditDay = (day: ChallengeDayResponse) => {
    setEditingDay(day);
    setIsDayModalOpen(true);
  };

  const handleSubmitDay = async (
    formData: CreateChallengeDayRequest | UpdateChallengeDayRequest
  ) => {
    try {
      if (editingDay) {
        const res = await challengeService.updateDay(editingDay.id, formData as UpdateChallengeDayRequest);
        const updatedDay = res.data;
        if (updatedDay) {
          queryClient.setQueryData<ChallengeDayResponse[]>(["challenge-days", challengeId], (oldDays = []) =>
            oldDays.map((d) => (d.id === editingDay.id ? updatedDay : d))
          );
        }
        toast.success("Cập nhật thử thách ngày thành công!");
      } else {
        const res = await challengeService.createDay(formData as CreateChallengeDayRequest);
        const newDay = res.data;
        if (newDay) {
          queryClient.setQueryData<ChallengeDayResponse[]>(["challenge-days", challengeId], (oldDays = []) => [
            ...oldDays,
            newDay,
          ]);
        }
        toast.success("Thêm thử thách ngày mới thành công!");
      }
      setIsDayModalOpen(false);
      setEditingDay(null);
      refetchDays();
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      const msg = errorResponse?.response?.data?.message || "Không thể lưu ngày thử thách. Vui lòng thử lại!";
      toast.error(msg);
    }
  };

  const handleDeleteDay = (id: string, dayNumber: number, title: string) => {
    confirm(
      async () => {
        await challengeService.deleteDay(id);
        toast.success(`Đã xóa Ngày ${dayNumber}!`);
        refetchDays();
      },
      {
        title: `Xóa Thử thách Ngày ${dayNumber}?`,
        message: `Bạn có chắc muốn xóa ngày "<strong>${title}</strong>"? Toàn bộ bài tập liên quan cũng sẽ bị xóa vĩnh viễn.`,
        type: "error",
      }
    );
  };

  // Task Actions
  const handleOpenCreateTask = (dayInfo: { id: string; dayNumber: number }) => {
    setActiveTaskDay(dayInfo);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (
    dayInfo: { id: string; dayNumber: number },
    task: ChallengeTaskResponse
  ) => {
    setActiveTaskDay(dayInfo);
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSubmitTask = async (
    formData: CreateChallengeTaskRequest | UpdateChallengeTaskRequest
  ) => {
    try {
      if (editingTask) {
        const res = await challengeService.updateTask(editingTask.id, formData as UpdateChallengeTaskRequest);
        const updatedTask = res.data;
        if (updatedTask && activeTaskDay) {
          queryClient.setQueryData<ChallengeDayResponse[]>(["challenge-days", challengeId], (oldDays = []) =>
            oldDays.map((d) =>
              d.id === activeTaskDay.id
                ? {
                    ...d,
                    tasks: (d.tasks || []).map((t) => (t.id === editingTask.id ? updatedTask : t)),
                  }
                : d
            )
          );
        }
        toast.success("Cập nhật bài tập thành công!");
      } else {
        const res = await challengeService.createTask(formData as CreateChallengeTaskRequest);
        const newTask = res.data;
        if (newTask && activeTaskDay) {
          queryClient.setQueryData<ChallengeDayResponse[]>(["challenge-days", challengeId], (oldDays = []) =>
            oldDays.map((d) =>
              d.id === activeTaskDay.id
                ? {
                    ...d,
                    tasks: [...(d.tasks || []), newTask],
                  }
                : d
            )
          );
        }
        toast.success("Thêm bài tập mới thành công!");
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      setActiveTaskDay(null);
      refetchDays();
    } catch (err: unknown) {
      const errorResponse = err as { response?: { status?: number; data?: { message?: string } } };
      if (errorResponse?.response?.status === 404) {
        toast.error("Nhiệm vụ không còn tồn tại trên máy chủ (đã bị xóa hoặc tạo mới). Đang làm mới dữ liệu...");
        setIsTaskModalOpen(false);
        setEditingTask(null);
        setActiveTaskDay(null);
        refetchDays();
      } else {
        const msg = errorResponse?.response?.data?.message || "Không thể lưu bài tập. Vui lòng thử lại!";
        toast.error(msg);
      }
    }
  };

  const handleDeleteTask = (taskId: string, title: string, onDone: () => void) => {
    confirm(
      async () => {
        try {
          await challengeService.deleteTask(taskId);
          queryClient.setQueryData<ChallengeDayResponse[]>(["challenge-days", challengeId], (oldDays = []) =>
            oldDays.map((d) => ({
              ...d,
              tasks: (d.tasks || []).filter((t) => t.id !== taskId),
            }))
          );
          toast.success("Đã xóa bài tập!");
          onDone();
          refetchDays();
        } catch (err: unknown) {
          const errorResponse = err as { response?: { data?: { message?: string } } };
          const msg = errorResponse?.response?.data?.message || "Không thể xóa bài tập. Vui lòng thử lại!";
          toast.error(msg);
        }
      },
      {
        title: "Xóa bài tập này?",
        message: `Bạn có chắc muốn xóa bài tập "<strong>${title}</strong>"?`,
        type: "error",
      }
    );
  };

  if (isLoadingChallenge || isLoadingPhases || isLoadingDays) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">Đang tải thông tin thử thách lập trình...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-20 bg-card border border-border rounded-xl p-8">
        <h3 className="text-lg font-bold text-foreground">Không tìm thấy thử thách</h3>
        <p className="text-sm text-muted-foreground mt-1">Lộ trình thử thách này không tồn tại hoặc đã bị xóa.</p>
        <Link href="/admin/challenges" className="inline-block mt-4">
          <Button variant="outline" size="sm">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const nextPhaseNumber =
    phases.length > 0 ? Math.max(...phases.map((p) => p.phaseNumber)) + 1 : 1;
  const nextDayNumber =
    days.length > 0 ? Math.max(...days.map((d) => d.dayNumber)) + 1 : 1;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header component */}
      <ChallengeDetailHeader
        challenge={challenge}
        phasesCount={phases.length}
        daysCount={days.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={handleRefreshAll}
        isRefreshing={isFetchingChallenge}
        onCreatePhase={handleOpenCreatePhase}
        onCreateDay={handleOpenCreateDay}
      />

      {/* Main Tab Content */}
      {activeTab === "phases" ? (
        <ChallengePhaseList
          phases={phases}
          days={days}
          onCreatePhase={handleOpenCreatePhase}
          onEditPhase={handleOpenEditPhase}
          onDeletePhase={handleDeletePhase}
        />
      ) : (
        <ChallengeDayList
          days={days}
          onCreateDay={handleOpenCreateDay}
          onEditDay={handleOpenEditDay}
          onDeleteDay={handleDeleteDay}
          onCreateTask={handleOpenCreateTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Phase Modal */}
      <PhaseModal
        isOpen={isPhaseModalOpen}
        onClose={() => {
          setIsPhaseModalOpen(false);
          setEditingPhase(null);
        }}
        onSubmit={handleSubmitPhase}
        initialData={editingPhase}
        challengeId={challengeId}
        nextPhaseNumber={nextPhaseNumber}
      />

      {/* Day Modal */}
      <DayModal
        isOpen={isDayModalOpen}
        onClose={() => {
          setIsDayModalOpen(false);
          setEditingDay(null);
        }}
        onSubmit={handleSubmitDay}
        initialData={editingDay}
        challengeId={challengeId}
        phases={phases}
        nextDayNumber={nextDayNumber}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setActiveTaskDay(null);
        }}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        dayId={activeTaskDay?.id || ""}
        dayNumber={activeTaskDay?.dayNumber || 1}
      />
    </div>
  );
}
