"use client";

import { ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useExercises } from "@/hooks/useExercises";
import { ExerciseFilters, Difficulty, ExerciseStatus } from "@/types/exercise";
import { ExerciseSummarySection } from "@/components/admin/exercises/ExerciseSummarySection";
import { ExerciseTable } from "@/components/admin/exercises/ExerciseTable";
import { LearnerFiltersPanel } from "@/components/admin/exercises/LearnerFiltersPanel";
import {
  LearnerPerformanceRecord as LearnerPerformanceRow,
  LearnerPerformanceTable,
} from "@/components/admin/exercises/LearnerPerformanceTable";

interface TabButtonProps {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ label, icon, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 md:px-5 ${
      isActive ? "border-accent text-accent" : "border-transparent text-gray-600 hover:text-gray-900"
    }`}
  >
    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${
      isActive ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-500"
    }`}
    >
      {icon}
    </span>
    {label}
  </button>
);

type LearnerPerformanceRecord = LearnerPerformanceRow;

const mockLearnerPerformance: LearnerPerformanceRecord[] = [
  {
    id: "learner-1",
    learnerName: "Nguyễn Văn A",
    email: "vana@javabuilder.dev",
    exerciseKey: "java-flow-control",
    exerciseTitle: "Điều kiện & Vòng lặp",
    exerciseCategory: "Trắc nghiệm",
    difficulty: Difficulty.MEDIUM,
    attempts: 3,
    bestScore: 92,
    averageScore: 86,
    completionRate: 100,
    accuracy: 88,
    lastAttempt: "2026-06-02T09:45:00Z",
    status: "PASSED",
    timeSpent: "28 phút",
    incorrectTopics: ["ArrayList", "Do-while"],
  },
  {
    id: "learner-2",
    learnerName: "Trần Thị Bích",
    email: "bich.tran@javabuilder.dev",
    exerciseKey: "spring-rest-api",
    exerciseTitle: "Thiết kế REST API",
    exerciseCategory: "Tự luận",
    difficulty: Difficulty.HARD,
    attempts: 4,
    bestScore: 68,
    averageScore: 61,
    completionRate: 74,
    accuracy: 55,
    lastAttempt: "2026-06-01T15:10:00Z",
    status: "FAILED",
    timeSpent: "41 phút",
    incorrectTopics: ["Validation", "Error handling", "Authentication"],
  },
  {
    id: "learner-3",
    learnerName: "Phạm Minh Châu",
    email: "chau.pham@javabuilder.dev",
    exerciseKey: "java-collections",
    exerciseTitle: "Làm việc với Collections",
    exerciseCategory: "Java cơ bản",
    difficulty: Difficulty.MEDIUM,
    attempts: 2,
    bestScore: 81,
    averageScore: 78,
    completionRate: 86,
    accuracy: 73,
    lastAttempt: "2026-06-02T07:20:00Z",
    status: "IN_PROGRESS",
    timeSpent: "32 phút",
    incorrectTopics: ["Comparator", "Stream filter"],
  },
  {
    id: "learner-4",
    learnerName: "Lê Quốc Dũng",
    email: "dung.le@javabuilder.dev",
    exerciseKey: "microservices-observability",
    exerciseTitle: "Giám sát Microservices",
    exerciseCategory: "Case study",
    difficulty: Difficulty.HARD,
    attempts: 5,
    bestScore: 77,
    averageScore: 69,
    completionRate: 62,
    accuracy: 59,
    lastAttempt: "2026-05-31T20:55:00Z",
    status: "FAILED",
    timeSpent: "55 phút",
    incorrectTopics: ["Tracing", "Circuit Breaker"],
  },
  {
    id: "learner-5",
    learnerName: "Đỗ Gia Hưng",
    email: "hung.do@javabuilder.dev",
    exerciseKey: "java-oop-basics",
    exerciseTitle: "Thực hành OOP",
    exerciseCategory: "Java cơ bản",
    difficulty: Difficulty.EASY,
    attempts: 1,
    bestScore: 95,
    averageScore: 95,
    completionRate: 100,
    accuracy: 92,
    lastAttempt: "2026-06-02T05:05:00Z",
    status: "PASSED",
    timeSpent: "24 phút",
    incorrectTopics: [],
  },
];

