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
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white shadow-2xl dark:bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E8E8E8] px-5 py-4 dark:border-border">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[#171717] dark:text-white">
              {labels.title}
            </h3>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
              {labels.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label={labels.close}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#FFF0E8] dark:bg-primary/15 hover:text-[#FF5A1F] disabled:opacity-50 dark:hover:bg-muted dark:hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 p-5">
          <div className="rounded-xl border border-[#E8E8E8] bg-[#F8F8F8] p-4 dark:border-border dark:bg-background">
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#64748B] dark:text-[#94A3B8]">
                  {labels.planLabel}
                </dt>
                <dd className="text-right font-semibold text-[#171717] dark:text-white">
                  {subscription.planName}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-[#E8E8E8] pt-2.5 dark:border-border">
                <dt className="text-[#64748B] dark:text-[#94A3B8]">
                  {labels.currentEndDateLabel}
                </dt>
                <dd className="text-right font-semibold tabular-nums text-[#171717] dark:text-white">
                  {endDateText}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E8E8E8] bg-[#F8F8F8]/60 px-5 py-3 dark:border-border dark:bg-surface">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex items-center rounded-full border border-[#E8E8E8] bg-white px-3.5 py-1.5 text-sm font-semibold text-[#171717] transition hover:bg-[#FFF0E8] hover:text-[#FF5A1F] disabled:opacity-50 dark:border-border dark:bg-surface dark:text-slate-100 dark:hover:bg-muted cursor-pointer"
          >
            {labels.cancelBtn}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] px-4 py-2 text-sm font-semibold text-white transition active:scale-95 shadow-sm shadow-[#FF5A1F]/25 disabled:opacity-60"
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
