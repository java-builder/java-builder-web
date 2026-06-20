"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useUserSubscriptions } from "@/hooks/useUserSubscriptions";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import type { SubscriptionPlan } from "@/types/subscription";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";
import {
  AssignSubscriptionModal,
  SubscriptionFilters,
  SubscriptionMobileCard,
  SubscriptionTable,
} from "@/components/admin/user-subscriptions";

const PAGE_SIZE = 10;

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

  const {
    subscriptions,
    isLoading,
    totalPages,
    totalElements,
    refetch,
  } = useUserSubscriptions(page, PAGE_SIZE, status, search);

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

  const hasActiveFilters = useMemo(
    () => Boolean(status || search),
    [status, search]
  );

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
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
      toast.success("Gán gói thành công");
      setShowAssignModal(false);
      setAssignForm({ email: "", subscriptionPlanId: "" });
      refetch();
    } catch {
      toast.error("Gán gói thất bại");
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading && subscriptions.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-border bg-card p-12">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-5 w-5 animate-spin text-accent"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Đang tải dữ liệu...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Quản lý Subscriptions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách người dùng đã đăng ký gói Premium
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Tổng{" "}
            <span className="tabular-nums">
              {totalElements.toLocaleString("vi-VN")}
            </span>{" "}
            subscription
          </span>
          <Button
            type="button"
            variant="accent"
            onClick={() => setShowAssignModal(true)}
            className="h-9 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Gán gói
          </Button>
        </div>
      </div>

      {/* Filters */}
      <SubscriptionFilters
        searchInput={searchInput}
        status={status}
        hasActiveFilters={hasActiveFilters}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onClear={handleClearFilters}
      />

      {/* Mobile cards */}
      {subscriptions.length > 0 && (
        <div className="space-y-3 md:hidden">
          {subscriptions.map((sub) => (
            <SubscriptionMobileCard key={sub.id} subscription={sub} />
          ))}
        </div>
      )}

      {/* Mobile empty */}
      {subscriptions.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center md:hidden">
          <p className="text-sm font-medium text-foreground">
            Chưa có dữ liệu
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Không có subscription nào phù hợp với bộ lọc
          </p>
        </div>
      )}

      {/* Desktop table */}
      <SubscriptionTable subscriptions={subscriptions} />

      {/* Pagination */}
      {totalPages > 0 && subscriptions.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemName="subscription"
        />
      )}

      {/* Assign modal */}
      <AssignSubscriptionModal
        isOpen={showAssignModal}
        email={assignForm.email}
        subscriptionPlanId={assignForm.subscriptionPlanId}
        plans={plans}
        isAssigning={isAssigning}
        onEmailChange={(value) =>
          setAssignForm((prev) => ({ ...prev, email: value }))
        }
        onPlanChange={(value) =>
          setAssignForm((prev) => ({ ...prev, subscriptionPlanId: value }))
        }
        onSubmit={handleAssign}
        onClose={() => {
          if (!isAssigning) {
            setShowAssignModal(false);
            setAssignForm({ email: "", subscriptionPlanId: "" });
          }
        }}
      />
    </div>
  );
}
