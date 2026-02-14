"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMyPaymentHistory } from "@/hooks/usePayment";
import { PaymentStatus, TransactionType } from "@/types/payment";
import { formatReadableDate } from "@/utils/dateUtils";
import { Pagination } from "@/components/ui/Pagination";

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

export default function PaymentHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useMyPaymentHistory(currentPage, 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lịch sử thanh toán
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Xem lại tất cả các giao dịch thanh toán của bạn
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <svg
                  className="animate-spin h-10 w-10 text-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Mã đơn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ngày tạo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {data.data.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            #{payment.paymentCode}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                              {payment.courseTitle || payment.subscriptionPlanName || payment.description || "-"}
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
                      ))}
                    </tbody>
                  </table>
                </div>

                {data.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <Pagination
                      currentPage={data.currentPage}
                      totalPages={data.totalPages}
                      totalElements={data.totalElements}
                      pageSize={data.pageSize}
                      onPageChange={handlePageChange}
                      itemName="giao dịch"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                <svg
                  className="w-20 h-20 mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <p className="text-lg font-medium">Chưa có giao dịch nào</p>
                <p className="text-sm mt-1">Bạn chưa thực hiện giao dịch thanh toán nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
