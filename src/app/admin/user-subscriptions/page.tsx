"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUserSubscriptions } from "@/hooks/useUserSubscriptions";
import { formatDate } from "@/utils/formatters";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import { SubscriptionPlan } from "@/types/subscription";
import toast from "react-hot-toast";

export default function AdminUserSubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [assignForm, setAssignForm] = useState({
    email: "",
    subscriptionPlanId: "",
  });
  const [isAssigning, setIsAssigning] = useState(false);

  const { subscriptions, isLoading, totalPages, refetch } = useUserSubscriptions(
    page,
    10,
    status,
    search
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await subscriptionPlanService.getAllPlansAdmin();
        setPlans(response.data || []);
      } catch {
        toast.error("Không thể tải danh sách gói");
      }
    };
    fetchPlans();
  }, []);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleAssign = async () => {
    if (!assignForm.email || !assignForm.subscriptionPlanId) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsAssigning(true);
      await userSubscriptionService.assignSubscription(
        assignForm.email,
        assignForm.subscriptionPlanId
      );
      toast.success("Assign subscription thành công");
      setShowAssignModal(false);
      setAssignForm({ email: "", subscriptionPlanId: "" });
      refetch();
    } catch {
      toast.error("Assign subscription thất bại");
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: "bg-green-100 text-green-800",
      EXPIRED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    const labels = {
      ACTIVE: "Đang hoạt động",
      EXPIRED: "Hết hạn",
      CANCELLED: "Đã hủy",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (isLoading && subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <svg
          className="animate-spin h-8 w-8 text-accent"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý User Subscriptions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách người dùng đã đăng ký Premium
          </p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Thêm Subscription
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm theo tên hoặc email..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Tìm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gói
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Còn lại
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={sub.avatar || "/default-avatar.png"}
                          alt={sub.username}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {sub.username}
                          </div>
                          <div className="text-xs text-gray-500">{sub.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {sub.planName}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(sub.startDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(sub.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {sub.daysRemaining > 0
                        ? `${sub.daysRemaining} ngày`
                        : "Hết hạn"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thêm Subscription cho User
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email người dùng
                </label>
                <input
                  type="email"
                  value={assignForm.email}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gói Premium
                </label>
                <select
                  value={assignForm.subscriptionPlanId}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      subscriptionPlanId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                >
                  <option value="">Chọn gói</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {plan.durationDays} ngày
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignForm({ email: "", subscriptionPlanId: "" });
                }}
                disabled={isAssigning}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAssign}
                disabled={isAssigning}
                className="flex-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {isAssigning ? "Đang xử lý..." : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
