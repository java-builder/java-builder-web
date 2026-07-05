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
      <div className="p-6 space-y-6 animate-pulse max-w-7xl mx-auto bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center">
          <div className="space-y-2 flex-grow">
            <div className="h-7 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-10 bg-muted rounded w-28 shrink-0" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4 h-[500px]" />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4 h-[500px]" />
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
