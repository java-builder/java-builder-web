"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { userApi } from "@/services/user.service";
import { useConfirm } from "@/hooks/useConfirm";
import { useDebounce } from "@/hooks/useDebounce";
import { useUsersList } from "@/hooks/useUser";
import { UserDetailResponse } from "@/types/user";
import EditUserModal from "@/components/admin/users/EditUserModal";
import CreateUserModal from "@/components/admin/users/CreateUserModal";
import { UserStatsCards } from "@/components/admin/users/UserStatsCards";
import { UserSearchBar } from "@/components/admin/users/UserSearchBar";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Pagination } from "@/components/ui/Pagination";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(null);
  const { confirm } = useConfirm();

  const { response, isLoading, error, stats, refetch } = useUsersList(
    debouncedSearch,
    currentPage
  );

  const handleDelete = async (id: string, userName: string) => {
    await confirm(
      async () => {
        setIsDeleting(id);
        try {
          await userApi.delete(id);
          refetch();
        } finally {
          setIsDeleting("");
        }
      },
      {
        title: "🗑️ Xác nhận xóa người dùng",
        message: `
                    <div style="text-align: center; line-height: 1.5;">
                        <p style="margin-bottom: 8px;">Bạn có chắc chắn muốn xóa người dùng</p>
                        <p style="font-weight: 700; color: #dc2626; font-size: 14px; margin: 8px 0; padding: 6px 12px; background: #fef2f2; border-radius: 6px; display: inline-block;">
                            "${userName}"
                        </p>
                        <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                            ⚠️ Hành động này không thể hoàn tác
                        </p>
                    </div>
                `,
        confirmText: "🗑️ Xóa người dùng",
        cancelText: "❌ Hủy bỏ",
        type: "error",
      }
    );
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditUser = (user: UserDetailResponse) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setIsCreateModalOpen(true);
    }
  }, [searchParams]);

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    try {
      if (typeof window !== "undefined" && searchParams.get("create") === "1") {
        router.replace(window.location.pathname);
      }
    } catch {}
  };

  const handleCreateSuccess = () => {
    closeCreateModal();
    refetch();
  };

  if (isLoading && !response) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-slate-900">
        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 animate-spin text-accent"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !response) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-slate-900">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
            <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Lỗi khi tải dữ liệu
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const totalCount =
    debouncedSearch
      ? response?.data?.totalElements || 0
      : stats?.totalUsers ?? response?.data?.totalElements ?? 0;
  const users = response?.data?.data ?? [];

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <UsersHeader
        totalCount={totalCount}
        searchTerm={debouncedSearch}
        onCreate={() => setIsCreateModalOpen(true)}
      />

      <UserStatsCards stats={stats} response={response?.data ?? null} />

      <UserSearchBar
        search={search}
        debouncedSearch={debouncedSearch}
        isLoading={isLoading}
        onSearch={handleSearch}
        onRefresh={refetch}
      />

      <UsersTable
        users={users}
        isLoading={isLoading}
        totalElements={response?.data?.totalElements ?? 0}
        hasFilter={!!debouncedSearch}
        deletingId={isDeleting}
        onEdit={handleEditUser}
        onDelete={handleDelete}
      />

      {response?.data && response.data.totalPages > 0 && users.length > 0 && (
        <Pagination
          currentPage={currentPage + 1}
          totalPages={response.data.totalPages}
          totalElements={response.data.totalElements}
          pageSize={response.data.pageSize || 10}
          onPageChange={(page) => handlePageChange(page - 1)}
          itemName="người dùng"
        />
      )}

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        user={selectedUser}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
