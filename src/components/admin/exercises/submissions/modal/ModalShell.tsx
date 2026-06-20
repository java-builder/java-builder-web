"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: ModalShellProps) {
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
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card px-5 py-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
