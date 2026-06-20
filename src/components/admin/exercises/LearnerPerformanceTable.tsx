import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { formatLocaleString } from "@/utils/dateUtils";
import { Difficulty } from "@/types/exercise";
import { SubmissionStatus } from "@/types/exercise-submission";
import { DifficultyBadge } from "./ExerciseBadges";
import { Button } from "@/components/ui/button";

export interface LearnerPerformanceRecord {
  id: string;
  learnerName: string;
  email: string;
  avatar?: string | null;
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
  status: SubmissionStatus;
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

const getAccuracyText = (accuracy: number) => {
  if (accuracy >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (accuracy >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Hiệu suất học viên</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Theo dõi kết quả làm bài để kịp thời hỗ trợ học viên
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {records.length} học viên
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Học viên
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Bài tập
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Điểm
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Lần làm
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Độ chính xác
              </th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                Lần gần nhất
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-transparent">
            {records.map((record, index) => (
              <tr key={`${record.id}-${index}`} className="transition hover:bg-muted/25">
                {/* Học viên */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {record.avatar ? (
                      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={record.avatar}
                          alt={record.learnerName}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent text-xs font-semibold text-white">
                        {getInitials(record.learnerName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {record.learnerName}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{record.email}</div>
                    </div>
                  </div>
                </td>

                {/* Bài tập */}
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground line-clamp-1">
                    {record.exerciseTitle}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <DifficultyBadge difficulty={record.difficulty} />
                  </div>
                </td>

                {/* Điểm */}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="text-sm font-bold tabular-nums text-foreground">
                    {record.bestScore}
                    <span className="text-xs font-normal text-muted-foreground">/100</span>
                  </div>
                </td>

                {/* Lần làm */}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="text-sm font-semibold tabular-nums text-foreground">
                    {record.attempts} <span className="text-xs font-normal text-muted-foreground">lần</span>
                  </div>
                  <div className="text-xs tabular-nums text-muted-foreground">
                    TB {record.timeSpent}/lần
                  </div>
                </td>

                {/* Độ chính xác */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${getAccuracyColor(record.accuracy)}`}
                        style={{ width: `${record.accuracy}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold tabular-nums ${getAccuracyText(record.accuracy)}`}
                    >
                      {record.accuracy}%
                    </span>
                  </div>
                </td>

                {/* Lần gần nhất */}
                <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-muted-foreground">
                  {formatLocaleString(record.lastAttempt)}
                </td>

                {/* Action */}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2.5 gap-1"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.href = `/admin/exercises/submissions/${record.id}/${record.exerciseKey}`;
                      }
                    }}
                  >
                    Xem
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
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
