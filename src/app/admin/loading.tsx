export default function AdminLoading() {
  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6 animate-pulse bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Title skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2 flex-1">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-32 shrink-0" />
      </div>

      {/* Stats summary skeleton (4 boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-250 dark:bg-slate-700 rounded w-16" />
              <div className="w-8 h-8 rounded-full bg-gray-250 dark:bg-slate-700" />
            </div>
            <div className="h-8 bg-gray-250 dark:bg-slate-700 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Main Table skeleton */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/50">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-250 dark:divide-slate-700/60 bg-transparent">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-16" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
