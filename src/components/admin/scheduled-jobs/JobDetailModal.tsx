"use client";

import { useEffect } from "react";
import {
  CalendarClock,
  Clock,
  Hash,
  Mail,
  Users,
  X,
} from "lucide-react";
import type { ScheduledJobResponse } from "@/types/scheduled-job";
import JobStatusPill from "./JobStatusPill";
import { formatJobDate } from "./helpers";
import { Button } from "@/components/ui/button";

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl sm:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">
                Chi tiết Scheduled Job
              </h2>
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                <span>{job.id}</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {/* Job Summary Hero card */}
            <div className="border-b border-border bg-muted/20 px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold">
                    <Clock className="h-5 w-5 text-accent dark:text-accent-on-dark" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold text-foreground break-words">
                      {job.title || job.jobName}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <JobStatusPill status={job.jobStatus} />
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                          job.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            job.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                          }`}
                        />
                        {job.isActive ? "Đang bật" : "Đã tắt"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Type badge positioned on the right */}
                <div className="flex-shrink-0 pt-0.5">
                  <span className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-xs">
                    {job.type ?? job.jobType ?? "JOB"}
                  </span>
                </div>
              </div>

              {job.subject && (
                <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-card/80 p-2.5 text-xs text-muted-foreground border border-border/60">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-accent mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">Tiêu đề email: </span>
                    <span className="text-foreground/90">{job.subject}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Details sections */}
            <div className="divide-y divide-border px-6">
              {/* Recipients Section */}
              <DetailSection
                icon={<Users className="h-3.5 w-3.5 text-accent dark:text-accent-on-dark" />}
                title="Thông tin người nhận & gửi"
              >
                <DetailRow label="Tổng người nhận">
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {job.totalRecipients != null
                      ? `${job.totalRecipients.toLocaleString("vi-VN")} người`
                      : "—"}
                  </span>
                </DetailRow>

                {job.recipientType && (
                  <DetailRow label="Nhóm đối tượng">
                    <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                      {job.recipientType}
                    </span>
                  </DetailRow>
                )}

                {(job.senderName || job.senderEmail) && (
                  <DetailRow label="Người gửi">
                    <span className="text-xs font-medium text-foreground truncate max-w-[260px] inline-block">
                      {job.senderName ? `${job.senderName} ` : ""}
                      {job.senderEmail ? `<${job.senderEmail}>` : ""}
                    </span>
                  </DetailRow>
                )}
              </DetailSection>

              {/* Schedule & Timing Section */}
              <DetailSection
                icon={<CalendarClock className="h-3.5 w-3.5 text-accent dark:text-accent-on-dark" />}
                title="Thời gian & Lịch trình"
              >
                <DetailRow label="Lên lịch chạy">
                  <span className="text-xs font-medium tabular-nums text-foreground">
                    {formatJobDate(job.scheduledTime)}
                  </span>
                </DetailRow>

                <DetailRow label="Thời gian thực thi">
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {formatJobDate(job.executedAt)}
                  </span>
                </DetailRow>

                <DetailRow label="Ngày tạo">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatJobDate(job.createdAt)}
                  </span>
                </DetailRow>

                <DetailRow label="Cập nhật lần cuối">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatJobDate(job.updatedAt)}
                  </span>
                </DetailRow>
              </DetailSection>

              {/* System Info Section */}
              <DetailSection
                icon={<Clock className="h-3.5 w-3.5 text-accent dark:text-accent-on-dark" />}
                title="Thông tin hệ thống"
              >
                <DetailRow label="Job Name">
                  <span className="font-mono text-xs text-foreground select-all break-all">
                    {job.jobName}
                  </span>
                </DetailRow>

                <DetailRow label="Job Group">
                  <span className="font-mono text-xs text-muted-foreground">
                    {job.jobGroup}
                  </span>
                </DetailRow>
              </DetailSection>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-border bg-muted/20 px-6 py-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
          {icon}
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      <dl className="space-y-2.5">{children}</dl>
    </section>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
