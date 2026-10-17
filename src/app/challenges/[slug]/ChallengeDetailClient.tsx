"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { FilterOption } from "@/components/ui/FilterSelect";
import { Challenge, DayChallenge } from "../types";
import { adaptChallengeDetailResponseToUi } from "../data/challengeAdapter";
import { useChallengeBySlug } from "@/hooks/useChallenges";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import {
  ChallengeHeader,
  ChallengeToolbar,
  ChallengeDaysGrid,
  ChallengeDayDetail,
  ChallengePaywallCard,
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

  const storageKey = `jb_challenge_${slug}`;

  const [days, setDays] = useState<DayChallenge[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activePhaseFilter, setActivePhaseFilter] = useState<number | "all">("all");
  const [viewMode, setViewMode] = useState<"matrix" | "list">("matrix");
  const [isUnlockedAll, setIsUnlockedAll] = useState<boolean>(false);

  // Sync days when challenge loads
  useEffect(() => {
    if (challenge) {
      setDays(challenge.days);
    }
  }, [challenge]);

  // Load unlock state
  useEffect(() => {
    if (!slug) return;
    try {
      const savedUnlock = localStorage.getItem(`jb_challenge_unlocked_${slug}`);
      if (savedUnlock === "true") {
        setIsUnlockedAll(true);
      }
    } catch {
      // Ignore
    }
  }, [slug]);

  // Load from localStorage on client
  useEffect(() => {
    if (!challenge) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === challenge.totalDays) {
          setDays(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, [storageKey, challenge]);

  // Save to localStorage
  const saveDays = (newDays: DayChallenge[]) => {
    setDays(newDays);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newDays));
      } catch {
        // Ignore quota errors
      }
    }
  };

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
        label: `Tất cả ${challenge.totalDays} ngày (${challenge.phases.length} chặng)`,
        description: `Hiển thị toàn bộ lộ trình ${challenge.totalDays} ngày`,
      },
      ...challenge.phases.map((p) => ({
        value: p.id,
        label: `${p.badge}: ${p.title}`,
        description: `${p.dayRange} (${p.weekRange})`,
      })),
    ];
  }, [challenge]);

  // Filtered days list
  const filteredDays = useMemo(() => {
    return days.filter((d) => {
      return activePhaseFilter === "all" || d.phaseId === activePhaseFilter;
    });
  }, [days, activePhaseFilter]);

  // Toggle single task
  const handleToggleTask = (taskId: string) => {
    if (!activeDay) return;
    const newDays = days.map((d) => {
      if (d.day === activeDay.day) {
        const updatedTasks = d.tasks.map((t) =>
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        return { ...d, tasks: updatedTasks };
      }
      return d;
    });
    saveDays(newDays);
  };

  // Mark current day complete & unlock next
  const handleCompleteDay = (dayNum: number) => {
    if (!challenge) return;
    const newDays = days.map((d) => {
      if (d.day === dayNum) {
        return {
          ...d,
          status: "completed" as const,
          tasks: d.tasks.map((t) => ({ ...t, isCompleted: true })),
        };
      }
      if (d.day === dayNum + 1 && d.status === "locked") {
        return { ...d, status: "in_progress" as const };
      }
      return d;
    });

    saveDays(newDays);
    toast.success(`🎉 Xuất sắc! Bạn đã hoàn thành Ngày ${dayNum}!`);

    if (dayNum < challenge.totalDays) {
      setSelectedDayNumber(dayNum + 1);
    }
  };

  // Reset all progress
  const handleResetProgress = () => {
    if (!challenge) return;
    if (
      confirm("Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ của thử thách này không?")
    ) {
      saveDays(challenge.days);
      setSelectedDayNumber(1);
      toast.success("Đã đặt lại tiến độ thử thách!");
    }
  };

  const handleUnlockStandalone = () => {
    if (!challenge) return;
    setIsUnlockedAll(true);
    try {
      localStorage.setItem(`jb_challenge_unlocked_${challenge.slug}`, "true");
    } catch {
      // Ignore
    }
    toast.success(
      `Đã kích hoạt mua lẻ thành công lộ trình "${challenge.title}"!`
    );
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

  const isLockedByPaywall =
    !isUnlockedAll && selectedDayNumber > (challenge.freePreviewDays || 3);

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
        {/* Toolbar */}
        <ChallengeToolbar
          challenge={challenge}
          activePhaseFilter={activePhaseFilter}
          setActivePhaseFilter={setActivePhaseFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onResetProgress={handleResetProgress}
          phaseOptions={phaseOptions}
        />

        {/* 3. Split Workspace: Left = Days Grid/List, Right = Day Compass / Paywall */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Days Selector */}
          <div className="lg:col-span-5 space-y-3">
            <ChallengeDaysGrid
              days={filteredDays}
              totalDays={challenge.totalDays}
              freePreviewDays={challenge.freePreviewDays}
              selectedDayNumber={selectedDayNumber}
              onSelectDay={setSelectedDayNumber}
              viewMode={viewMode}
              isUnlockedAll={isUnlockedAll}
            />
          </div>

          {/* Right Column: Active Day Compass Detail or Paywall */}
          <div className="lg:col-span-7">
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
                onToggleTask={handleToggleTask}
                onCompleteDay={handleCompleteDay}
                onSelectDay={setSelectedDayNumber}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
