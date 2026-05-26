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

      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-slate-700">
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
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
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
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
