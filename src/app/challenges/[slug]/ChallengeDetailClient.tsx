"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
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
  ChallengeDayDetailSkeleton,
  ChallengePageSkeleton,
  ChallengePaywallCard,
  ChallengeSideDrawer,
  ChallengePurchaseSidebar,
  PremiumUpgradeModal,
} from "@/components/challenges";

interface Props {
  challenge?: Challenge;
}

export default function ChallengeDetailClient({ challenge: initialChallenge }: Props) {
  const params = useParams();
  const slug = (params?.slug as string) || initialChallenge?.slug || "";

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlDay = Number(urlParams.get("day"));
      if (urlDay && urlDay > 0) {
        setSelectedDayNumber(urlDay);
      }
    }
  }, []);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlDay = Number(urlParams.get("day"));
      if (urlDay && urlDay > 0) {
        setSelectedDayNumber(urlDay);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [days, setDays] = useState<DayChallenge[]>([]);

  const { data: challengeData, isLoading, isFetching, error } = useChallengeBySlug(
    initialChallenge ? "" : slug,
    selectedDayNumber
  );

  const challenge: Challenge | null = useMemo(() => {
    if (initialChallenge) return initialChallenge;
    if (challengeData) return adaptChallengeDetailResponseToUi(challengeData);
    return null;
  }, [initialChallenge, challengeData]);

  const [activePhaseFilter, setActivePhaseFilter] = useState<number | "all">("all");
  const [isPhaseChanging, setIsPhaseChanging] = useState<boolean>(false);
  const [isUnlockedAll, setIsUnlockedAll] = useState<boolean>(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState<boolean>(true);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDayForbidden, setIsDayForbidden] = useState<boolean>(false);
  const [isDayDetailLoading, setIsDayDetailLoading] = useState<boolean>(false);
  const [premiumUpgradeModalOpen, setPremiumUpgradeModalOpen] = useState<boolean>(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    data: CreatePaymentResponse | null;
  }>({
    isOpen: false,
    isLoading: false,
    data: null,
  });

  // Sync days when challenge loads & merge current day details
  useEffect(() => {
    if (challenge) {
      setDays((prevDays) => {
        if (prevDays.length === 0 || prevDays.length !== challenge.days.length) {
          const prevMap = new Map(prevDays.map((d) => [d.day, d]));
          return challenge.days.map((cd) => {
            const prev = prevMap.get(cd.day);
            if (!prev) return cd;
            return {
              ...cd,
              content: cd.content || prev.content,
              status: prev.status,
              tasks: cd.tasks.map((ft) => {
                const prevTask = prev.tasks.find((pt) => pt.id === ft.id);
                return {
                  ...ft,
                  isCompleted: prevTask ? prevTask.isCompleted : ft.isCompleted,
                };
              }),
            };
          });
        }
        // Merge cập nhật thông tin bài học từ challenge mới fetch
        return prevDays.map((d) => {
          const freshDay = challenge.days.find((cd) => cd.day === d.day);
          if (freshDay && freshDay.content) {
            return {
              ...d,
              ...freshDay,
              phaseId: d.phaseId ?? freshDay.phaseId,
              status: d.status,
              tasks: freshDay.tasks.map((ft) => {
                const prevTask = d.tasks.find((pt) => pt.id === ft.id);
                return {
                  ...ft,
                  isCompleted: prevTask ? prevTask.isCompleted : ft.isCompleted,
                };
              }),
            };
          }
          return d;
        });
      });
    }
  }, [challenge]);

  // Sync enrollment status from challenge data when loaded
  useEffect(() => {
    if (challenge?.isEnrolled !== undefined) {
      if (challenge.isEnrolled) {
        setIsEnrolled(true);
        setIsCheckingEnrollment(false);
      }
    }
  }, [challenge?.isEnrolled]);

  // Check enrollment status (never auto-enroll on load)
  useEffect(() => {
    if (!currentUser) {
      setIsCheckingEnrollment(false);
      setIsEnrolled(false);
      return;
    }
    if (!challenge?.id) return;

    if (challenge.isEnrolled) {
      setIsEnrolled(true);
      setIsCheckingEnrollment(false);
      return;
    }

    let isMounted = true;
    setIsCheckingEnrollment(true);
    challengeService
      .checkEnrollment(challenge.id)
      .then((res) => {
        if (!isMounted) return;
        setIsEnrolled(Boolean(res.data));
      })
      .catch(() => {
        if (!isMounted) return;
      })
      .finally(() => {
        if (isMounted) setIsCheckingEnrollment(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser, challenge?.id, challenge?.isEnrolled]);

  // Listen to WebSocket payment success
  useEffect(() => {
    const handlePaymentSuccess = () => {
      setIsEnrolled(true);
      setIsUnlockedAll(true);
      setIsDayForbidden(false);
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
    };

    window.addEventListener("payment:success", handlePaymentSuccess);
    return () => window.removeEventListener("payment:success", handlePaymentSuccess);
  }, []);

  // Load progress from DB when user and challenge are ready and enrolled
  useEffect(() => {
    if (!currentUser || !slug || !isEnrolled) return;
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
            const freeDays = challenge?.freePreviewDays ?? 0;
            const prevDayCompleted = daySet.has(d.day - 1);
            const isUnlocked = d.day === 1 || d.day <= freeDays || Boolean(d.isFreePreview) || prevDayCompleted;

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

        // If no day specified in URL, automatically navigate to the latest in-progress day from API
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          if (!urlParams.get("day") && completedDayNumbers && completedDayNumbers.length > 0) {
            const nextDay = Math.max(...completedDayNumbers) + 1;
            setSelectedDayNumber(nextDay);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load challenge progress from DB:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser, slug, challenge, isEnrolled]);

  // Stats
  const completedCount = useMemo(() => {
    return days.filter((d) => d.status === "completed").length;
  }, [days]);

  const progressPercent = useMemo(() => {
    if (!challenge || challenge.totalDays === 0) return 0;
    return Math.round((completedCount / challenge.totalDays) * 100);
  }, [completedCount, challenge]);

  const activeDay = useMemo(() => {
    const list = days.length > 0 ? days : challenge?.days || [];
    return list.find((d) => d.day === selectedDayNumber) || list[0];
  }, [days, challenge?.days, selectedDayNumber]);

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
        description: p.daysNumber && p.daysNumber.length > 0 ? `${p.daysNumber.length} ngày học` : undefined,
      })),
    ];
  }, [challenge, days.length]);

  // Filtered days list
  const filteredDays = useMemo(() => {
    return days.filter((d) => {
      return activePhaseFilter === "all" || d.phaseId === activePhaseFilter;
    });
  }, [days, activePhaseFilter]);

  const handleSelectDay = useCallback((dayNum: number) => {
    setSelectedDayNumber(dayNum);
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("day", String(dayNum));
        window.history.replaceState(null, "", url.toString());
      } catch {
        // ignore
      }
    }
  }, []);

  // Khi chuyển phase filter, lấy danh sách ngày của phase và tự động chọn ngày đầu tiên với skeleton mượt mà
  const handlePhaseFilterChange = useCallback(
    async (newPhaseFilter: number | "all") => {
      if (newPhaseFilter === activePhaseFilter) return;

      setIsPhaseChanging(true);
      setActivePhaseFilter(newPhaseFilter);

      try {
        if (newPhaseFilter === "all") {
          if (days.length > 0 && !days.some((d) => d.day === selectedDayNumber)) {
            handleSelectDay(days[0].day);
          }
        } else {
          const targetPhase = challenge?.phases.find((p) => p.id === newPhaseFilter);
          let phaseDaysNumbers: number[] = targetPhase?.daysNumber || [];

          if (targetPhase?.phaseId && phaseDaysNumbers.length === 0) {
            try {
              const res = await challengeService.getPhaseDetailById(targetPhase.phaseId);
              const phaseDetail = res.data;
              if (phaseDetail?.daysNumber && phaseDetail.daysNumber.length > 0) {
                phaseDaysNumbers = phaseDetail.daysNumber;
                targetPhase.daysNumber = phaseDetail.daysNumber;
              }
            } catch (err) {
              console.error("Lỗi khi tải chi tiết giai đoạn:", err);
            }
          }

          if (phaseDaysNumbers.length > 0) {
            const phaseDaysSet = new Set(phaseDaysNumbers);
            setDays((prevDays) =>
              prevDays.map((d) => ({
                ...d,
                phaseId: phaseDaysSet.has(d.day) ? newPhaseFilter : d.phaseId,
              }))
            );
            const firstDay = Math.min(...phaseDaysNumbers);
            handleSelectDay(firstDay);
          } else {
            // Fallback nếu đã có sẵn trong days state
            const phaseDays = days.filter((d) => d.phaseId === newPhaseFilter);
            if (phaseDays.length > 0) {
              const firstDayOfPhase = Math.min(...phaseDays.map((d) => d.day));
              handleSelectDay(firstDayOfPhase);
            }
          }
        }
      } finally {
        setTimeout(() => {
          setIsPhaseChanging(false);
        }, 120);
      }
    },
    [activePhaseFilter, challenge?.phases, days, selectedDayNumber, handleSelectDay]
  );

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
    handleSelectDay(1);
    toast.success("Đã làm mới hiển thị tiến độ!");
  };

  // Clamp selected day if it exceeds totalDays once challenge loads
  useEffect(() => {
    if (challenge && challenge.totalDays > 0 && selectedDayNumber > challenge.totalDays) {
      handleSelectDay(challenge.totalDays);
    }
  }, [challenge, selectedDayNumber, handleSelectDay]);

  // Fetch full day details by ID with authorization check on demand (for both free preview & enrolled users)
  useEffect(() => {
    if (!activeDay?.id) return;
    if (activeDay.content) {
      setIsDayForbidden(false);
      return;
    }
    let isMounted = true;
    setIsDayDetailLoading(true);

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
                      resourceLinks: t.resourceLinks || [],
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
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          setIsDayForbidden(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsDayDetailLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeDay?.id, activeDay?.content, isUnlockedAll, isEnrolled]);

  const handleUnlockStandalone = async () => {
    if (!challenge) return;
    if (!currentUser) {
      setIsAuthModalOpen(true);
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

  const handleOpenPremiumModal = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setPremiumUpgradeModalOpen(true);
  };

  const handleEnroll = async () => {
    if (!challenge) return;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isEnrolled) return;

    const isUserAdminOrPremium = (currentUser?.authorities || []).some(
      (role) => role === "ADMIN" || role.toUpperCase().includes("PREMIUM")
    );

    if (challenge.isFree || isUserAdminOrPremium) {
      setIsEnrolling(true);
      try {
        await challengeService.enrollFree(challenge.id);
        setIsEnrolled(true);
        setIsUnlockedAll(true);
        setIsDayForbidden(false);
      } catch (err: unknown) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        const msg =
          errorResponse?.response?.data?.message ||
          "Không thể đăng ký tham gia thử thách. Vui lòng thử lại!";
        toast.error(msg);
      } finally {
        setIsEnrolling(false);
      }
      return;
    }

    handleUnlockStandalone();
  };

  if (!mounted || isUserLoading || (isLoading && !challenge)) {
    return <ChallengePageSkeleton />;
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

  const hasFullAccess = isEnrolled || isUserAdminOrPremium || Boolean(challenge.isFree);

  const isActiveDayFree =
    Boolean(challenge.isFree) || Boolean(activeDay?.isFreePreview);

  const isLockedByPaywall =
    !hasFullAccess &&
    !isUnlockedAll &&
    (isDayForbidden || !isActiveDayFree);

  const isContentLoading =
    isPhaseChanging ||
    isDayDetailLoading ||
    (isFetching && (!activeDay || !activeDay.content));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* 1. Header (Breadcrumb, Hero, Progress or CTA) */}
      <ChallengeHeader
        challenge={challenge}
        completedCount={completedCount}
        progressPercent={progressPercent}
        isEnrolled={isEnrolled}
        onEnroll={handleEnroll}
        isEnrolling={isEnrolling}
      />

      {/* 2. Main Workspace */}
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:px-8 space-y-6">
        {!hasFullAccess ? (
          /* PREVIEW MODE FOR GUEST / NON-PRO USERS: 2-COLUMN LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT COLUMN (2 COLS): Bản đồ n ngày học + Lộ trình chi tiết theo Phase */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Bản đồ N ngày học (Roadmap Navigator Card chuẩn style hệ thống) */}
              <div className="relative z-20 rounded-xl border border-gray-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <ChallengeToolbar
                  challenge={challenge}
                  activePhaseFilter={activePhaseFilter}
                  setActivePhaseFilter={handlePhaseFilterChange}
                  onResetProgress={handleResetProgress}
                  phaseOptions={phaseOptions}
                  filteredCount={filteredDays.length}
                  isEnrolled={false}
                  isLoading={isPhaseChanging}
                />

                <ChallengeDaysGrid
                  days={filteredDays}
                  totalDays={challenge.totalDays}
                  selectedDayNumber={selectedDayNumber}
                  onSelectDay={handleSelectDay}
                  isUnlockedAll={isUnlockedAll}
                  isChallengeFree={challenge.isFree}
                  isEnrolled={false}
                  isLoading={isPhaseChanging}
                />
              </div>

              {/* 2. Nội dung bài học ngày đang chọn (Trực tiếp trên trang) */}
              <div className="w-full">
                {isContentLoading || !activeDay ? (
                  <ChallengeDayDetailSkeleton />
                ) : isLockedByPaywall ? (
                  <ChallengePaywallCard
                    challenge={challenge}
                    activeDay={activeDay}
                    onUnlockStandalone={handleUnlockStandalone}
                    onOpenPremiumModal={handleOpenPremiumModal}
                  />
                ) : (
                  <ChallengeDayDetail
                    activeDay={activeDay}
                    totalDays={challenge.totalDays}
                    isChallengeFree={challenge.isFree}
                    isEnrolled={false}
                    onToggleTask={handleToggleTask}
                    onCompleteDay={handleCompleteDay}
                    onSelectDay={handleSelectDay}
                    onOpenDrawer={() => setIsSideDrawerOpen(true)}
                  />
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (1 COL): Phần tham gia khóa học (Sticky Sidebar) */}
            <div className="lg:col-span-1">
              <ChallengePurchaseSidebar
                challenge={challenge}
                onUnlockStandalone={handleUnlockStandalone}
                onOpenPremiumModal={handleOpenPremiumModal}
              />
            </div>
          </div>
        ) : (
          /* ENROLLED / FULL ACCESS LEARNING WORKSPACE */
          <>
            {/* Roadmap Navigator (Unified Single Card) */}
            <div className="relative z-20 rounded-xl border border-gray-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <ChallengeToolbar
                challenge={challenge}
                activePhaseFilter={activePhaseFilter}
                setActivePhaseFilter={handlePhaseFilterChange}
                onResetProgress={handleResetProgress}
                phaseOptions={phaseOptions}
                filteredCount={filteredDays.length}
                isEnrolled={isEnrolled}
                isLoading={isPhaseChanging}
              />

              <ChallengeDaysGrid
                days={filteredDays}
                totalDays={challenge.totalDays}
                selectedDayNumber={selectedDayNumber}
                onSelectDay={handleSelectDay}
                isUnlockedAll={isUnlockedAll}
                isChallengeFree={challenge.isFree}
                isEnrolled={isEnrolled}
                isLoading={isPhaseChanging}
              />
            </div>

            {/* Bottom Workspace: Day Content / Paywall */}
            <div className="w-full">
              {isContentLoading || (isCheckingEnrollment && currentUser) || !activeDay ? (
                <ChallengeDayDetailSkeleton />
              ) : isLockedByPaywall ? (
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
                  isEnrolled={true}
                  onToggleTask={handleToggleTask}
                  onCompleteDay={handleCompleteDay}
                  onSelectDay={handleSelectDay}
                  onOpenDrawer={() => setIsSideDrawerOpen(true)}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Right Button to Open Drawer (When day is active & not locked) */}
      {activeDay && !isLockedByPaywall && (
        <button
          type="button"
          onClick={() => setIsSideDrawerOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-accent hover:bg-accent/90 text-white pl-2.5 pr-2 py-3 rounded-l-lg shadow-lg hover:pl-3.5 transition-all flex flex-col items-center gap-1.5 cursor-pointer group border border-r-0 border-white/20 active:scale-95"
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
          onSelectDay={handleSelectDay}
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

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={premiumUpgradeModalOpen}
        onClose={() => setPremiumUpgradeModalOpen(false)}
        challengeTitle={challenge.title}
        challengePrice={challenge.price}
        onBuyStandalone={async () => {
          setPremiumUpgradeModalOpen(false);
          await handleUnlockStandalone();
        }}
        onSuccess={() => {
          setIsEnrolled(true);
        }}
      />

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo={`/challenges/${slug}`}
        title="Đăng nhập để tham gia thử thách"
        message="Vui lòng đăng nhập tài khoản JavaBuilder để tham gia thử thách và bắt đầu lộ trình học tập."
      />
    </main>
  );
}
