"use client";

import { useState, useEffect, useCallback } from "react";
import { SubscriptionPlan } from "@/types/subscription";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import toast from "react-hot-toast";
import { formatNumber, formatPriceInput, parsePriceInput } from "@/utils/formatters";

const freePlan = {
  id: "free",
  name: "Miễn phí",
  price: 0,
  durationDays: 0,
  description: "Bắt đầu hành trình học Java",
  features: "Truy cập khóa học miễn phí|Đọc blog & bài viết|Tài liệu công khai|Tài liệu Premium (Ebooks)",
};

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", price: "", durationDays: "", description: "", features: "",
  });

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionPlanService.getAllPlansAdmin();
      if (response.data) setPlans(response.data);
    } catch {
      toast.error("Không thể tải danh sách gói");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPlan) {
        await subscriptionPlanService.updatePlan({
          id: editingPlan.id,
          name: formData.name,
          price: parsePriceInput(formData.price),
          durationDays: Number(formData.durationDays),
          description: formData.description,
          features: formData.features,
        });
        toast.success("Cập nhật thành công");
      } else {
        await subscriptionPlanService.createPlan({
          name: formData.name,
          price: parsePriceInput(formData.price),
          durationDays: Number(formData.durationDays),
          description: formData.description,
          features: formData.features,
        });
        toast.success("Tạo gói thành công");
      }
      setShowModal(false);
      setEditingPlan(null);
      setFormData({ name: "", price: "", durationDays: "", description: "", features: "" });
      fetchPlans();
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name, price: formatPriceInput(String(plan.price)), durationDays: String(plan.durationDays),
      description: plan.description || "", features: plan.features || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (planId: string, planName: string) => {
    if (!confirm(`Xóa gói "${planName}"?`)) return;
    try {
      await subscriptionPlanService.deletePlan(planId);
      toast.success("Đã xóa");
      fetchPlans();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  // Combine free plan with API plans, sort to put monthly plan in middle
  const sortedPlans = [...plans].sort((a, b) => {
    // Sort by duration: shorter duration first (monthly before yearly)
    return a.durationDays - b.durationDays;
  });
  const allPlans = [freePlan, ...sortedPlans];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gói Premium</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý các gói đăng ký</p>
        </div>
        <button
          onClick={() => { setEditingPlan(null); setFormData({ name: "", price: "", durationDays: "", description: "", features: "" }); setShowModal(true); }}
          className="inline-flex items-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm gói
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {allPlans.map((plan, index) => {
          const isFree = plan.id === "free";
          const isPopular = index === 1; // Middle plan (Premium Tháng)

          return (
            <div
              key={plan.id}
              className={`relative bg-card rounded-xl p-5 transition-all ${isPopular ? "ring-2 ring-accent shadow-lg" : "border border-border hover:shadow-md"
                }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                  Phổ biến nhất
                </span>
              )}

              <div className="text-center mb-4">
                <h3 className="font-semibold text-foreground text-center">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-foreground">
                    {plan.price === 0 ? "0" : formatNumber(plan.price)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-0.5">đ</span>
                  {plan.durationDays > 0 && (
                    <span className="text-muted-foreground/60 text-sm ml-1">/{plan.durationDays} ngày</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-4 text-sm">
                {plan.features?.split("|").map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground/80">{f.trim()}</span>
                  </li>
                ))}
              </ul>

              {isFree ? (
                <div className="py-2 text-center text-sm text-muted-foreground/80 bg-muted/50 rounded-lg border border-border/40 font-medium">
                  Mặc định
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan as SubscriptionPlan)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${isPopular
                        ? "bg-accent text-white hover:bg-accent/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                      }`}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id, plan.name)}
                    className="px-3 py-2 text-sm text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-xl w-full max-w-md shadow-xl border border-border text-foreground">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                {editingPlan ? "Sửa gói" : "Thêm gói mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tên gói *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Giá (VNĐ) *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: formatPriceInput(e.target.value) })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Số ngày *</label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tính năng <span className="text-muted-foreground font-normal">(phân cách bằng |)</span>
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Đang lưu..." : editingPlan ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
