"use client";

import { Users, Loader2 } from "lucide-react";
import type { CourseEnrollmentResponse } from "@/types/enrollment";
import EnrollmentRow from "./EnrollmentRow";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface EnrollmentsTableProps {
  enrollments: CourseEnrollmentResponse[];
  isLoading: boolean;
  totalElements: number;
  hasFilter: boolean;
  onRemove: (enrollmentId: string, username: string) => void;
}

const COLUMN_HEADERS: { label: string; align?: "left" | "right" }[] = [
  { label: "Học viên" },
  { label: "Tiến độ" },
  { label: "Trạng thái" },
  { label: "Ngày đăng ký" },
  { label: "Thao tác", align: "right" },
];

export default function EnrollmentsTable({
  enrollments,
  isLoading,
  totalElements,
  hasFilter,
  onRemove,
}: EnrollmentsTableProps) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách học viên
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Theo dõi tiến độ và quản lý từng học viên trong khoá học
          </p>
        </div>
        {totalElements > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:text-accent-on-dark">
            {totalElements.toLocaleString("vi-VN")} học viên
          </span>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {COLUMN_HEADERS.map((col) => (
              <TableHead
                key={col.label}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && enrollments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_HEADERS.length}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  Đang tải...
                </div>
              </TableCell>
            </TableRow>
          ) : enrollments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMN_HEADERS.length} className="px-4 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {hasFilter
                    ? "Không tìm thấy học viên phù hợp"
                    : "Chưa có học viên nào đăng ký"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {hasFilter
                    ? "Thử thay đổi từ khoá tìm kiếm"
                    : "Học viên đăng ký khoá học sẽ hiển thị tại đây"}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            enrollments.map((enrollment) => (
              <EnrollmentRow
                key={enrollment.enrollmentId}
                enrollment={enrollment}
                onRemove={onRemove}
              />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
