"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title,
  message,
}: AuthRequiredModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="w-12 h-12 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          {/* Title & Message */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title || t("authRequired.title")}</h3>
          <p className="text-sm text-gray-500 mb-5">{message || t("authRequired.message")}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t("common.later")}
            </button>
            <Link
              href="/login"
              className="flex-1 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-600 rounded-lg transition-colors"
            >
              {t("auth.login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
