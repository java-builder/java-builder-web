"use client";

import { useState } from "react";
import { useAllPayments } from "@/hooks/usePayment";
import { PaymentSearchBar } from "@/components/admin/payments/PaymentSearchBar";
import { PaymentTableRow } from "@/components/admin/payments/PaymentTableRow";
import { PaymentDetailModal } from "@/components/admin/payments/PaymentDetailModal";
import { Pagination } from "@/components/ui/Pagination";
import { PaymentDetailResponse } from "@/types/payment";

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderCode, setOrderCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetailResponse | null>(null);

  const { data, isLoading, refetch } = useAllPayments({
    page: currentPage,
    size: 10,
    orderCode: orderCode ? Number(orderCode) : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status || undefined,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setOrderCode("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý thanh toán
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Xem và quản lý tất cả giao dịch thanh toán trong hệ thống
          </p>
        </div>
      </div>

      <PaymentSearchBar
        orderCode={orderCode}
        startDate={startDate}
        endDate={endDate}
        status={status}
        isLoading={isLoading}
        onOrderCodeChange={setOrderCode}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onStatusChange={setStatus}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Mã đơn
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Người dùng
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Sản phẩm
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Loại
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Số tiền
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="hidden xl:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-3 sm:px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-8 w-8 text-accent"
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
                  </td>
                </tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((payment) => (
                  <PaymentTableRow 
                    key={payment.id} 
                    payment={payment}
                    onClick={setSelectedPayment}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
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
                      <p className="text-lg font-medium">Không có giao dịch nào</p>
                      <p className="text-sm mt-1">Chưa có giao dịch thanh toán trong hệ thống</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data?.data && data.data.length > 0 && (
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
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
      </div>

      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
