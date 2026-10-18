"use client";

import { useState, useMemo } from "react";
import {
  ChallengesHeader,
  ChallengeFilters,
  ChallengeCard,
  ChallengeTable,
  ChallengeModal,
  ChallengeStatsCards,
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
import { Layers, RefreshCw, LayoutList, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";

export default function AdminChallengesPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus | "">("");
  const [levelFilter, setLevelFilter] = useState<ChallengeLevel | "">("");
  const [page, setPage] = useState(1);
  const size = 30;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ChallengeResponse | null>(null);

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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <ChallengesHeader
        totalCount={stats.total}
        onCreate={handleOpenCreate}
      />

      {/* Stats Cards */}
      <ChallengeStatsCards
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
        totalDays={stats.totalDays}
        isLoading={isLoading}
      />

      {/* Filters Bar */}
      <div className="space-y-3">
        <ChallengeFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          level={levelFilter}
          onLevelChange={setLevelFilter}
          onReset={handleResetFilters}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Hiển thị <strong>{filteredChallenges.length}</strong> thử thách lập trình
          </span>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Chế độ bảng (chuẩn quản trị)"
              >
                <LayoutList className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Chế độ thẻ lưới"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 gap-1 text-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {viewMode === "table" ? (
        <div className="space-y-6">
          <ChallengeTable
            challenges={filteredChallenges}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onCreateNew={handleOpenCreate}
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
              className="h-72 bg-card border border-border rounded-xl animate-pulse p-6 space-y-4"
            >
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-16 bg-muted rounded w-full" />
              <div className="h-10 bg-muted rounded w-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border border-dashed rounded-xl p-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
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
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Xóa bộ lọc
              </Button>
            )}
            <Button variant="accent" size="sm" onClick={handleOpenCreate}>
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
    </div>
  );
}
