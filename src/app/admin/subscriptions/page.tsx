"use client";

import { useState, useEffect, useCallback } from "react";
import { SubscriptionPlan } from "@/types/subscription";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import toast from "react-hot-toast";
import { formatNumber, formatPriceInput, parsePriceInput } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Check,
  Zap,
  X,
  Users,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

const freePlan = {
  id: "free",
  name: "Miễn phí",
  price: 0,
  durationDays: 0,
  description: "Bắt đầu hành trình học Java dành người mới",
  features: "Truy cập khóa học miễn phí|Đọc blog & bài viết|Tài liệu công khai|Tài liệu Premium (Ebooks)",
};

export default function AdminSubscriptionsPage() {
  const { t } = useI18n();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationDays: "",
    description: "",
    features: "",
  });

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionPlanService.getAllPlansAdmin();
      if (response.data) setPlans(response.data);
    } catch {
      toast.error(t("admin.common.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleOpenModal = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: formatPriceInput(String(plan.price)),
        durationDays: String(plan.durationDays),
        description: plan.description || "",
        features: plan.features || "",
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        price: "",
        durationDays: "",
        description: "",
        features: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        price: parsePriceInput(formData.price),
        durationDays: Number(formData.durationDays),
        description: formData.description,
        features: formData.features,
      };

      if (editingPlan) {
        await subscriptionPlanService.updatePlan({
          id: editingPlan.id,
          ...payload
        });
        toast.success(t("admin.common.success"));
      } else {
        await subscriptionPlanService.createPlan(payload);
        toast.success(t("admin.common.success"));
      }
      handleCloseModal();
      fetchPlans();
    } catch {
      toast.error(t("admin.common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (planId: string, planName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa gói "${planName}"?`)) return;
    try {
      await subscriptionPlanService.deletePlan(planId);
      toast.success(t("admin.common.success"));
      fetchPlans();
    } catch {
      toast.error(t("admin.common.error"));
    }
  };

  const sortedPlans = [...plans].sort((a, b) => a.durationDays - b.durationDays);
  
  const filteredApiPlans = sortedPlans.filter(
    (p) => p.id !== "free" && p.price > 0 && !p.name.toLowerCase().includes("miễn phí")
  );
  const allPlans = [freePlan, ...filteredApiPlans];

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <div className="flex justify-between items-center animate-pulse">
          <div className="space-y-2">
            <div className="h-7 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-72" />
          </div>
          <div className="h-9 bg-muted rounded w-32 shrink-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-muted rounded w-2/3 mx-auto" />
              <div className="h-10 bg-muted rounded w-1/2 mx-auto my-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/5" />
              </div>
              <div className="h-10 bg-muted rounded w-full mt-6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {t("admin.subscriptions.pageTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.subscriptions.pageSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/user-subscriptions">
            <Button variant="outline" size="sm" className="gap-1.5 h-9">
              <Users className="h-4 w-4 text-accent" />
              <span>Người dùng đăng ký</span>
            </Button>
          </Link>
          <Button
            variant="accent"
            size="sm"
            onClick={() => handleOpenModal()}
            className="gap-1.5 h-9"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm gói</span>
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        {allPlans.map((plan, index) => {
          const isFree = plan.id === "free" || plan.price === 0 || plan.name.toLowerCase().includes("miễn phí");
          const isPopular = index === 1; // Middle plan (Monthly Premium)

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-xl bg-card p-6 transition-all duration-200 ${
                isPopular
                  ? "border-2 border-accent shadow-md"
                  : "border border-border shadow-sm hover:border-border/80"
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  <span>Phổ biến nhất</span>
                </div>
              )}

              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold ${
                        isFree
                          ? "bg-muted text-muted-foreground"
                          : isPopular
                          ? "bg-accent/15 text-accent"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isFree ? (
                        <Layers className="h-4 w-4" />
                      ) : isPopular ? (
                        <Zap className="h-4 w-4" />
                      ) : (
                        <Crown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {plan.description || "Gói dịch vụ hệ thống"}
                      </p>
                    </div>
                  </div>

                  {/* Action Icons for non-free plans */}
                  {!isFree && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenModal(plan as SubscriptionPlan)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-accent"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleDelete(plan.id, plan.name)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                        title="Xóa gói"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div className="my-4 border-y border-border/60 py-4 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">
                      {plan.price === 0 ? "0" : formatNumber(plan.price)}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">đ</span>
                    {plan.durationDays > 0 && (
                      <span className="text-xs font-medium text-muted-foreground/70 ml-1">
                        / {plan.durationDays} ngày
                      </span>
                    )}
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Quyền lợi gói:
                  </span>
                  {plan.features?.split("|").map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-relaxed">{f.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Edit/Create */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-card rounded-xl w-full max-w-lg shadow-xl border border-border text-foreground overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Crown className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {editingPlan ? `Sửa gói "${editingPlan.name}"` : "Thêm gói Premium mới"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Tên gói <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Premium Tháng, Premium Năm..."
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Giá (VNĐ) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: formatPriceInput(e.target.value) })
                    }
                    placeholder="499.000"
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Số ngày sử dụng <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) =>
                      setFormData({ ...formData, durationDays: e.target.value })
                    }
                    placeholder="30"
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ví dụ: Phù hợp để trải nghiệm full khóa học..."
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Quyền lợi gói{" "}
                  <span className="text-muted-foreground/60 font-normal">
                    (Mỗi quyền lợi cách nhau bằng dấu |)
                  </span>
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Xem tất cả khóa học|Đọc tất cả bài viết|Tài liệu Premium (Ebooks)..."
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm resize-none transition-colors"
                  rows={4}
                />
              </div>

              {/* Action Footer */}
              <div className="flex gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="default"
                  disabled={isSubmitting}
                  className="flex-1 font-semibold"
                >
                  {isSubmitting
                    ? "Đang lưu..."
                    : editingPlan
                    ? "Cập nhật gói"
                    : "Tạo gói mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
