"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function RateLimitModal({
  isOpen,
  onClose,
  title,
  message,
}: RateLimitModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-[#E8E8E8] dark:border-[#262d3d] bg-white dark:bg-[#181d28]">
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-[#FFF0E8] rounded-full flex items-center justify-center text-[#FF5A1F]">
            <svg
              className="w-7 h-7 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title || t("rateLimit.title")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-6 mb-6">
            {message || t("rateLimit.message")}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors border-[#E8E8E8] dark:border-[#262d3d] dark:bg-[#181d28] dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t("common.close")}
            </button>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-600 rounded-lg transition-colors"
            >
              {t("common.contactSupport")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
