"use client";

import { PaymentDetailResponse, PaymentStatus, TransactionType, PaymentMethod, PaymentGateWay } from "@/types/payment";
import { formatApiDate } from "@/utils/dateUtils";

interface PaymentDetailModalProps {
  payment: PaymentDetailResponse;
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", text: "Thành công" };
      case PaymentStatus.PENDING:
        return { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", text: "Đang xử lý" };
      case PaymentStatus.FAILED:
        return { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", text: "Thất bại" };
      case PaymentStatus.CANCELLED:
        return { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", text: "Đã hủy" };
      case PaymentStatus.EXPIRED:
        return { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", text: "Hết hạn" };
      default:
        return { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", text: status };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

const TransactionTypeBadge = ({ type }: { type: TransactionType }) => {
  const getTypeConfig = (type: TransactionType) => {
    switch (type) {
      case TransactionType.PAYIN:
        return { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", text: "Thanh toán" };
      case TransactionType.PAYOUT:
        return { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", text: "Rút tiền" };
      case TransactionType.SUBSCRIPTION:
        return { color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400", text: "Đăng ký" };
      default:
        return { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", text: type };
    }
  };

  const config = getTypeConfig(type);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

const getPaymentMethodText = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.ONLINE_BANKING:
      return "Chuyển khoản ngân hàng";
    default:
      return method;
  }
};

const getPaymentGatewayText = (gateway: PaymentGateWay) => {
  switch (gateway) {
    case PaymentGateWay.PAYOS:
      return "PayOS";
    default:
      return gateway;
  }
};

export const PaymentDetailModal = ({ payment, onClose }: PaymentDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chi tiết thanh toán</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Mã đơn hàng: #{payment.paymentCode}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-6">
          <div className="space-y-6">
            {/* Status and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trạng thái</label>
                <div className="mt-2">
                  <StatusBadge status={payment.paymentStatus} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số tiền</label>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(payment.totalPrice)}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700"></div>

            {/* User Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Thông tin người dùng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-300">Tên người dùng</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{payment.userName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-300">Email</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 break-all">{payment.userEmail}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700"></div>

            {/* Transaction Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Thông tin giao dịch</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-300">Loại giao dịch</label>
                  <div className="mt-1">
                    <TransactionTypeBadge type={payment.transactionType} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-300">Phương thức</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {getPaymentMethodText(payment.paymentMethod)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-300">Cổng thanh toán</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {getPaymentGatewayText(payment.paymentGateway)}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            {(payment.courseTitle || payment.subscriptionPlanName) && (
              <>
                <div className="border-t border-gray-200 dark:border-slate-700"></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Sản phẩm</h3>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-300">
                      {payment.courseTitle ? "Khóa học" : "Gói đăng ký"}
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {payment.courseTitle || payment.subscriptionPlanName}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Description */}
            {payment.description && (
              <>
                <div className="border-t border-gray-200 dark:border-slate-700"></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Mô tả</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{payment.description}</p>
                </div>
              </>
            )}

            {/* Timestamps */}
            <div className="border-t border-gray-200 dark:border-slate-700"></div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Thời gian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-300">Ngày tạo</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {formatApiDate(payment.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-300">Cập nhật lần cuối</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {formatApiDate(payment.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
