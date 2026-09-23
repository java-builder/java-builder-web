"use client";

import { useEffect } from "react";
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  Hash,
  Mail,
  User,
  Users,
  X,
} from "lucide-react";
import type { ScheduledJobResponse } from "@/types/scheduled-job";
import JobStatusPill from "./JobStatusPill";
import { formatJobDate } from "./helpers";

interface JobDetailModalProps {
  job: ScheduledJobResponse;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const percentSent =
    job.totalRecipients && job.totalRecipients > 0 && job.sentCount != null
      ? Math.min(100, Math.round((job.sentCount / job.totalRecipients) * 100))
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card px-5 py-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">
                Chi tiết Scheduled Job
              </h2>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span className="font-mono tabular-nums">{job.id}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-5 space-y-5">
            {/* Hero Block */}
            <div className="rounded-xl border border-border bg-gradient-to-br from-accent/5 to-transparent p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md border border-border/60 bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground/80">
                    {job.type ?? job.jobType}
                  </span>
                  <JobStatusPill status={job.jobStatus} />
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${job.isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                  >
                    {job.isActive ? "Đang bật" : "Đã tắt"}
                  </span>
                </div>
              </div>

              <h3 className="mt-2.5 text-base font-bold text-foreground">
                {job.title || job.jobName}
              </h3>

              {job.subject && (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-card/80 p-2.5 text-xs text-muted-foreground border border-border/50">
                  <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground/70 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">Tiêu đề email: </span>
                    <span>{job.subject}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recipients & Delivery Section */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <Users className="h-3.5 w-3.5 text-accent" />
                Thông tin người nhận & gửi
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <span className="text-muted-foreground">Tổng người nhận</span>
                  <p className="mt-1 text-base font-bold tabular-nums text-foreground">
                    {job.totalRecipients != null
                      ? `${job.totalRecipients.toLocaleString("vi-VN")} người`
                      : "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <span className="text-muted-foreground">Đã gửi thành công</span>
                  <p className="mt-1 text-base font-bold tabular-nums text-foreground">
                    {job.sentCount != null
                      ? `${job.sentCount.toLocaleString("vi-VN")} người`
                      : "—"}
                  </p>
                </div>
              </div>

              {percentSent != null && (
                <div className="mt-3 rounded-xl border border-border/70 bg-muted/20 p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Tiến độ phát tán</span>
                    <span className="font-semibold text-foreground">{percentSent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${percentSent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {job.recipientType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 border border-border/40">
                    <span className="text-muted-foreground">Nhóm đối tượng</span>
                    <span className="font-medium text-foreground">{job.recipientType}</span>
                  </div>
                )}
                {(job.senderName || job.senderEmail) && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 border border-border/40 sm:col-span-2">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-3 w-3" />
                      Người gửi
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[240px] sm:max-w-none">
                      {job.senderName ? `${job.senderName} ` : ""}
                      {job.senderEmail ? `<${job.senderEmail}>` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule & Timing Section */}
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <Clock className="h-3.5 w-3.5 text-accent" />
                Thời gian & Lịch trình
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <CalendarClock className="h-3 w-3 text-amber-500" />
                    Lên lịch chạy
                  </span>
                  <p className="mt-1 font-semibold tabular-nums text-foreground">
                    {formatJobDate(job.scheduledTime)}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Thời gian thực thi
                  </span>
                  <p className="mt-1 font-semibold tabular-nums text-foreground">
                    {formatJobDate(job.executedAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Ngày tạo
                  </span>
                  <p className="mt-1 font-semibold tabular-nums text-foreground">
                    {formatJobDate(job.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Cập nhật lần cuối
                  </span>
                  <p className="mt-1 font-semibold tabular-nums text-foreground">
                    {formatJobDate(job.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="rounded-xl border border-border/60 bg-muted/10 p-3.5 text-xs space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-muted-foreground">Job Name</span>
                <span className="font-mono text-foreground select-all">{job.jobName}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-muted-foreground">Job Group</span>
                <span className="font-mono text-foreground">{job.jobGroup}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-border bg-muted/10 px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
