import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { CourseEnrollmentResponse } from "@/types/enrollment";
import EnrollmentStatusPill from "./EnrollmentStatusPill";
import { formatEnrollmentDate, getProgressTone } from "./helpers";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
    <TableRow className="transition-colors duration-200">
      {/* Student */}
      <TableCell className="px-4 py-3 align-middle max-w-[220px] truncate">
        <div className="flex items-center gap-3 min-w-0">
          {enrollment.avatar ? (
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-border">
              <Image
                src={enrollment.avatar}
                alt={enrollment.username}
                fill
                sizes="36px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-600 text-xs font-bold text-white">
              {getInitials(enrollment.username)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-foreground" title={enrollment.username}>
              {enrollment.username}
            </div>
            <div className="truncate text-xs text-muted-foreground" title={enrollment.email}>
              {enrollment.email}
            </div>
          </div>
        </div>
      </TableCell>

      {/* Progress */}
      <TableCell className="px-4 py-3 align-middle">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted border border-border/80">
            <div
              className={`h-full rounded-full transition-all ${progressTone.bar}`}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
          <span className={`text-xs font-bold tabular-nums ${progressTone.text}`}>
            {enrollment.progress}%
          </span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="px-4 py-3 align-middle">
        <EnrollmentStatusPill
          completed={enrollment.completed}
          progress={enrollment.progress}
        />
      </TableCell>

      {/* Enrolled at */}
      <TableCell className="px-4 py-3 align-middle text-sm tabular-nums text-muted-foreground">
        {formatEnrollmentDate(enrollment.enrolledAt)}
      </TableCell>

      {/* Action */}
      <TableCell className="px-4 py-3 align-middle text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(enrollment.enrollmentId, enrollment.username)}
          className="h-8 text-xs font-semibold border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Xóa
        </Button>
      </TableCell>
    </TableRow>
  );
}
