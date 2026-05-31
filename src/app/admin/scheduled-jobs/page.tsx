"use client";

import { useState, useEffect, useCallback } from "react";
import { emailSchedulerService } from "@/services/email-scheduler.service";
import { ScheduledJobResponse, JobStatus, JobType } from "@/types/scheduled-job";
import { PageResponse } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";

const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const STATUS_COLORS: Record<JobStatus, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  RUNNING:   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  FAILED:    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

const STATUS_LABELS: Record<JobStatus, string> = {
  PENDING:   "Chờ chạy",
  RUNNING:   "Đang chạy",
  COMPLETED: "Hoàn thành",
  FAILED:    "Thất bại",
  CANCELLED: "Đã hủy",
};

const STATUS_DOT: Record<JobStatus, string> = {
  PENDING:   "bg-yellow-400",
  RUNNING:   "bg-blue-500 animate-pulse",
  COMPLETED: "bg-green-500",
  FAILED:    "bg-red-500",
  CANCELLED: "bg-gray-400",
};

export default function ScheduledJobsPage() {
  const [data, setData] = useState<PageResponse<ScheduledJobResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "">("");

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await emailSchedulerService.getScheduledJobs({
        page: currentPage,
        size: 15,
        status: statusFilter || undefined,
        jobType: jobTypeFilter || undefined,
      });
      if (res.data) setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, jobTypeFilter]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scheduled Jobs</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Theo dõi tất cả các job đã chạy, đang chạy và sắp chạy trong hệ thống
          </p>
        </div>
        <button
          onClick={() => fetchJobs()}
          disabled={isLoading}
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {(["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"] as JobStatus[]).map((s) => {
          const count = data?.data.filter((j) => j.jobStatus === s).length ?? 0;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(statusFilter === s ? "" : s); setCurrentPage(1); }}
              className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm ring-1 p-4 text-left transition-all hover:shadow-md ${
                statusFilter === s ? "ring-accent" : "ring-gray-100 dark:ring-slate-700"
              }`}
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{STATUS_LABELS[s]}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
                {STATUS_LABELS[s]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={jobTypeFilter}
          onChange={(e) => { setJobTypeFilter(e.target.value as JobType | ""); setCurrentPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="">Tất cả loại</option>
          <option value="EMAIL">Email</option>
          <option value="NOTIFICATION">Notification</option>
          <option value="REPORT">Report</option>
          <option value="CLEANUP">Cleanup</option>
        </select>
        {(statusFilter || jobTypeFilter) && (
          <button
            onClick={() => { setStatusFilter(""); setJobTypeFilter(""); setCurrentPage(1); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Xóa bộ lọc ✕
          </button>
        )}
        {data && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-300">
            {data.totalElements} jobs
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-0 dark:border dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">
                <th className="px-4 py-3 min-w-[200px]">Job</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 hidden md:table-cell">Người nhận</th>
                <th className="px-4 py-3 hidden lg:table-cell min-w-[140px]">Lên lịch</th>
                <th className="px-4 py-3 hidden lg:table-cell min-w-[140px]">Thực thi</th>
                <th className="px-4 py-3 min-w-[140px]">Tạo lúc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : !data?.data?.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-300">
                    Không có job nào
                  </td>
                </tr>
              ) : (
                data.data.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={job.title}>
                        {job.title || job.jobName}
                      </p>
                      {job.subject && (
                        <p className="text-xs text-gray-400 truncate max-w-[200px]" title={job.subject}>
                          {job.subject}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                        {job.type ?? job.jobType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.jobStatus]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[job.jobStatus]}`} />
                        {STATUS_LABELS[job.jobStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-700 dark:text-gray-300">
                      {job.totalRecipients != null
                        ? <>{job.totalRecipients.toLocaleString()} <span className="text-gray-400 text-xs">người</span></>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 dark:text-gray-300">
                      {fmtDate(job.scheduledTime)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 dark:text-gray-300">
                      {fmtDate(job.executedAt)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                      {fmtDate(job.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-slate-700">
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              pageSize={data.pageSize}
              onPageChange={setCurrentPage}
              itemName="jobs"
            />
          </div>
        )}
      </div>
    </div>
  );
}
