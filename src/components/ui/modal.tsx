"use client";

import * as React from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  showCloseButton?: boolean;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-5xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasDirectHeader = title || description;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full rounded-2xl border border-[#E8E8E8] dark:border-[#262d3d] bg-white dark:bg-[#181d28] text-[#171717] dark:text-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
          sizeClasses[size],
          className
        )}
      >
        {hasDirectHeader ? (
          <>
            <ModalHeader>
              <div>
                {title && <ModalTitle>{title}</ModalTitle>}
                {description && <ModalDescription>{description}</ModalDescription>}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-[#64748B] hover:text-[#FF5A1F] hover:bg-[#FFF0E8] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function ModalHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[#E8E8E8] dark:border-[#262d3d] px-5 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalTitle({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-base font-bold text-[#171717] dark:text-slate-100",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function ModalDescription({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs text-[#64748B] dark:text-slate-400 mt-1",
        className
      )}
    >
      {children}
    </p>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-5 py-4 max-h-[calc(85vh-8rem)] overflow-y-auto text-sm text-[#171717] dark:text-slate-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2.5 border-t border-[#E8E8E8] dark:border-[#262d3d] bg-[#F8F8F8]/60 dark:bg-slate-900/40 px-5 py-3.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Modal;
