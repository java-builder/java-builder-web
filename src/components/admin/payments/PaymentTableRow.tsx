import { PaymentDetailResponse, PaymentStatus, TransactionType } from "@/types/payment";
import { formatReadableDate } from "@/utils/dateUtils";

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return {
          color:
            "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
          text: "Thành công",
        };
      case PaymentStatus.PENDING:
        return {
          color:
            "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
          text: "Đang xử lý",
        };
      case PaymentStatus.FAILED:
        return {
          color:
            "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-400",
          text: "Thất bại",
        };
      case PaymentStatus.CANCELLED:
        return {
          color:
            "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-700 dark:text-gray-300",
          text: "Đã hủy",
        };
      case PaymentStatus.EXPIRED:
        return {
          color:
            "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
          text: "Hết hạn",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 ring-gray-200",
          text: status,
        };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${config.color}`}
    >
      {config.text}
    </span>
  );
};

const TransactionTypeBadge = ({ type }: { type: TransactionType }) => {
  const getTypeConfig = (type: TransactionType) => {
    switch (type) {
      case TransactionType.PAYIN:
        return {
          color:
            "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
          text: "Thanh toán",
        };
      case TransactionType.PAYOUT:
        return {
          color:
            "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
          text: "Rút tiền",
        };
      case TransactionType.SUBSCRIPTION:
        return {
          color:
            "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400",
          text: "Đăng ký",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 ring-gray-200",
          text: type,
        };
    }
  };

  const config = getTypeConfig(type);
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${config.color}`}
    >
      {config.text}
    </span>
  );
};

interface PaymentTableRowProps {
  payment: PaymentDetailResponse;
  onClick: (payment: PaymentDetailResponse) => void;
}

export const PaymentTableRow = ({ payment, onClick }: PaymentTableRowProps) => {
  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
      onClick={() => onClick(payment)}
    >
      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-200">
        #{payment.paymentCode}
      </td>
      <td className="px-4 py-3">
        <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {payment.userName}
        </div>
        <div className="truncate text-xs text-gray-500 dark:text-gray-400">
          {payment.userEmail}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="line-clamp-1 text-sm text-gray-700 dark:text-gray-200">
          {payment.courseTitle || payment.subscriptionPlanName || "—"}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <TransactionTypeBadge type={payment.transactionType} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(payment.totalPrice)}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <StatusBadge status={payment.paymentStatus} />
      </td>
      <td className="hidden whitespace-nowrap px-4 py-3 text-sm tabular-nums text-gray-500 dark:text-gray-300 xl:table-cell">
        {formatReadableDate(payment.createdAt)}
      </td>
    </tr>
  );
};
