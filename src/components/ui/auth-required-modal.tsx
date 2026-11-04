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
  redirectTo?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title,
  message,
  showLater = true,
  redirectTo,
}: AuthRequiredModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={showLater ? onClose : undefined}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-white shadow-2xl dark:bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
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
                className="flex-1 rounded-full border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition hover:bg-primary-soft/50 dark:border-border dark:bg-surface dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t("common.later")}
              </button>
            )}
            <Link
              href={loginHref}
              className="flex-1 rounded-full bg-accent px-3 py-2 text-sm font-semibold text-white border border-transparent transition hover:bg-accent-600 text-center"
            >
              {t("auth.login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
