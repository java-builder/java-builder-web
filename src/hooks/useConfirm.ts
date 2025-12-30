import Swal from "sweetalert2";
import toast from "react-hot-toast";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "error" | "info" | "success";
}

export const useConfirm = () => {
  const confirm = async (
    onConfirm: () => void | Promise<void>,
    options: ConfirmOptions = {},
  ): Promise<void> => {
    const {
      title = "Xác nhận",
      message = "Bạn có chắc chắn muốn thực hiện hành động này?",
      confirmText = "Xác nhận",
      cancelText = "Hủy",
      type = "warning",
    } = options;

    try {
      const result = await Swal.fire({
        title,
        html: message,
        icon: type,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        focusCancel: true,
        width: "400px",
        padding: "2rem",
        backdrop: "rgba(0,0,0,0.4)",
        showClass: {
          popup: "animate__animated animate__fadeIn animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOut animate__faster",
        },
        customClass: {
          popup: "swal-modern-popup",
          title: "swal-modern-title",
          htmlContainer: "swal-modern-text",
          confirmButton: "swal-modern-confirm",
          cancelButton: "swal-modern-cancel",
          actions: "swal-modern-actions",
          icon: "swal-modern-icon",
        },
        buttonsStyling: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
      });

      if (result.isConfirmed) {
        const loadingToast = toast.loading("Đang xử lý...", {
          style: {
            borderRadius: "10px",
            background: "#1f2937",
            color: "#fff",
            fontSize: "14px",
            padding: "12px 16px",
          },
        });

        try {
          await onConfirm();
          toast.dismiss(loadingToast);
          toast.success("Thành công!", {
            duration: 2500,
            style: {
              borderRadius: "10px",
              background: "#10b981",
              color: "#fff",
              fontSize: "14px",
              padding: "12px 16px",
            },
          });
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error("Có lỗi xảy ra!", {
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#ef4444",
              color: "#fff",
              fontSize: "14px",
              padding: "12px 16px",
            },
          });
          throw error;
        }
      }
    } catch (error) {
      console.error("Confirm dialog error:", error);
    }
  };

  return { confirm };
};