interface SelectOption {
  value: string;
  label: string;
  meta?: string;
}

const learnerExerciseOptions: SelectOption[] = [
  { value: "all", label: "Tất cả bài tập" },
  { value: "java-flow-control", label: "Điều kiện & Vòng lặp", meta: "Trắc nghiệm" },
  { value: "java-collections", label: "Làm việc với Collections", meta: "Trắc nghiệm" },
  { value: "spring-rest-api", label: "Thiết kế REST API", meta: "Tự luận" },
  { value: "microservices-observability", label: "Giám sát Microservices", meta: "Case study" },
  { value: "java-oop-basics", label: "Thực hành OOP", meta: "Thực hành mã" },
];

const difficultyOptions: SelectOption[] = [
  { value: "all", label: "Mọi độ khó" },
  { value: Difficulty.EASY, label: "Dễ" },
  { value: Difficulty.MEDIUM, label: "Trung bình" },
  { value: Difficulty.HARD, label: "Khó" },
];

type LearnerFiltersState = {
  exercise: "all" | string;
  difficulty: "all" | Difficulty;
};

export default function ExercisesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ExerciseFilters>({
    page: 1,
    size: 10,
  });
  const [activeTab, setActiveTab] = useState<"exerciseList" | "learnerTracking">("exerciseList");
  const [learnerFilters, setLearnerFilters] = useState<LearnerFiltersState>({
    exercise: "all",
    difficulty: "all",
  });
  const { data: exercisesData, isLoading } = useExercises(filters);

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

  const filteredLearners = useMemo(() => {
    return mockLearnerPerformance.filter((record) => {
      const exerciseMatch =
        learnerFilters.exercise === "all" || record.exerciseKey === learnerFilters.exercise;
      const difficultyMatch =
        learnerFilters.difficulty === "all" || record.difficulty === learnerFilters.difficulty;

      return exerciseMatch && difficultyMatch;
    });
  }, [learnerFilters]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const resetLearnerFilters = () => {
    setLearnerFilters({
      exercise: "all",
      difficulty: "all",
    });
  };

  const handleFilterChange = <K extends keyof LearnerFiltersState>(
    key: K,
    value: LearnerFiltersState[K]
  ) => {
    setLearnerFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trung tâm quản lý bài tập</h1>
          <p className="mt-1 text-sm text-gray-600">
            Theo dõi kho bài tập và kiểm soát tiến độ học viên thực hiện /exercises và /my-exercises.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/admin/exercises/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-105"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo bài tập mới
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex gap-4 border-b border-gray-200 bg-white px-6 pt-4 pb-2">
          <TabButton
            label="Kho bài tập"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
            }
            isActive={activeTab === "exerciseList"}
            onClick={() => setActiveTab("exerciseList")}
          />
          <TabButton
            label="Theo dõi học viên"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zM19 7a2 2 0 11-4 0 2 2 0 014 0zM9 7a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
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
              <LearnerFiltersPanel
                exerciseOptions={learnerExerciseOptions}
                difficultyOptions={difficultyOptions}
                selectedExercise={learnerFilters.exercise}
                selectedDifficulty={learnerFilters.difficulty}
                onExerciseChange={(value) =>
                  handleFilterChange("exercise", value as LearnerFiltersState["exercise"])
                }
                onDifficultyChange={(value) =>
                  handleFilterChange("difficulty", value as LearnerFiltersState["difficulty"])
                }
                onReset={resetLearnerFilters}
              />

              <LearnerPerformanceTable records={filteredLearners} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}