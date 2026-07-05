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
      <div className="p-4 sm:p-6 space-y-6 animate-pulse bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-7 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-72" />
          </div>
          <div className="h-10 bg-muted rounded w-32" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className="h-4 bg-muted rounded w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-transparent">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </td>
                  <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-5 bg-muted rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-3 bg-muted rounded w-24" /></td>
                </tr>
              ))}
            </tbody>
          </table>
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
