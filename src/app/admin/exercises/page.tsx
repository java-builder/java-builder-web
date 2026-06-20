"use client";

import { ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookCopy,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useExercises } from "@/hooks/useExercises";
import { useExerciseSubmissions } from "@/hooks/useExerciseSubmissions";
import { ExerciseFilters, ExerciseStatus } from "@/types/exercise";
import { ExerciseSubmissionFilters, SubmissionStatus } from "@/types/exercise-submission";
import { ExerciseSummarySection } from "@/components/admin/exercises/ExerciseSummarySection";
import { ExerciseTable } from "@/components/admin/exercises/ExerciseTable";
import { LearnerPerformanceTable } from "@/components/admin/exercises/LearnerPerformanceTable";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";

interface TabButtonProps {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ label, icon, isActive, onClick }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition focus:outline-none ${
      isActive
        ? "text-accent"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-md transition ${
        isActive
          ? "bg-accent/10 text-accent"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {icon}
    </span>
    {label}
    {isActive && (
      <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-t-full bg-accent" />
    )}
  </button>
);

export default function ExercisesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ExerciseFilters>({
    page: 1,
    size: 10,
  });
  const [activeTab, setActiveTab] = useState<"exerciseList" | "learnerTracking">("exerciseList");
  const [learnerFilters, setLearnerFilters] = useState({
    exerciseTitle: "",
    keyword: "",
  });
  const [submissionFilters, setSubmissionFilters] = useState<ExerciseSubmissionFilters>({
    page: 1,
    size: 20,
  });

  const { data: exercisesData, isLoading } = useExercises(filters);
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useExerciseSubmissions(submissionFilters);

  // Helper function to format time spent
  const formatTimeSpent = (seconds: number): string => {
    if (seconds < 60) return `${seconds} giây`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
  };

  const exerciseSummary = useMemo(() => {
    const total = exercisesData?.totalElements ?? exercisesData?.data?.length ?? 0;
    const published =
      exercisesData?.data?.filter((exercise) => exercise.status === ExerciseStatus.PUBLISHED).length ?? 0;
    const draft =
      exercisesData?.data?.filter((exercise) => exercise.status === ExerciseStatus.DRAFT).length ?? 0;
    const archived =
      exercisesData?.data?.filter((exercise) => exercise.status === ExerciseStatus.ARCHIVED).length ?? 0;

    return { total, published, draft, archived };
  }, [exercisesData]);

  // Map API data to LearnerPerformanceRecord format
  const learnerPerformanceRecords = useMemo(() => {
    if (!submissionsData?.data) return [];

    return submissionsData.data.map((submission) => {
      // Làm tròn accuracy và score về 1 chữ số thập phân
      const accuracy = Math.round(submission.accuracy * 10) / 10;
      const score = accuracy; // Score and accuracy are the same from backend
      
      // Tính completion rate từ correctCount và totalQuestions
      const completionRate = submission.totalQuestions > 0 
        ? Math.round((submission.correctCount / submission.totalQuestions) * 1000) / 10
        : 0;
      
      // Determine status based on accuracy
      let status: SubmissionStatus;
      if (accuracy >= 70) {
        status = SubmissionStatus.PASSED;
      } else if (accuracy >= 40) {
        status = SubmissionStatus.COMPLETED;
      } else {
        status = SubmissionStatus.FAILED;
      }

      return {
        id: submission.userId, // Use userId as unique identifier
        learnerName: submission.username,
        email: submission.email,
        avatar: submission.avatar,
        exerciseKey: submission.exerciseId,
        exerciseTitle: submission.exerciseTitle,
        exerciseCategory: submission.exerciseType,
        difficulty: submission.difficulty,
        attempts: submission.attemptCount,
        bestScore: score,
        averageScore: score,
        completionRate: completionRate,
        accuracy: accuracy,
        lastAttempt: submission.lastSubmittedAt,
        status: status,
        timeSpent: formatTimeSpent(submission.averageTimeSeconds),
        incorrectTopics: [],
      };
    });
  }, [submissionsData]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSubmissionPageChange = (page: number) => {
    setSubmissionFilters((prev) => ({ ...prev, page }));
  };

  const handleSearchSubmissions = () => {
    setSubmissionFilters((prev) => ({
      ...prev,
      page: 1,
      exerciseTitle: learnerFilters.exerciseTitle || undefined,
      keyword: learnerFilters.keyword || undefined,
    }));
  };

  const resetLearnerFilters = () => {
    setLearnerFilters({
      exerciseTitle: "",
      keyword: "",
    });
    setSubmissionFilters({
      page: 1,
      size: 20,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trung tâm quản lý bài tập</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tạo và quản lý kho bài tập, đồng thời theo dõi tiến độ làm bài của học viên
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => router.push("/admin/exercises/create")}
            variant="accent"
            className="h-10 gap-2 shadow-sm"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo bài tập mới
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-1 border-b border-border bg-card px-4 pt-2">
          <TabButton
            label="Kho bài tập"
            icon={<BookCopy className="h-3.5 w-3.5" />}
            isActive={activeTab === "exerciseList"}
            onClick={() => setActiveTab("exerciseList")}
          />
          <TabButton
            label="Theo dõi học viên"
            icon={<Users className="h-3.5 w-3.5" />}
            isActive={activeTab === "learnerTracking"}
            onClick={() => setActiveTab("learnerTracking")}
          />
        </div>

        <div className="p-6 space-y-6">
          {activeTab === "exerciseList" ? (
            <>
              <ExerciseSummarySection summary={exerciseSummary} />
              <ExerciseTable
                isLoading={isLoading}
                data={exercisesData ?? null}
                onPageChange={handlePageChange}
                onCreateNew={() => router.push("/admin/exercises/create")}
              />
            </>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Bộ lọc</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:p-5">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Tiêu đề bài tập
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={learnerFilters.exerciseTitle}
                        onChange={(e) =>
                          setLearnerFilters((prev) => ({
                            ...prev,
                            exerciseTitle: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleSearchSubmissions()}
                        placeholder="Nhập tên bài tập..."
                        className="block w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Username hoặc email
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={learnerFilters.keyword}
                        onChange={(e) =>
                          setLearnerFilters((prev) => ({
                            ...prev,
                            keyword: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleSearchSubmissions()}
                        placeholder="Nhập username hoặc email..."
                        className="block w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetLearnerFilters}
                      className="gap-1.5 h-9"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Đặt lại
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      onClick={handleSearchSubmissions}
                      className="gap-1.5 h-9"
                    >
                      <Search className="h-4 w-4" />
                      Tìm kiếm
                    </Button>
                  </div>
                </div>
              </div>

              {isLoadingSubmissions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-accent"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
                  </div>
                </div>
              ) : (
                <>
                  <LearnerPerformanceTable records={learnerPerformanceRecords} />
                  
                  <Pagination
                    currentPage={submissionFilters.page || 1}
                    totalPages={submissionsData?.totalPages || 0}
                    totalElements={submissionsData?.totalElements || 0}
                    pageSize={submissionFilters.size || 20}
                    onPageChange={handleSubmissionPageChange}
                    itemName="bài làm"
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}