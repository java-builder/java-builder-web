"use client";

import { PaymentStatus } from "@/types/payment";

interface PaymentSearchBarProps {
  orderCode: string;
  startDate: string;
  endDate: string;
  status: string;
  isLoading: boolean;
  onOrderCodeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
}

export const PaymentSearchBar = ({
  orderCode,
  startDate,
  endDate,
  status,
  isLoading,
  onOrderCodeChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onRefresh,
  onClearFilters,
}: PaymentSearchBarProps) => {
  const hasFilters = orderCode || startDate || endDate || status;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 dark:border-slate-700">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Mã đơn hàng
            </label>
            <input
              type="number"
              placeholder="Nhập mã đơn..."
              value={orderCode}
              onChange={(e) => onOrderCodeChange(e.target.value)}
              className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
            >
              <option value="">Tất cả</option>
              <option value={PaymentStatus.SUCCESS}>Thành công</option>
              <option value={PaymentStatus.PENDING}>Đang xử lý</option>
              <option value={PaymentStatus.FAILED}>Thất bại</option>
              <option value={PaymentStatus.CANCELLED}>Đã hủy</option>
              <option value={PaymentStatus.EXPIRED}>Hết hạn</option>
            </select>
          </div>

          <div className="w-full min-w-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Từ ngày
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="block w-full min-w-0 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
            />
          </div>

          <div className="w-full min-w-0">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Đến ngày
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="block w-full min-w-0 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Xóa bộ lọc
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Làm mới
          </button>
        </div>
      </div>
    </div>
  );
};
