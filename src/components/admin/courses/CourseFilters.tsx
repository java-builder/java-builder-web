interface CourseFiltersProps {
  search: string;
  categoryFilter: string;
  statusFilter: string;
  levelFilter: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

export const CourseFilters = ({
  search,
  categoryFilter,
  statusFilter,
  levelFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onLevelChange,
}: CourseFiltersProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-700 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white text-gray-700"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white text-gray-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => onLevelChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white text-gray-700"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="BEGINNER">Cơ bản</option>
            <option value="INTERMEDIATE">Trung cấp</option>
            <option value="ADVANCED">Nâng cao</option>
          </select>
        </div>
      </div>
    </div>
  );
};
