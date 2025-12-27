export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden">
        <div className="h-56 sm:h-72 md:h-80 w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters skeleton */}
        <div className="relative mb-8">
          <div className="h-20 sm:h-24 w-full bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="h-full w-full p-4 flex items-center gap-4">
              <div className="h-10 bg-gray-100 rounded-full flex-1 animate-pulse" />
              <div className="h-10 w-40 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-10 w-36 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="aspect-video bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
