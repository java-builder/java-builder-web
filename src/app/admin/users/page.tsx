"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { userApi } from "@/services/user.service";
import { useConfirm } from "@/hooks/useConfirm";
import { useDebounce } from "@/hooks/useDebounce";
import { useUsersList } from "@/hooks/useUser";
import { UserDetailResponse } from "@/types/user";
import EditUserModal from "@/components/admin/users/EditUserModal";
import CreateUserModal from "@/components/admin/users/CreateUserModal";
import { UserStatsCards } from "@/components/admin/users/UserStatsCards";
import { UserSearchBar } from "@/components/admin/users/UserSearchBar";
import { UserTableRow } from "@/components/admin/users/UserTableRow";
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
  
  const { response, isLoading, error, stats, refetch } = useUsersList(debouncedSearch, currentPage);

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
      },
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-accent"
            xmlns="http://www.w3.org/2000/svg"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error && !response) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Lỗi khi tải dữ liệu
          </h3>
          <p className="text-gray-500 mb-2">{error}</p>
          <p className="text-sm text-gray-400 mb-4">
            Vui lòng kiểm tra console để xem chi tiết lỗi
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!response?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có dữ liệu
          </h3>
          <p className="text-gray-500 mb-4">API trả về dữ liệu rỗng</p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
                <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý người dùng
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {debouncedSearch ? (
                <>
                  Tìm thấy <span className="font-semibold">{response?.data?.totalElements || 0}</span> kết quả cho &ldquo;{debouncedSearch}&rdquo;
                </>
              ) : (
                "Danh sách tất cả người dùng trong hệ thống JavaBuilder"
              )}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm người dùng
            </button>
          </div>
        </div>
      </div>

      <UserStatsCards stats={stats} response={response?.data ?? null} />

      <UserSearchBar
        search={search}
        debouncedSearch={debouncedSearch}
        isLoading={isLoading}
        onSearch={handleSearch}
        onRefresh={refetch}
      />

      {/* Loading overlay for refresh */}
      {isLoading && response && (
        <div className="mt-4 p-3 bg-accent-50 border border-accent-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 text-accent-600 mr-2"
              xmlns="http://www.w3.org/2000/svg"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm text-accent-700">
              Đang cập nhật dữ liệu...
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  MFT
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {(response?.data?.data ?? []).map((user: UserDetailResponse) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isDeleting={isDeleting === user.id}
                  onEdit={handleEditUser}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage + 1}
        totalPages={response?.data?.totalPages || 0}
        totalElements={response?.data?.totalElements || 0}
        pageSize={response?.data?.pageSize || 10}
        onPageChange={(page) => handlePageChange(page - 1)}
        itemName="người dùng"
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        user={selectedUser}
      />

  {/* Create User Modal */}
  <CreateUserModal
    isOpen={isCreateModalOpen}
    onClose={closeCreateModal}
    onSuccess={handleCreateSuccess}
  />
    </div>
  );
}
