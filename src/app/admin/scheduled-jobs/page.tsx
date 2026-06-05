"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { emailSchedulerService } from "@/services/email-scheduler.service";
import {
  JobStatus,
  JobType,
  ScheduledJobResponse,
} from "@/types/scheduled-job";
import { PageResponse } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";
import {
  JobFilters,
  JobStatsStrip,
  JobTable,
} from "@/components/admin/scheduled-jobs";

const PAGE_SIZE = 15;

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
        size: PAGE_SIZE,
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

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const hasActiveFilters = useMemo(
    () => Boolean(statusFilter || jobTypeFilter),
    [statusFilter, jobTypeFilter]
  );

  const handleStatusToggle = (status: JobStatus) => {
    setStatusFilter((prev) => (prev === status ? "" : status));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setJobTypeFilter("");
    setCurrentPage(1);
  };

  const jobs = data?.data ?? [];
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Scheduled Jobs
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Theo dõi tất cả các job đã chạy, đang chạy và sắp chạy trong hệ thống
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <JobStatsStrip
        jobs={jobs}
        totalElements={totalElements}
        activeStatus={statusFilter}
        onStatusToggle={handleStatusToggle}
      />

      {/* Filters */}
      <JobFilters
        jobType={jobTypeFilter}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading}
        onJobTypeChange={(value) => {
          setJobTypeFilter(value);
          setCurrentPage(1);
        }}
        onClear={handleClearFilters}
        onRefresh={fetchJobs}
      />

      {/* Table */}
      <JobTable
        jobs={jobs}
        isLoading={isLoading}
        totalElements={totalElements}
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          pageSize={data.pageSize}
          onPageChange={setCurrentPage}
          itemName="job"
        />
      )}
    </div>
  );
}
