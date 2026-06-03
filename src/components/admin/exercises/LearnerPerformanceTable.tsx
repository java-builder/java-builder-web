import { formatReadableDateTime } from "@/utils/dateUtils";
import { Difficulty } from "@/types/exercise";
import { AttemptStatusBadge } from "@/components/admin/exercises/LearnerStatusBadge";
import { DifficultyBadge } from "./ExerciseBadges";

export interface LearnerPerformanceRecord {
  id: string;
  learnerName: string;
  email: string;
  exerciseKey: string;
  exerciseTitle: string;
  exerciseCategory: string;
  difficulty: Difficulty;
  attempts: number;
  bestScore: number;
  averageScore: number;
  completionRate: number;
  accuracy: number;
  lastAttempt: string;
  status: "PASSED" | "IN_PROGRESS" | "FAILED";
  timeSpent: string;
  incorrectTopics: string[];
}

interface LearnerPerformanceTableProps {
  records: LearnerPerformanceRecord[];
}

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 80) return "bg-emerald-500";
  if (accuracy >= 60) return "bg-amber-500";
  return "bg-rose-500";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "HV";

export const LearnerPerformanceTable = ({ records }: LearnerPerformanceTableProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Hiệu suất học viên</h3>
          <p className="text-sm text-gray-500">Theo dõi kết quả làm bài từ /my-exercises để kịp thời hỗ trợ.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {records.length} học viên
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Học viên</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Bài tập</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Điểm cao nhất</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Lần làm</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Độ chính xác</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Hoàn thành</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Lần cuối</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {records.map((record) => (
              <tr key={record.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent text-sm font-semibold text-white">
                      {getInitials(record.learnerName)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{record.learnerName}</div>
                      <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{record.exerciseTitle}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium">
                      {record.exerciseCategory}
                    </span>
                    <DifficultyBadge difficulty={record.difficulty} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{record.bestScore}/100</div>
                  <div className="text-xs text-gray-500">Trung bình {record.averageScore}/100</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="font-semibold">{record.attempts} lần</div>
                  <div className="text-xs text-gray-500">Thời gian {record.timeSpent}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${getAccuracyColor(record.accuracy)}`}
                        style={{ width: `${record.accuracy}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{record.accuracy}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-accent"
                        style={{ width: `${record.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{record.completionRate}%</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {record.completionRate === 100 ? "Đã hoàn thành toàn bộ bài tập" : "Còn câu hỏi chưa hoàn thành"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="font-semibold">{formatReadableDateTime(record.lastAttempt)}</div>
                  <div className="text-xs text-gray-500">Cập nhật gần nhất</div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <AttemptStatusBadge status={record.status} />
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Xem chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                  Không có học viên nào phù hợp với bộ lọc. Thử thay đổi điều kiện để xem dữ liệu khác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
