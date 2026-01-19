interface CommentFilterProps {
  statusFilter: "ACTIVE" | "DELETED" | "ALL";
  onStatusChange: (status: "ACTIVE" | "DELETED" | "ALL") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function CommentFilter({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: CommentFilterProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bình luận, tác giả..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Trạng thái:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "ALL"
                  ? "bg-accent text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onStatusChange("ACTIVE")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "ACTIVE"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Hiển thị
            </button>
            <button
              onClick={() => onStatusChange("DELETED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "DELETED"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Đã xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
