import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { CourseEnrollmentResponse } from "@/types/enrollment";
import EnrollmentStatusPill from "./EnrollmentStatusPill";
import { formatEnrollmentDate, getProgressTone } from "./helpers";

interface EnrollmentRowProps {
  enrollment: CourseEnrollmentResponse;
  onRemove: (enrollmentId: string, username: string) => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "U";

export default function EnrollmentRow({ enrollment, onRemove }: EnrollmentRowProps) {
  const progressTone = getProgressTone(enrollment.progress);

  return (
    <tr className="transition hover:bg-gray-50 dark:hover:bg-slate-700/40">
      {/* Student */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {enrollment.avatar ? (
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
              <Image
                src={enrollment.avatar}
                alt={enrollment.username}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent text-xs font-semibold text-white">
              {getInitials(enrollment.username)}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {enrollment.username}
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
              {enrollment.email}
            </div>
          </div>
        </div>
      </td>

      {/* Progress */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all ${progressTone.bar}`}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
          <span className={`text-sm font-semibold tabular-nums ${progressTone.text}`}>
            {enrollment.progress}%
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-4 py-3">
        <EnrollmentStatusPill
          completed={enrollment.completed}
          progress={enrollment.progress}
        />
      </td>

      {/* Enrolled at */}
      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-gray-600 dark:text-gray-300">
        {formatEnrollmentDate(enrollment.enrolledAt)}
      </td>

      {/* Action */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onRemove(enrollment.enrollmentId, enrollment.username)}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xoá
        </button>
      </td>
    </tr>
  );
}
