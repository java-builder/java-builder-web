import { ExerciseSummaryResponse, ExerciseStatus, ExerciseType, Difficulty } from "@/types/exercise";
import { PageResponse } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ExerciseStatusBadge, ExerciseTypeBadge, DifficultyBadge } from "./ExerciseBadges";
import { formatReadableDate } from "@/utils/dateUtils";

interface ExerciseTableProps {
  isLoading: boolean;
  data?: PageResponse<ExerciseSummaryResponse> | null;
  onPageChange: (page: number) => void;
  onCreateNew: () => void;
}

const emptyStateIcon = (
  <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const ExerciseTable = ({ isLoading, data, onPageChange, onCreateNew }: ExerciseTableProps) => {
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/70 py-14 text-center">
        {emptyStateIcon}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Chưa có bài tập nào</h3>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Khởi tạo những bài tập đầu tiên để giao cho học viên. Bạn có thể tái sử dụng ở trang /exercises và /my-exercises.
        </p>
        <button
          onClick={onCreateNew}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow hover:bg-accent/90"
        >
          + Tạo bài tập mới
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Độ khó</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Điểm tối đa</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ngày xuất bản</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.data.map((exercise) => (
              <tr key={exercise.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{exercise.title}</div>
                  <div className="mt-1 text-xs text-gray-500">{exercise.description || "Không có mô tả"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ExerciseTypeBadge type={exercise.exerciseType as ExerciseType} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DifficultyBadge difficulty={exercise.difficulty as Difficulty} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exercise.timeLimit} phút</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{exercise.maxScore} điểm</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ExerciseStatusBadge status={exercise.status as ExerciseStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatReadableDate(exercise.publishedAt)}</td>
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
