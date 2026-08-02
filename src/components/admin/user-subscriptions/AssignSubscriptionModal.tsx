"use client";

import { useEffect } from "react";
import { Mail, Package, X } from "lucide-react";
import type { SubscriptionPlan } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/FilterSelect";

interface AssignSubscriptionModalProps {
  isOpen: boolean;
  email: string;
  subscriptionPlanId: string;
  plans: SubscriptionPlan[];
  isAssigning: boolean;
  onEmailChange: (value: string) => void;
  onPlanChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function AssignSubscriptionModal({
  isOpen,
  email,
  subscriptionPlanId,
  plans,
  isAssigning,
  onEmailChange,
  onPlanChange,
  onSubmit,
  onClose,
}: AssignSubscriptionModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isAssigning) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isAssigning]);

  if (!isOpen) return null;

  const isDisabled = !email || !subscriptionPlanId || isAssigning;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Gán gói Premium
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Cấp quyền truy cập gói cho người dùng theo email
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isAssigning}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 px-5 py-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Email người dùng
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="user@example.com"
                  className="block w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Gói Premium
              </label>
              <FilterSelect
                value={subscriptionPlanId}
                onChange={onPlanChange}
                options={plans.map((p) => ({
                  value: p.id,
                  label: `${p.name} — ${p.durationDays} ngày`,
                }))}
                placeholder="Chọn gói Premium..."
                icon={<Package className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-5 py-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isAssigning}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="accent"
              onClick={onSubmit}
              disabled={isDisabled}
            >
              {isAssigning ? "Đang xử lý..." : "Gán gói"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
