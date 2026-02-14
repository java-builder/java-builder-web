interface SessionsSearchBarProps {
  query: string;
  onSearch: (value: string) => void;
}

export const SessionsSearchBar = ({ query, onSearch }: SessionsSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="relative w-full sm:max-w-md group">
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
        href="/admin/sessions/analytics"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all shadow-sm text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Xem thống kê
      </a>
    </div>
  );
};
