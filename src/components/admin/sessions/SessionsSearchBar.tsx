interface SessionsSearchBarProps {
  query: string;
  onSearch: (value: string) => void;
  isExporting: boolean;
  onExport: () => void;
}

export const SessionsSearchBar = ({ query, onSearch, isExporting, onExport }: SessionsSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1 group">
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
      <button
        onClick={onExport}
        className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm dark:from-slate-700 dark:to-slate-800 dark:border-slate-600 dark:text-white dark:hover:from-slate-600 dark:hover:to-slate-700"
        disabled={isExporting}
      >
        {isExporting ? (
          <svg className="w-4 h-4 animate-spin text-accent-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
        <span>Xuất Excel</span>
      </button>
    </div>
  );
};
