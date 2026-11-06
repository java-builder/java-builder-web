"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChallengesHeader,
  ChallengeFilters,
  ChallengeCard,
  ChallengeTable,
  ChallengeModal,
  ChallengeStatsCards,
  EnrollChallengeUserModal,
} from "@/components/admin/challenges";
import { useChallenges } from "@/hooks/useChallenges";
import { challengeService } from "@/services/challenge.service";
import {
  ChallengeLevel,
  ChallengeResponse,
  ChallengeStatus,
  CreateChallengeRequest,
  UpdateChallengeRequest,
} from "@/types/challenge";
import { useConfirm } from "@/hooks/useConfirm";
import toast from "react-hot-toast";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export default function AdminChallengesPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_challenges_view_mode");
      if (saved === "table" || saved === "grid") {
        setViewMode(saved);
      }
    } catch {}
  }, []);

  const handleSetViewMode = (mode: "table" | "grid") => {
    setViewMode(mode);
    try {
      localStorage.setItem("admin_challenges_view_mode", mode);
    } catch {}
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus | "">("");
  const [levelFilter, setLevelFilter] = useState<ChallengeLevel | "">("");
  const [page, setPage] = useState(1);
  const size = 30;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ChallengeResponse | null>(null);
  const [enrollModal, setEnrollModal] = useState<{
    isOpen: boolean;
    challengeId: string;
    challengeTitle: string;
  }>({
    isOpen: false,
    challengeId: "",
    challengeTitle: "",
  });

  const { confirm } = useConfirm();

  const { data, isLoading, isFetching, refetch } = useChallenges(
    statusFilter || undefined,
    page,
    size
  );

  const rawChallenges: ChallengeResponse[] = useMemo(() => data?.data || [], [data?.data]);

  const stats = useMemo(() => {
    const total = data?.totalElements ?? rawChallenges.length;
    const active = rawChallenges.filter((c) => c.status === "ACTIVE").length;
    const inactive = rawChallenges.filter((c) => c.status === "INACTIVE").length;
    const totalDays = rawChallenges.reduce((sum, c) => sum + (c.totalDays || 0), 0);
    return { total, active, inactive, totalDays };
  }, [data?.totalElements, rawChallenges]);

  const filteredChallenges = useMemo(() => {
    return rawChallenges.filter((item) => {
      const matchSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.slug.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));

      const matchLevel = !levelFilter || item.level === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [rawChallenges, search, levelFilter]);

  const handleOpenCreate = () => {
    setEditingChallenge(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (challenge: ChallengeResponse) => {
    setEditingChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (formData: CreateChallengeRequest | UpdateChallengeRequest) => {
    if (editingChallenge) {
      await challengeService.updateChallenge(editingChallenge.id, formData as UpdateChallengeRequest);
      toast.success("Cập nhật thử thách thành công");
    } else {
      await challengeService.createChallenge(formData as CreateChallengeRequest);
      toast.success("Tạo thử thách mới thành công");
    }
    setIsModalOpen(false);
    setEditingChallenge(null);
    refetch();
  };

  const handleDelete = (id: string, title: string) => {
    confirm(
      async () => {
        await challengeService.deleteChallenge(id);
        toast.success("Xóa thử thách thành công");
        refetch();
      },
      {
        title: "Xóa thử thách theo ngày?",
        message: `Bạn có chắc chắn muốn xóa lộ trình thử thách "<strong>${title}</strong>"? Toàn bộ các giai đoạn, ngày học và bài tập liên quan cũng sẽ bị xóa vĩnh viễn.`,
        confirmText: "Xóa vĩnh viễn",
        cancelText: "Hủy",
        type: "error",
      }
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setLevelFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <ChallengesHeader
        totalCount={stats.total}
        onCreate={handleOpenCreate}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Stats Cards */}
      <ChallengeStatsCards
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
        totalDays={stats.totalDays}
        isLoading={isLoading}
      />

      {/* Filters & View Mode Bar */}
      <ChallengeFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        level={levelFilter}
        onLevelChange={setLevelFilter}
        onReset={handleResetFilters}
        filteredCount={filteredChallenges.length}
        viewMode={viewMode}
        onViewModeChange={handleSetViewMode}
      />

      {/* Content Section */}
      {viewMode === "table" ? (
        <div className="space-y-6">
          <ChallengeTable
            challenges={filteredChallenges}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onCreateNew={handleOpenCreate}
            onEnroll={(challengeId, challengeTitle) =>
              setEnrollModal({ isOpen: true, challengeId, challengeTitle })
            }
          />

          {data && data.totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                pageSize={size}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-76 bg-surface border border-border rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between"
            >
              <div className="h-24 bg-muted w-full" />
              <div className="p-5 space-y-3 flex-1">
                <div className="h-4 bg-muted rounded-full w-1/4" />
                <div className="h-4 bg-muted rounded-full w-full" />
                <div className="h-14 bg-muted rounded-xl w-full mt-2" />
              </div>
              <div className="h-12 bg-muted/50 border-t border-border w-full" />
            </div>
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border border-dashed rounded-2xl p-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center text-primary mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Chưa có thử thách nào phù hợp
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Thử thay đổi bộ lọc tìm kiếm hoặc tạo một lộ trình thử thách theo ngày mới cho học viên.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {(search || statusFilter || levelFilter) && (
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="rounded-full">
                Xóa bộ lọc
              </Button>
            )}
            <Button variant="accent" size="sm" onClick={handleOpenCreate} className="rounded-full">
              Tạo thử thách ngay
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onEnroll={(challengeId, challengeTitle) =>
                  setEnrollModal({ isOpen: true, challengeId, challengeTitle })
                }
              />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                pageSize={size}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ChallengeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChallenge(null);
        }}
        onSubmit={handleSubmitModal}
        initialData={editingChallenge}
      />

      {/* Enroll User Modal */}
      <EnrollChallengeUserModal
        isOpen={enrollModal.isOpen}
        challengeId={enrollModal.challengeId}
        challengeTitle={enrollModal.challengeTitle}
        onClose={() =>
          setEnrollModal({ isOpen: false, challengeId: "", challengeTitle: "" })
        }
        onSuccess={() => refetch()}
      />
    </div>
  );
}
