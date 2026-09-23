"use client";

import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Mail,
  User,
  Users,
} from "lucide-react";
import type { ScheduledJobResponse } from "@/types/scheduled-job";
import JobStatusPill from "./JobStatusPill";
import { formatJobDate } from "./helpers";

interface JobMobileCardProps {
  job: ScheduledJobResponse;
  onClick: (job: ScheduledJobResponse) => void;
}

export default function JobMobileCard({ job, onClick }: JobMobileCardProps) {
  const percentSent =
    job.totalRecipients && job.totalRecipients > 0 && job.sentCount != null
      ? Math.min(100, Math.round((job.sentCount / job.totalRecipients) * 100))
      : null;

  return (
    <div
      onClick={() => onClick(job)}
      className="group relative cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-accent/50 hover:shadow-md active:scale-[0.99]"
    >
      {/* Top row: Title + Status + Type */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-md border border-border/50 bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
              {job.type ?? job.jobType}
            </span>
            {job.recipientType && (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {job.recipientType}
              </span>
            )}
          </div>
          <h4
            className="mt-1.5 font-semibold text-sm text-foreground line-clamp-2"
            title={job.title || job.jobName}
          >
            {job.title || job.jobName}
          </h4>
        </div>
        <div className="flex-shrink-0">
          <JobStatusPill status={job.jobStatus} />
        </div>
      </div>

      {/* Email Subject if available */}
      {job.subject && (
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/70" />
          <span className="truncate">{job.subject}</span>
        </div>
      )}

      {/* Grid of Key Info: Schedule, Execution, Recipients, Created */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-border/60 pt-3 text-xs">
        {/* Scheduled time */}
        <div className="rounded-lg bg-muted/30 p-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <CalendarClock className="h-3 w-3 text-amber-500/80" />
            Lên lịch
          </span>
          <p className="mt-0.5 font-medium tabular-nums text-foreground">
            {formatJobDate(job.scheduledTime)}
          </p>
        </div>

        {/* Executed time */}
        <div className="rounded-lg bg-muted/30 p-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-emerald-500/80" />
            Thực thi
          </span>
          <p className="mt-0.5 font-medium tabular-nums text-foreground">
            {formatJobDate(job.executedAt)}
          </p>
        </div>

        {/* Recipients */}
        <div className="rounded-lg bg-muted/30 p-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Users className="h-3 w-3 text-blue-500/80" />
            Người nhận
          </span>
          <p className="mt-0.5 font-semibold tabular-nums text-foreground">
            {job.totalRecipients != null ? (
              <>
                {job.totalRecipients.toLocaleString("vi-VN")}{" "}
                <span className="text-[11px] font-normal text-muted-foreground">
                  người
                </span>
              </>
            ) : (
              "—"
            )}
          </p>
          {job.sentCount != null && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Đã gửi: {job.sentCount.toLocaleString("vi-VN")}
              {percentSent != null ? ` (${percentSent}%)` : ""}
            </p>
          )}
        </div>

        {/* Created at */}
        <div className="rounded-lg bg-muted/30 p-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Calendar className="h-3 w-3 text-muted-foreground/70" />
            Tạo lúc
          </span>
          <p className="mt-0.5 font-medium tabular-nums text-muted-foreground">
            {formatJobDate(job.createdAt)}
          </p>
        </div>
      </div>

      {/* Progress bar if sending in progress or completed */}
      {percentSent != null && (
        <div className="mt-2.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${percentSent}%` }}
            />
          </div>
        </div>
      )}

      {/* Sender if available */}
      {(job.senderName || job.senderEmail) && (
        <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground border-t border-border/40 pt-2">
          <div className="flex items-center gap-1 truncate">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {job.senderName || job.senderEmail}
            </span>
          </div>
          <div className="flex items-center gap-0.5 font-medium text-accent flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            <span>Chi tiết</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Bottom footer if no sender info */}
      {!job.senderName && !job.senderEmail && (
        <div className="mt-2.5 flex items-center justify-end text-[11px] font-medium text-accent border-t border-border/40 pt-2">
          <div className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>Xem chi tiết</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}
