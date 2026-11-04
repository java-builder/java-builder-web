"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface CategoryModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  isLocked?: boolean;
  maxWidth?: string;
}

export default function CategoryModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  isLocked,
  maxWidth = "max-w-2xl",
}: CategoryModalShellProps) {
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
      if (e.key === "Escape" && !isLocked) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isLocked]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs transition-all"
      onClick={() => !isLocked && onClose()}
    >
      <div
        className={`relative w-full ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4 dark:border-border">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-xs text-text-muted">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isLocked}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-primary-soft hover:text-primary disabled:opacity-50 dark:hover:bg-muted dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-5">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2.5 border-t border-border bg-slate-50/50 px-6 py-3.5 dark:border-border dark:bg-surface">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
