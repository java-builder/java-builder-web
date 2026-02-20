interface CourseFiltersProps {
  search: string;
  levelFilter: string;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

export const CourseFilters = ({
  search,
  levelFilter,
  onSearchChange,
  onLevelChange,
}: CourseFiltersProps) => {
  const levels = [
    { value: "all", label: "Tất cả" },
    { value: "BEGINNER", label: "Cơ bản" },
    { value: "INTERMEDIATE", label: "Trung cấp" },
    { value: "ADVANCED", label: "Nâng cao" },
    { value: "EXPERT", label: "Chuyên gia" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 text-sm text-gray-900 placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex divide-x divide-gray-200">
          {levels.map((level) => (
            <button
              key={level.value}
              onClick={() => onLevelChange(level.value)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                levelFilter === level.value
                  ? "bg-accent text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
