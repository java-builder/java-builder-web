"use client";

import { useEffect } from "react";
import { Loader2, RefreshCw, X } from "lucide-react";
import { UserSubscription } from "@/types/user-subscription";

interface RenewConfirmModalProps {
  subscription: UserSubscription;
  endDateText: string;
  isProcessing: boolean;
  labels: {
    title: string;
    description: string;
    planLabel: string;
    currentEndDateLabel: string;
    cancelBtn: string;
    confirmBtn: string;
    processing: string;
    close: string;
  };
  onClose: () => void;
  onConfirm: () => void;
}

export default function RenewConfirmModal({
  subscription,
  endDateText,
  isProcessing,
  labels,
  onClose,
  onConfirm,
}: RenewConfirmModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose, isProcessing]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isProcessing) onClose();
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-slate-700">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {labels.title}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {labels.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label={labels.close}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 p-5">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-gray-500 dark:text-gray-400">
                  {labels.planLabel}
                </dt>
                <dd className="text-right font-semibold text-gray-900 dark:text-white">
                  {subscription.planName}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-gray-200 pt-2.5 dark:border-slate-700">
                <dt className="text-gray-500 dark:text-gray-400">
                  {labels.currentEndDateLabel}
                </dt>
                <dd className="text-right font-semibold tabular-nums text-gray-900 dark:text-white">
                  {endDateText}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50/50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            {labels.cancelBtn}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {labels.processing}
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                {labels.confirmBtn}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
