import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface ConfirmOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'error' | 'info' | 'success';
}

export const useConfirm = () => {
    const confirm = async (
        onConfirm: () => void | Promise<void>,
        options: ConfirmOptions = {}
    ): Promise<void> => {
        const {
            title = 'Xác nhận',
            message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
            confirmText = 'Xác nhận',
            cancelText = 'Hủy bỏ',
            type = 'warning'
        } = options;

        try {
            const result = await Swal.fire({
                title,
                html: message, // Use html instead of text to support formatting
                icon: type,
                showCancelButton: true,
                confirmButtonColor: type === 'error' ? '#dc2626' : '#3b82f6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: confirmText,
                cancelButtonText: cancelText,
                reverseButtons: true,
                focusCancel: true,
                width: '420px',
                padding: '1.5rem',
                backdrop: 'rgba(0,0,0,0.5)',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
                },
                customClass: {
                    popup: 'swal-compact',
                    title: 'swal-title',
                    htmlContainer: 'swal-text',
                    confirmButton: 'swal-button swal-confirm',
                    cancelButton: 'swal-button swal-cancel',
                    actions: 'swal-actions'
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: true,
            });

            if (result.isConfirmed) {
                // Show loading toast
                const loadingToast = toast.loading('Đang xử lý...', {
                    style: {
                        borderRadius: '8px',
                        background: '#3b82f6',
                        color: '#fff',
                        fontSize: '13px',
                        padding: '8px 12px',
                        minHeight: '40px',
                    },
                });

                try {
                    await onConfirm();
                    toast.dismiss(loadingToast);
                    toast.success('Thành công!', {
                        duration: 2500,
                        style: {
                            borderRadius: '8px',
                            background: '#10b981',
                            color: '#fff',
                            fontSize: '13px',
                            padding: '8px 12px',
                            minHeight: '40px',
                        },
                    });
                } catch (error) {
                    toast.dismiss(loadingToast);
                    toast.error('Có lỗi xảy ra!', {
                        duration: 3000,
                        style: {
                            borderRadius: '8px',
                            background: '#ef4444',
                            color: '#fff',
                            fontSize: '13px',
                            padding: '8px 12px',
                            minHeight: '40px',
                        },
                    });
                    throw error;
                }
            }
        } catch (error) {
            // Handle any SweetAlert2 errors
            console.error('Confirm dialog error:', error);
        }
    };

    return { confirm };
};