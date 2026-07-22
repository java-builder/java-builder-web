"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userStreakService } from "@/services/user-streak.service";
import { AdminUserStreak, StreakStatus } from "@/types/user-streak";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";

import { UserStreakHeader } from "@/components/admin/user-streaks/UserStreakHeader";
import { UserStreakStatsCards } from "@/components/admin/user-streaks/UserStreakStatsCards";
import { UserStreakSearchBar } from "@/components/admin/user-streaks/UserStreakSearchBar";
import { UserStreakTable } from "@/components/admin/user-streaks/UserStreakTable";
import { UserStreakReminderModal } from "@/components/admin/user-streaks/UserStreakReminderModal";

export default function AdminUserStreaksPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedStatus, setSelectedStatus] = useState<StreakStatus | "ALL">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal States
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [targetReminderUser, setTargetReminderUser] = useState<AdminUserStreak | null>(null);

  // Fetch Streaks
  const { data: streaksData, isLoading, refetch } = useQuery({
    queryKey: ["adminUserStreaks", page, pageSize, debouncedSearch, selectedStatus],
    queryFn: async () => {
      const res = await userStreakService.getAdminUserStreaks(
        page,
        pageSize,
        debouncedSearch,
        selectedStatus
      );
      return res.data;
    },
  });

  // Fetch Overview Stats
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["adminStreakStats"],
    queryFn: async () => {
      const res = await userStreakService.getStreakStats();
      return res.data;
    },
  });

  const streaksList = streaksData?.data || [];
  const totalElements = streaksData?.totalElements || 0;
  const totalPages = streaksData?.totalPages || 1;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchStats()]);
      toast.success("Đã cập nhật dữ liệu Streak mới nhất");
    } catch {
      toast.error("Làm mới thất bại");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Push Reminder Mutation
  const remindMutation = useMutation({
    mutationFn: async ({ userIds, title, body }: { userIds?: string[]; title: string; body: string }) => {
      return await userStreakService.sendStreakReminder(userIds, title, body);
    },
    onSuccess: () => {
      toast.success("Đã gửi thông báo giữ chuỗi thành công!");
      setIsReminderModalOpen(false);
      setTargetReminderUser(null);
    },
    onError: () => {
      toast.error("Gửi thông báo thất bại");
    },
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
      {/* Header section */}
      <UserStreakHeader
        onOpenReminder={() => {
          setTargetReminderUser(null);
          setIsReminderModalOpen(true);
        }}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing || isLoading}
      />

      {/* Metric Cards Grid */}
      <UserStreakStatsCards stats={statsData || null} />

      {/* Control Panel & Search Bar */}
      <UserStreakSearchBar
        search={searchQuery}
        debouncedSearch={debouncedSearch}
        selectedStatus={selectedStatus}
        onSearch={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        onStatusChange={(st) => {
          setSelectedStatus(st);
          setPage(1);
        }}
      />

      {/* Main Table */}
      <UserStreakTable
        streaks={streaksList}
        isLoading={isLoading}
        onSendReminder={(user) => {
          setTargetReminderUser(user);
          setIsReminderModalOpen(true);
        }}
      />

      {/* Standard Pagination Component */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        itemName="người dùng"
      />

      {/* Push Reminder Modal */}
      <UserStreakReminderModal
        isOpen={isReminderModalOpen}
        targetUser={targetReminderUser}
        isSending={remindMutation.isPending}
        onClose={() => {
          setIsReminderModalOpen(false);
          setTargetReminderUser(null);
        }}
        onSend={(payload) => remindMutation.mutate(payload)}
      />
    </div>
  );
}
