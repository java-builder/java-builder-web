"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { userActivityService } from "@/services/user-activity.service";
import { UserDailyActivity, ActivityType } from "@/types/user-activity";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";
import {
  DailyActivityHeader,
  DailyActivityStatsCards,
  DailyActivitySearchBar,
  DailyActivityTable,
  DailyActivityDetailModal,
} from "@/components/admin/daily-activities";

export default function AdminDailyActivitiesPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 350);

  const [selectedType, setSelectedType] = useState<ActivityType | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State
  const [selectedActivity, setSelectedActivity] = useState<UserDailyActivity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch activities from backend
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "adminDailyActivities",
      page,
      pageSize,
      selectedType,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      const res = await userActivityService.getAllActivities(
        page,
        pageSize,
        selectedType === "ALL" ? undefined : selectedType,
        fromDate || undefined,
        toDate || undefined
      );
      return res.data;
    },
  });

  // Fetch statistics from backend (CompletableFuture Virtual Threads API)
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["adminDailyActivityStats", fromDate, toDate],
    queryFn: async () => {
      const res = await userActivityService.getActivityStats(
        fromDate || undefined,
        toDate || undefined
      );
      return res.data;
    },
  });

  const rawActivities = useMemo(() => data?.data || [], [data?.data]);
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  // Client search filtering
  const filteredActivities = useMemo(() => {
    if (!debouncedSearch.trim()) return rawActivities;
    const q = debouncedSearch.trim().toLowerCase();
    return rawActivities.filter(
      (item) =>
        item.resourceTitle.toLowerCase().includes(q) ||
        (item.resourceSlug && item.resourceSlug.toLowerCase().includes(q))
    );
  }, [rawActivities, debouncedSearch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchStats()]);
      toast.success("Đã cập nhật hoạt động mới nhất");
    } catch {
      toast.error("Làm mới thất bại");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleViewDetail = (activity: UserDailyActivity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <DailyActivityHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing || isLoading}
      />

      {/* Metrics Summary Cards */}
      <DailyActivityStatsCards
        activities={rawActivities}
        totalElements={totalElements}
        stats={statsData}
        isLoading={isLoadingStats}
        hasDateFilter={Boolean(fromDate || toDate)}
      />

      {/* Filter and Search Bar */}
      <DailyActivitySearchBar
        search={searchQuery}
        debouncedSearch={debouncedSearch}
        selectedType={selectedType}
        fromDate={fromDate}
        toDate={toDate}
        onSearch={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        onTypeChange={(type) => {
          setSelectedType(type);
          setPage(1);
        }}
        onFromDateChange={(val) => {
          setFromDate(val);
          setPage(1);
        }}
        onToDateChange={(val) => {
          setToDate(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Activities Table & Mobile Cards */}
      <DailyActivityTable
        activities={filteredActivities}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
      />

      {/* Standard Pagination Component */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        itemName="hoạt động"
      />

      {/* Activity Detail Modal */}
      <DailyActivityDetailModal
        activity={selectedActivity}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}
