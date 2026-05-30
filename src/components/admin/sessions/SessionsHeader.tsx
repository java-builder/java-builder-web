interface SessionsHeaderProps {
  query: string;
  onSearch: (value: string) => void;
}

export const SessionsHeader = ({ query, onSearch }: SessionsHeaderProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý phiên đăng nhập
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Theo dõi và quản lý bảo mật cho các phiên truy cập hệ thống.
          </p>

          {/* Feature hints */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-full border border-rose-100 dark:border-rose-900/30">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Thu hồi 1 phiên cụ thể
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full border border-orange-100 dark:border-orange-900/30">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Thu hồi tất cả phiên của user
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-900/30">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Tìm theo trình duyệt, IP, thiết bị, OS
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:items-center lg:flex-shrink-0">
          <div className="relative w-full sm:w-72 group">
            <input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
              aria-label="Tìm kiếm phiên"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
          <a
            href="/admin/reports#session-analytics"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all shadow-sm text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Xem thống kê
          </a>
        </div>
      </div>
    </div>
  );
};
