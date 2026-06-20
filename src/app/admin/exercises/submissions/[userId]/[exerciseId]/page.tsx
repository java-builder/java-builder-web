"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useUserExerciseSubmissions } from "@/hooks/useExerciseSubmissions";
import { Pagination } from "@/components/ui/Pagination";
import { SubmissionStatus } from "@/types/exercise-submission";
import {
  ExerciseInfoCard,
  SubmissionDetailModal,
  SubmissionsTable,
} from "@/components/admin/exercises/submissions";
import { Button } from "@/components/ui/button";

export default function UserExerciseSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const exerciseId = params.exerciseId as string;
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const { data: submissionsData, isLoading } = useUserExerciseSubmissions(
    userId,
    exerciseId,
    page,
    pageSize
  );

  const exerciseInfo = submissionsData?.data?.[0];
  const totalAttempts = submissionsData?.totalElements ?? 0;

  const stats = useMemo(() => {
    const data = submissionsData?.data ?? [];
    const completed = data.filter(
      (s) => s.submissionStatus !== SubmissionStatus.IN_PROGRESS
    );
    const scores = completed
      .map((s) => s.score ?? 0)
      .filter((value) => Number.isFinite(value));
    const bestScore = scores.length ? Math.max(...scores) : 0;
    const avgScore = scores.length
      ? Math.round((scores.reduce((sum, v) => sum + v, 0) / scores.length) * 10) / 10
      : 0;

    return {
      totalAttempts,
      completed: completed.length,
      bestScore,
      avgScore,
    };
  }, [submissionsData, totalAttempts]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="rounded-xl border border-border bg-card p-12">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin text-accent"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-3 gap-1.5 h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Lịch sử làm bài</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chi tiết tất cả các lần làm bài của học viên
        </p>
      </div>

      {exerciseInfo && <ExerciseInfoCard exercise={exerciseInfo} stats={stats} />}

      <SubmissionsTable
        submissions={submissionsData?.data ?? []}
        page={page}
        pageSize={pageSize}
        totalAttempts={totalAttempts}
        onView={setSelectedSubmissionId}
      />

      {submissionsData && submissionsData.totalPages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={submissionsData.totalPages}
          totalElements={submissionsData.totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          itemName="lần làm"
        />
      )}

      {selectedSubmissionId && (
        <SubmissionDetailModal
          submissionId={selectedSubmissionId}
          isOpen={!!selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
        />
      )}
    </div>
  );
}
