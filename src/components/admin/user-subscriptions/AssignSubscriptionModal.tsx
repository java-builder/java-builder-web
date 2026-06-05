"use client";

import { useEffect } from "react";
import { Mail, Package, X } from "lucide-react";
import type { SubscriptionPlan } from "@/types/subscription";

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
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-slate-700">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Gán gói Premium
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Cấp quyền truy cập gói cho người dùng theo email
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isAssigning}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 px-5 py-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email người dùng
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="user@example.com"
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Gói Premium
              </label>
              <div className="relative">
                <Package className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <select
                  value={subscriptionPlanId}
                  onChange={(e) => onPlanChange(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-8 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
                >
                  <option value="">Chọn gói</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — {plan.durationDays} ngày
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50/50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/30">
            <button
              type="button"
              onClick={onClose}
              disabled={isAssigning}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isDisabled}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAssigning ? "Đang xử lý..." : "Gán gói"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
