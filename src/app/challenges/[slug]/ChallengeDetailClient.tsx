"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { FilterOption } from "@/components/ui/FilterSelect";
import { Challenge, DayChallenge } from "../types";
import { adaptChallengeDetailResponseToUi } from "../data/challengeAdapter";
import { useChallengeBySlug } from "@/hooks/useChallenges";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { challengeService } from "@/services/challenge.service";
import { paymentApi } from "@/services/payment.service";
import { CreatePaymentResponse } from "@/types/payment";
import PaymentModal from "@/components/courses/PaymentModal";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import {
  ChallengeHeader,
  ChallengeToolbar,
  ChallengeDaysGrid,
  ChallengeDayDetail,
  ChallengePaywallCard,
  ChallengeSideDrawer,
} from "@/components/challenges";

interface Props {
  challenge?: Challenge;
}

export default function ChallengeDetailClient({ challenge: initialChallenge }: Props) {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || initialChallenge?.slug || "";

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: challengeData, isLoading, error } = useChallengeBySlug(
    initialChallenge ? "" : slug
  );

  const challenge: Challenge | null = useMemo(() => {
    if (initialChallenge) return initialChallenge;
    if (challengeData) return adaptChallengeDetailResponseToUi(challengeData);
    return null;
  }, [initialChallenge, challengeData]);

  const [days, setDays] = useState<DayChallenge[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activePhaseFilter, setActivePhaseFilter] = useState<number | "all">("all");
  const [isUnlockedAll, setIsUnlockedAll] = useState<boolean>(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isDayForbidden, setIsDayForbidden] = useState<boolean>(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    data: CreatePaymentResponse | null;
  }>({
    isOpen: false,
    isLoading: false,
    data: null,
  });

  // Sync days when challenge loads
  useEffect(() => {
    if (challenge) {
      setDays(challenge.days);
    }
  }, [challenge]);

  // Check enrollment status
  useEffect(() => {
    if (!currentUser || !challenge?.id) return;
    challengeService
      .checkEnrollment(challenge.id)
      .then((res) => {
        if (res.data) setIsEnrolled(true);
      })
      .catch(() => {});
  }, [currentUser, challenge?.id]);

  // Auto enroll if challenge is free
  useEffect(() => {
    if (!currentUser || !challenge?.id || !challenge.isFree || isEnrolled) return;
    challengeService
      .enrollFree(challenge.id)
      .then(() => setIsEnrolled(true))
      .catch(() => {});
  }, [currentUser, challenge?.id, challenge?.isFree, isEnrolled]);

  // Listen to WebSocket payment success
  useEffect(() => {
    const handlePaymentSuccess = () => {
      setIsEnrolled(true);
      setIsUnlockedAll(true);
      setIsDayForbidden(false);
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
      toast.success("🎉 Kích hoạt thử thách thành công!");
    };

    window.addEventListener("payment:success", handlePaymentSuccess);
    return () => window.removeEventListener("payment:success", handlePaymentSuccess);
  }, []);

  // Load progress from DB when user and challenge are ready (NO LOCALSTORAGE)
  useEffect(() => {
    if (!currentUser || !slug) return;
    let isMounted = true;

    challengeService
      .getProgress(slug)
      .then((res) => {
        if (!isMounted || !res.data) return;
        const { completedTaskIds, completedDayNumbers } = res.data;
        const taskSet = new Set(completedTaskIds || []);
        const daySet = new Set(completedDayNumbers || []);

        setDays((prevDays) =>
          prevDays.map((d) => {
            const isDayCompleted = daySet.has(d.day);
            const updatedTasks = d.tasks.map((t) => ({
              ...t,
              isCompleted: isDayCompleted || taskSet.has(t.id),
            }));
            const prevDayCompleted = daySet.has(d.day - 1);
            const isUnlocked = d.day === 1 || d.day <= 3 || prevDayCompleted;

            return {
              ...d,
              status: isDayCompleted
                ? ("completed" as const)
                : isUnlocked
                ? ("in_progress" as const)
                : ("locked" as const),
              tasks: updatedTasks,
            };
          })
        );
      })
      .catch((err) => {
        console.error("Failed to load challenge progress from DB:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser, slug, challenge]);

  // Stats
  const completedCount = useMemo(() => {
    return days.filter((d) => d.status === "completed").length;
  }, [days]);

  const progressPercent = useMemo(() => {
    if (!challenge || challenge.totalDays === 0) return 0;
    return Math.round((completedCount / challenge.totalDays) * 100);
  }, [completedCount, challenge]);

  const activeDay = useMemo(() => {
    return days.find((d) => d.day === selectedDayNumber) || days[0];
  }, [days, selectedDayNumber]);

  const phaseOptions: FilterOption<string | number>[] = useMemo(() => {
    if (!challenge) return [];
    return [
      {
        value: "all",
        label: `Tất cả (${days.length} ngày)`,
        description: `Hiển thị toàn bộ ${days.length} ngày học đã có`,
      },
      ...challenge.phases.map((p) => ({
        value: p.id,
        label: `${p.badge}: ${p.title}`,
        description: `${p.dayRange} (${p.weekRange})`,
      })),
    ];
  }, [challenge, days.length]);

  // Filtered days list
  const filteredDays = useMemo(() => {
    return days.filter((d) => {
      return activePhaseFilter === "all" || d.phaseId === activePhaseFilter;
    });
  }, [days, activePhaseFilter]);

  // Toggle single task & persist to DB immediately
  const handleToggleTask = async (taskId: string) => {
    if (!activeDay) return;
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để lưu tiến độ bài tập!");
      return;
    }

    // Optimistic UI update
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.day === activeDay.day) {
          const updatedTasks = d.tasks.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          );
          const hasUncompleted = updatedTasks.some((t) => !t.isCompleted);
          return {
            ...d,
            status: hasUncompleted && d.status === "completed" ? ("in_progress" as const) : d.status,
            tasks: updatedTasks,
          };
        }
        return d;
      })
    );

    try {
      await challengeService.toggleTask(taskId);
    } catch {
      toast.error("Không thể lưu trạng thái nhiệm vụ. Vui lòng thử lại!");
      // Revert optimistic update
      setDays((prevDays) =>
        prevDays.map((d) => {
          if (d.day === activeDay.day) {
            const updatedTasks = d.tasks.map((t) =>
              t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
            );
            return { ...d, tasks: updatedTasks };
          }
          return d;
        })
      );
    }
  };

  // Toggle day complete status & unlock next in DB
  const handleCompleteDay = async (dayNum: number) => {
    if (!challenge) return;
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để lưu tiến độ hoàn thành!");
      return;
    }

    const targetDay = days.find((d) => d.day === dayNum);
    const isCurrentlyCompleted = targetDay?.status === "completed";
    const nextStatus = isCurrentlyCompleted ? ("in_progress" as const) : ("completed" as const);
    const nextTaskCompletedState = !isCurrentlyCompleted;

    // Optimistic UI update
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.day === dayNum) {
          return {
            ...d,
            status: nextStatus,
            tasks: d.tasks.map((t) => ({ ...t, isCompleted: nextTaskCompletedState })),
          };
        }
        if (!isCurrentlyCompleted && d.day === dayNum + 1 && d.status === "locked") {
          return { ...d, status: "in_progress" as const };
        }
        return d;
      })
    );

    if (isCurrentlyCompleted) {
      toast.success(`Đã hủy hoàn thành Ngày ${dayNum}`);
    } else {
      toast.success(`🎉 Xuất sắc! Bạn đã hoàn thành Ngày ${dayNum}!`);
    }

    try {
      await challengeService.completeDay(slug, dayNum, !isCurrentlyCompleted);
    } catch {
      toast.error("Không thể lưu tiến độ ngày vào cơ sở dữ liệu.");
      // Revert if error
      setDays((prevDays) =>
        prevDays.map((d) => {
          if (d.day === dayNum) {
            return {
              ...d,
              status: isCurrentlyCompleted ? ("completed" as const) : ("in_progress" as const),
              tasks: d.tasks.map((t) => ({ ...t, isCompleted: isCurrentlyCompleted })),
            };
          }
          return d;
        })
      );
    }
  };

  const handleResetProgress = () => {
    if (!challenge) return;
    setDays(challenge.days);
    setSelectedDayNumber(1);
    toast.success("Đã làm mới hiển thị tiến độ!");
  };

  // Fetch full day details by ID with authorization check
  useEffect(() => {
    if (!activeDay?.id) return;
    let isMounted = true;

    challengeService
      .getDayDetailById(activeDay.id)
      .then((res) => {
        if (!isMounted || !res.data) return;
        const detail = res.data;
        setIsDayForbidden(false);

        setDays((prevDays) =>
          prevDays.map((d) => {
            if (d.day === detail.dayNumber) {
              const taskMap = new Map(d.tasks.map((t) => [t.id, t.isCompleted]));
              return {
                ...d,
                title: detail.title,
                content: detail.content,
                coreMission: detail.coreMission,
                whyLearn: detail.whyLearn,
                keyConcepts:
                  detail.keyConcepts && detail.keyConcepts.length > 0
                    ? detail.keyConcepts
                    : d.keyConcepts,
                tasks:
                  detail.tasks && detail.tasks.length > 0
                    ? detail.tasks.map((t) => ({
                        id: t.id,
                        title: t.title,
                        isCompleted: Boolean(taskMap.get(t.id)),
                      }))
                    : d.tasks,
              };
            }
            return d;
          })
        );
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err?.response?.status === 403) {
          setIsDayForbidden(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeDay?.id, isUnlockedAll, isEnrolled]);

  const handleUnlockStandalone = async () => {
    if (!challenge) return;
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thanh toán lộ trình!");
      return;
    }

    setPaymentModal({ isOpen: true, isLoading: true, data: null });
    try {
      const res = await paymentApi.createChallengePaymentLink(challenge.id);
      if (res.code === 200 || res.code === 201) {
        setPaymentModal({ isOpen: true, isLoading: false, data: res.data ?? null });
      } else {
        toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
        setPaymentModal({ isOpen: false, isLoading: false, data: null });
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Lỗi khi kết nối đến cổng thanh toán PayOS.");
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
    }
  };

  if (!mounted || isUserLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-8 animate-pulse space-y-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-48 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 h-96 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
            <div className="lg:col-span-7 h-96 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Yêu cầu đăng nhập để xem chi tiết
  if (mounted && !isUserLoading && !currentUser) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <AuthRequiredModal
          isOpen={true}
          onClose={() => router.push("/challenges")}
          redirectTo={`/challenges/${slug}`}
          title="Đăng nhập để xem chi tiết"
          message="Vui lòng đăng nhập tài khoản JavaBuilder để xem toàn bộ lộ trình và bắt đầu thử thách này."
        />
      </main>
    );
  }

  if (!challenge || error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-foreground">Không tìm thấy thử thách</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Thử thách này không tồn tại hoặc đã bị ẩn. Vui lòng quay lại danh sách thử thách.
        </p>
        <Link
          href="/challenges"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const isUserAdminOrPremium = (currentUser?.authorities || []).some(
    (role) => role === "ADMIN" || role.toUpperCase().includes("PREMIUM")
  );
  const isLockedByPaywall =
    !challenge.isFree &&
    !isUnlockedAll &&
    !isEnrolled &&
    !isUserAdminOrPremium &&
    (isDayForbidden || (!activeDay?.isFreePreview && selectedDayNumber > (challenge.freePreviewDays ?? 0)));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* 1. Header (Breadcrumb, Hero, Progress) */}
      <ChallengeHeader
        challenge={challenge}
        completedCount={completedCount}
        progressPercent={progressPercent}
      />

      {/* 2. Main Workspace */}
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:px-8 space-y-6">
        {/* Roadmap Navigator (Unified Single Card) */}
        <div className="rounded-2xl border border-gray-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <ChallengeToolbar
            challenge={challenge}
            activePhaseFilter={activePhaseFilter}
            setActivePhaseFilter={setActivePhaseFilter}
            onResetProgress={handleResetProgress}
            phaseOptions={phaseOptions}
            filteredCount={filteredDays.length}
          />

          <ChallengeDaysGrid
            days={filteredDays}
            totalDays={challenge.totalDays}
            freePreviewDays={challenge.freePreviewDays}
            selectedDayNumber={selectedDayNumber}
            onSelectDay={setSelectedDayNumber}
            isUnlockedAll={isUnlockedAll}
          />
        </div>

        {/* Bottom Workspace: Active Day Content or Paywall (Full Width) */}
        <div className="w-full">
          {isLockedByPaywall ? (
            <ChallengePaywallCard
              challenge={challenge}
              activeDay={activeDay}
              onUnlockStandalone={handleUnlockStandalone}
            />
          ) : (
            <ChallengeDayDetail
              activeDay={activeDay}
              totalDays={challenge.totalDays}
              isChallengeFree={challenge.isFree}
              onToggleTask={handleToggleTask}
              onCompleteDay={handleCompleteDay}
              onSelectDay={setSelectedDayNumber}
              onOpenDrawer={() => setIsSideDrawerOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Floating Right Button to Open Drawer */}
      {activeDay && !isLockedByPaywall && (
        <button
          type="button"
          onClick={() => setIsSideDrawerOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-accent hover:bg-accent/90 text-white pl-2.5 pr-2 py-3 rounded-l-xl shadow-lg hover:pl-3.5 transition-all flex flex-col items-center gap-1.5 cursor-pointer group border border-r-0 border-white/20 active:scale-95"
          title="Mở danh sách nhiệm vụ"
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-bold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Nhiệm vụ
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </button>
      )}

      {/* Side-over Right Drawer (Roadmap.sh Style) */}
      {activeDay && (
        <ChallengeSideDrawer
          isOpen={isSideDrawerOpen}
          onClose={() => setIsSideDrawerOpen(false)}
          activeDay={activeDay}
          totalDays={challenge.totalDays}
          onToggleTask={handleToggleTask}
          onCompleteDay={handleCompleteDay}
          onSelectDay={setSelectedDayNumber}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        isLoading={paymentModal.isLoading}
        data={paymentModal.data}
        courseTitle={challenge.title}
        onClose={() => setPaymentModal({ isOpen: false, isLoading: false, data: null })}
      />
    </main>
  );
}
