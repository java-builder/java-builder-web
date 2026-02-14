import { PaymentDetailResponse, PaymentStatus, TransactionType } from "@/types/payment";
import { formatReadableDate } from "@/utils/dateUtils";

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

interface PaymentTableRowProps {
  payment: PaymentDetailResponse;
}

export const PaymentTableRow = ({ payment }: PaymentTableRowProps) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
        #{payment.paymentCode}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
          {payment.userName}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {payment.userEmail}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
          {payment.courseTitle || payment.subscriptionPlanName || "-"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <TransactionTypeBadge type={payment.transactionType} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(payment.totalPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={payment.paymentStatus} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatReadableDate(payment.createdAt)}
      </td>
    </tr>
  );
};
