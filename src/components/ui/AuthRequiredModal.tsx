"use client";

import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  showLater?: boolean;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title,
  message,
  showLater = true,
}: AuthRequiredModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={showLater ? onClose : undefined}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <UserCircle2 className="h-6 w-6" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title || t("authRequired.title")}
          </h3>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
            {message || t("authRequired.message")}
          </p>

          <div className="mt-5 flex gap-2.5">
            {showLater && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
              >
                {t("common.later")}
              </button>
            )}
            <Link
              href="/login"
              className="flex-1 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white border border-transparent transition hover:bg-accent-600 text-center"
            >
              {t("auth.login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
