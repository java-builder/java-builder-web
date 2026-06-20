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
    <div className="bg-muted/30 rounded-xl p-4 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bình luận, tác giả..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-foreground placeholder-muted-foreground text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-muted-foreground"
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Trạng thái:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStatusChange("ALL")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "ALL"
                  ? "bg-accent text-white"
                  : "bg-card text-foreground border border-border hover:bg-muted/40"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onStatusChange("ACTIVE")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "ACTIVE"
                  ? "bg-green-600 text-white"
                  : "bg-card text-foreground border border-border hover:bg-muted/40"
              }`}
            >
              Hiển thị
            </button>
            <button
              onClick={() => onStatusChange("DELETED")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "DELETED"
                  ? "bg-red-600 text-white"
                  : "bg-card text-foreground border border-border hover:bg-muted/40"
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
