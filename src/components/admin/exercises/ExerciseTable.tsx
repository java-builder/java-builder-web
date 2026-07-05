import { ExerciseSummaryResponse, ExerciseStatus, ExerciseType, Difficulty } from "@/types/exercise";
import { PageResponse } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";
import { ExerciseStatusBadge, ExerciseTypeBadge, DifficultyBadge } from "./ExerciseBadges";
import { formatLocaleString } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";

interface ExerciseTableProps {
  isLoading: boolean;
  data?: PageResponse<ExerciseSummaryResponse> | null;
  onPageChange: (page: number) => void;
  onCreateNew: () => void;
}

const emptyStateIcon = (
  <svg className="h-12 w-12 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const ExerciseTable = ({ isLoading, data, onPageChange, onCreateNew }: ExerciseTableProps) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Độ khó</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Điểm tối đa</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ngày xuất bản</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-transparent">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-muted rounded w-24" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-muted rounded w-16" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-muted rounded w-16" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-muted rounded w-16" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-muted rounded w-20" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-3 bg-muted rounded w-28" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-14 text-center">
        {emptyStateIcon}
        <h3 className="mt-4 text-lg font-semibold text-foreground">Chưa có bài tập nào</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Khởi tạo những bài tập đầu tiên để giao cho học viên. Bạn có thể tái sử dụng ở trang /exercises và /my-exercises.
        </p>
        <Button
          onClick={onCreateNew}
          variant="accent"
          className="mt-6 gap-2 h-9"
        >
          + Tạo bài tập mới
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Độ khó</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Điểm tối đa</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ngày xuất bản</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-transparent">
            {data.data.map((exercise) => (
              <tr key={exercise.id} className="transition hover:bg-muted/25">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-foreground">{exercise.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{exercise.description || "Không có mô tả"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ExerciseTypeBadge type={exercise.exerciseType as ExerciseType} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DifficultyBadge difficulty={exercise.difficulty as Difficulty} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{exercise.timeLimit} phút</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">{exercise.maxScore} điểm</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ExerciseStatusBadge status={exercise.status as ExerciseStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">{formatLocaleString(exercise.publishedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totalElements > 0 && (
        <div className="px-6">
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            pageSize={data.pageSize}
            onPageChange={onPageChange}
            itemName="bài tập"
          />
        </div>
      )}
    </>
  );
};
