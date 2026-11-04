"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertCircle, AlertTriangle, Info, Trash2, Check } from "lucide-react";
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

function formatConfirmMessage(rawMessage: string): string {
  // 1. Strip legacy SweetAlert2 inline text-align: center & margin overrides
  let cleaned = rawMessage
    .replace(/text-align\s*:\s*center\s*;?/gi, "")
    .replace(/display\s*:\s*inline-block\s*;?/gi, "")
    .replace(/max-width\s*:\s*\d+px\s*;?/gi, "");

  // 2. Escape plain text if it doesn't contain HTML tags, then bold quoted target names ("...")
  const hasHtml = /<[a-z][\s\S]*>/i.test(cleaned);
  if (!hasHtml) {
    cleaned = cleaned
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // 3. Automatically wrap quoted target names ("..." or “...”) in <strong> if not already inside a tag attribute
  cleaned = cleaned.replace(
    /(^|[^=])"([^"<>]+)"/g,
    '$1<strong class="font-semibold text-foreground">"$2"</strong>'
  );

  return cleaned;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
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

  const formattedHtml = formatConfirmMessage(message);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-200"
      onClick={() => !actualLoading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-border bg-surface text-foreground text-left shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            {actualVariant === "danger" && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-soft text-error border border-error-border">
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
            {actualVariant === "warning" && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-soft text-warning border border-warning-border">
                <AlertTriangle className="h-5 w-5" />
              </div>
            )}
            {actualVariant === "info" && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary border border-primary-soft-border">
                <Info className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <h3 className="text-base font-bold text-foreground leading-snug text-left">
                {title}
              </h3>
              <div
                className="mt-1.5 text-sm text-text-muted leading-relaxed text-left [&_div]:!text-left [&_p]:!text-left [&_strong]:font-semibold [&_strong]:text-foreground [&_b]:font-semibold [&_b]:text-foreground"
                dangerouslySetInnerHTML={{ __html: formattedHtml }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-border bg-background/60 dark:bg-surface px-5 py-3.5">
          <Button
            type="button"
            variant="secondary"
            size="default"
            onClick={onClose}
            disabled={actualLoading}
            className="h-9 px-4 text-xs sm:text-sm font-medium rounded-full cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={
              actualVariant === "danger"
                ? "destructive"
                : actualVariant === "warning"
                ? "primary"
                : "primary"
            }
            size="default"
            onClick={handleConfirm}
            loading={actualLoading}
            className="h-9 px-4 text-xs sm:text-sm font-semibold rounded-full gap-1.5 cursor-pointer"
          >
            {!actualLoading &&
              (actualVariant === "danger" ? (
                <Trash2 className="h-3.5 w-3.5" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              ))}
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
