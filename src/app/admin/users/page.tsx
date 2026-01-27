"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { userApi } from "@/services/user.service";
import { useConfirm } from "@/hooks/useConfirm";
import { useDebounce } from "@/hooks/useDebounce";
import { UserDetailResponse, UserStatisticsResponse, UserStatus } from "@/types/user";
import { ApiResponse, PageResponse } from "@/types/api";
import EditUserModal from "@/components/admin/users/EditUserModal";
import CreateUserModal from "@/components/admin/users/CreateUserModal";

const StatusBadge = ({ status }: { status: UserStatus | string }) => {
  const getStatusConfig = (status: UserStatus | string) => {
    switch (status) {
      case "ACTIVE":
        return { color: "bg-green-100 text-green-800", text: "Hoạt động" };
      case "INACTIVE":
        return {
          color: "bg-yellow-100 text-yellow-800",
          text: "Không hoạt động",
        };
      case "BANNED":
        return { color: "bg-red-100 text-red-800", text: "Bị cấm" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  );
};

const getRoleClass = (role: string) => {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
    case "ROLE_ADMIN":
      return "bg-indigo-100 text-indigo-800";
    case "MODERATOR":
    case "ROLE_MODERATOR":
      return "bg-blue-100 text-blue-800";
    case "TEACHER":
    case "INSTRUCTOR":
      return "bg-emerald-100 text-emerald-800";
    case "OWNER":
    case "SUPERADMIN":
    case "ROLE_SUPERADMIN":
      return "bg-red-100 text-red-800";
    case "USER":
    return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
  default:
    return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300";
  }
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(0);
  const [response, setResponse] = useState<ApiResponse<
    PageResponse<UserDetailResponse>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(null);
  const { confirm } = useConfirm();
  const [stats, setStats] = useState<UserStatisticsResponse | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await userApi.search({
        page: currentPage + 1,
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      setResponse(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await userApi.getStatistics();
      setStats(res.data ?? null);
    } catch (err) {
      console.error("Failed to fetch user statistics", err);
    }
  }, []);

  const handleDelete = async (id: string, userName: string) => {
    await confirm(
      async () => {
        setIsDeleting(id);
        try {
          await userApi.delete(id);
          fetchUsers();
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

  const handleRefresh = () => {
    fetchUsers();
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
    fetchUsers(); // Refresh data after successful edit
  };

  const formatCreatedDate = (createdAt: string): string => {
    try {
      const date = new Date(createdAt);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", createdAt, error);
      return "Ngày không hợp lệ";
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  // Open create modal when query param ?create=1 is present
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
    fetchUsers();
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
            onClick={handleRefresh}
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
            onClick={handleRefresh}
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
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý người dùng
            </h1>
            <p className="mt-2 text-sm text-gray-600">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-accent-100 rounded-lg">
              <svg
                className="w-6 h-6 text-accent-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 11a4 4 0 11-8 0 4 4 0 018 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2 20v-1c0-2.761 3.134-5 7-5h6c3.866 0 7 2.239 7 5v1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng người dùng
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalUsers ?? (response?.data?.totalElements || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeUsers ?? (response?.data?.data?.filter(
                  (user: UserDetailResponse) => user.userStatus === "ACTIVE",
                ).length || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.29 3.86l-6.36 11.64A2 2 0 004 18h16a2 2 0 001.77-2.5L17.71 3.86a2 2 0 00-3.42 0L10.29 3.86z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Không hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.inactiveUsers ?? (response?.data?.data?.filter(
                  (user: UserDetailResponse) => user.userStatus === "INACTIVE",
                ).length || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xoá</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.deletedUsers ?? (response?.data?.data?.filter(
                  (user: UserDetailResponse) => user.userStatus === "DELETED",
                ).length || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {search && search !== debouncedSearch && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="animate-spin h-4 w-4 text-accent"
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
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MFT
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(response?.data?.data ?? []).map(
                (user: UserDetailResponse) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <div className="relative h-10 w-10">
                              <Image
                                src={user.avatar}
                                alt={user.username}
                                fill
                                sizes="40px"
                                className="rounded-full object-cover"
                              />
                            </div>
                          ) : null}
                          <div
                            className={`h-10 w-10 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center ${user.avatar ? "hidden" : ""}`}
                          >
                            <span className="text-sm font-medium text-white">
                              {user.username?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.userStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {(user.authorities || []).map((role) => (
                          <span
                            key={role}
                            className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md whitespace-nowrap ${getRoleClass(role)}`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.mftEnable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                        {user.mftEnable ? "ON" : "OFF"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? formatCreatedDate(user.createdAt) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={isDeleting === user.id}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {isDeleting === user.id ? (
                            <>
                              <svg
                                className="animate-spin w-4 h-4 mr-1"
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
                              Đang xóa...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Xóa
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {(response?.data?.totalPages || 0) > 1 && (
        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200 rounded-b-xl">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0 || isLoading}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === (response?.data?.totalPages || 0) - 1 ||
                isLoading
              }
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {currentPage * (response?.data?.pageSize || 10) + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(
                    (currentPage + 1) * (response?.data?.pageSize || 10),
                    response?.data?.totalElements || 0,
                  )}
                </span>{" "}
                trong số{" "}
                <span className="font-medium">
                  {response?.data?.totalElements || 0}
                </span>{" "}
                kết quả
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0 || isLoading}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="sr-only">First page</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0 || isLoading}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {(() => {
                  const totalPages = response?.data?.totalPages || 0;
                  const maxVisiblePages = 5;
                  let startPage = Math.max(
                    0,
                    currentPage - Math.floor(maxVisiblePages / 2),
                  );
                  const endPage = Math.min(
                    totalPages - 1,
                    startPage + maxVisiblePages - 1,
                  );

                  if (endPage - startPage < maxVisiblePages - 1) {
                    startPage = Math.max(0, endPage - maxVisiblePages + 1);
                  }

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }

                  return pages.map((pageIndex) => (
                    <button
                      key={pageIndex}
                      onClick={() => handlePageChange(pageIndex)}
                      disabled={isLoading}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                        currentPage === pageIndex
                          ? "z-10 bg-accent-50 border-accent text-accent-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  ));
                })()}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage === (response?.data?.totalPages || 0) - 1 ||
                    isLoading
                  }
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    handlePageChange((response?.data?.totalPages ?? 1) - 1)
                  }
                  disabled={
                    currentPage === (response?.data?.totalPages || 0) - 1 ||
                    isLoading
                  }
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="sr-only">Last page</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm-6 0a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

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
