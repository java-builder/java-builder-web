"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "./button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  type?: "danger" | "warning" | "info";
  loading?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant,
  type,
  loading,
  isLoading,
}: ConfirmModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const actualVariant = variant || type || "danger";
  const actualLoading = loading ?? isLoading ?? internalLoading;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !actualLoading) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, actualLoading, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      const result = onConfirm();
      if (result instanceof Promise) {
        setInternalLoading(true);
        await result;
      }
    } finally {
      setInternalLoading(false);
    }
  };

  const isHtml = typeof message === "string" && /<[a-z][\s\S]*>/i.test(message);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-200"
      onClick={() => !actualLoading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-[#E8E8E8] dark:border-[#262d3d] bg-white dark:bg-[#181d28] text-[#171717] dark:text-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#171717] dark:text-slate-100">
            {title}
          </h3>
          {isHtml ? (
            <div
              className="mt-2 text-sm text-[#64748B] dark:text-slate-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          ) : (
            <p className="mt-2 text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2.5 border-t border-[#E8E8E8] dark:border-[#262d3d] bg-[#F8F8F8]/60 dark:bg-slate-900/40 px-5 py-3.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={actualLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={actualVariant === "danger" ? "destructive" : "default"}
            size="sm"
            onClick={handleConfirm}
            loading={actualLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface UseConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function useConfirm() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: UseConfirmOptions;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    options: {},
  });

  const confirm = useCallback((options: UseConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    dialogState.resolve?.(false);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, [dialogState]);

  const handleConfirm = useCallback(() => {
    dialogState.resolve?.(true);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, [dialogState]);

  const ConfirmDialog = useCallback(() => {
    if (!dialogState.isOpen) return null;
    return (
      <ConfirmModal
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={dialogState.options.title}
        message={dialogState.options.message}
        confirmText={dialogState.options.confirmText}
        cancelText={dialogState.options.cancelText}
        variant={dialogState.options.variant}
      />
    );
  }, [dialogState, handleClose, handleConfirm]);

  return { confirm, ConfirmDialog };
}

export default ConfirmModal;
