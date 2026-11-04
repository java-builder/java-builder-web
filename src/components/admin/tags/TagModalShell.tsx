"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface TagModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  isLocked?: boolean;
}

export default function TagModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  isLocked,
}: TagModalShellProps) {
  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLocked) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isLocked]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={() => !isLocked && onClose()}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 dark:border-border">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isLocked}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-muted dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-border bg-gray-50/50 px-5 py-3 dark:border-border dark:bg-surface">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
