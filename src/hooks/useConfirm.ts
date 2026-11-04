import { createElement } from "react";
import { createRoot } from "react-dom/client";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "error" | "info" | "success" | "danger";
}

const stripLeadingEmoji = (text: string): string => {
  return text
    .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\s]+/gu, "")
    .trim();
};

const resolveVariant = (
  type?: ConfirmOptions["type"],
  title?: string,
  confirmText?: string
): "danger" | "warning" | "info" => {
  if (type === "error" || type === "danger") return "danger";
  if (type === "info" || type === "success") return "info";
  const combined = `${title || ""} ${confirmText || ""}`.toLowerCase();
  if (
    combined.includes("xóa") ||
    combined.includes("delete") ||
    combined.includes("thu hồi") ||
    combined.includes("chặn")
  ) {
    return "danger";
  }
  return "warning";
};

export const confirmDialog = (options: ConfirmOptions = {}): Promise<boolean> => {
  if (typeof document === "undefined") {
    return Promise.resolve(false);
  }

  const rawTitle = options.title || "Xác nhận";
  const rawConfirmText = options.confirmText || "Xác nhận";
  const rawCancelText = options.cancelText || "Hủy";

  const title = stripLeadingEmoji(rawTitle) || rawTitle;
  const confirmText = stripLeadingEmoji(rawConfirmText) || rawConfirmText;
  const cancelText = stripLeadingEmoji(rawCancelText) || rawCancelText;
  const message =
    options.message || "Bạn có chắc chắn muốn thực hiện hành động này?";
  const variant = resolveVariant(options.type, title, confirmText);

  return new Promise<boolean>((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    let settled = false;
    const cleanup = (result: boolean) => {
      if (settled) return;
      settled = true;
      resolve(result);
      setTimeout(() => {
        root.unmount();
        container.remove();
      }, 0);
    };

    root.render(
      createElement(ConfirmModal, {
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        variant,
        onClose: () => cleanup(false),
        onConfirm: () => cleanup(true),
      })
    );
  });
};

export const useConfirm = () => {
  const confirm = async (
    onConfirm: () => void | Promise<void>,
    options: ConfirmOptions = {}
  ): Promise<void> => {
    if (typeof document === "undefined") return;

    const rawTitle = options.title || "Xác nhận";
    const rawConfirmText = options.confirmText || "Xác nhận";
    const rawCancelText = options.cancelText || "Hủy";

    const title = stripLeadingEmoji(rawTitle) || rawTitle;
    const confirmText = stripLeadingEmoji(rawConfirmText) || rawConfirmText;
    const cancelText = stripLeadingEmoji(rawCancelText) || rawCancelText;
    const message =
      options.message || "Bạn có chắc chắn muốn thực hiện hành động này?";
    const variant = resolveVariant(options.type, title, confirmText);

    await new Promise<void>((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      const root = createRoot(container);

      let settled = false;
      const cleanup = () => {
        if (settled) return;
        settled = true;
        resolve();
        setTimeout(() => {
          root.unmount();
          container.remove();
        }, 0);
      };

      root.render(
        createElement(ConfirmModal, {
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          variant,
          onClose: () => cleanup(),
          onConfirm: async () => {
            try {
              await onConfirm();
              cleanup();
              toast.success("Thành công!");
            } catch (error) {
              cleanup();
              toast.error("Có lỗi xảy ra!");
              throw error;
            }
          },
        })
      );
    });
  };

  return { confirm };
};
