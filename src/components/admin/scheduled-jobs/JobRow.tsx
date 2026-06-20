import type { ScheduledJobResponse } from "@/types/scheduled-job";
import JobStatusPill from "./JobStatusPill";
import { formatJobDate } from "./helpers";

interface JobRowProps {
  job: ScheduledJobResponse;
}

export default function JobRow({ job }: JobRowProps) {
  return (
    <tr className="transition hover:bg-muted/50">
      {/* Job */}
      <td className="px-4 py-3">
        <div className="line-clamp-1 text-sm font-semibold text-foreground" title={job.title}>
          {job.title || job.jobName}
        </div>
        {job.subject && (
          <div className="line-clamp-1 text-xs text-muted-foreground" title={job.subject}>
            {job.subject}
          </div>
        )}
      </td>

      {/* Type */}
      <td className="whitespace-nowrap px-4 py-3">
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/80 border border-border/40">
          {job.type ?? job.jobType}
        </span>
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-4 py-3">
        <JobStatusPill status={job.jobStatus} />
      </td>

      {/* Recipients */}
      <td className="hidden whitespace-nowrap px-4 py-3 text-right md:table-cell">
        {job.totalRecipients != null ? (
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {job.totalRecipients.toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-normal text-muted-foreground/60">người</span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground/60">—</span>
        )}
      </td>

      {/* Scheduled */}
      <td className="hidden whitespace-nowrap px-4 py-3 text-xs tabular-nums text-muted-foreground lg:table-cell">
        {formatJobDate(job.scheduledTime)}
      </td>

      {/* Executed */}
      <td className="hidden whitespace-nowrap px-4 py-3 text-xs tabular-nums text-muted-foreground lg:table-cell">
        {formatJobDate(job.executedAt)}
      </td>

      {/* Created */}
      <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-muted-foreground">
        {formatJobDate(job.createdAt)}
      </td>
    </tr>
  );
}
