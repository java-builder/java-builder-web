interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemName?: string; // e.g., "phiên", "người dùng", "khóa học"
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalElements, 
  pageSize, 
  onPageChange,
  itemName = "mục"
}: PaginationProps) => {
  const getPages = () => {
    const delta = 2; 
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    const pages: (number | string)[] = [];

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("left-ellipsis");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages) {
      if (right < totalPages - 1) pages.push("right-ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-6">
      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalElements)} trong tổng số {totalElements} {itemName}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 sm:p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {getPages().map((p, idx) => {
          if (typeof p === "string") {
            return (
              <span key={`${p}-${idx}`} className="min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-1.5 sm:px-2 text-xs sm:text-sm rounded-lg font-medium flex items-center justify-center text-gray-400 dark:text-gray-500">
                &hellip;
              </span>
            );
          }

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-1.5 sm:px-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${currentPage === p
                ? "bg-accent-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-accent-600 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-accent-400"
                }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 sm:p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};
