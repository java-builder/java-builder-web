import { Search } from "lucide-react";

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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
        />
      </div>

      {/* Level Tabs (Filter) */}
      <div className="flex flex-wrap items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border">
        {levels.map((level) => {
          const isActive = levelFilter === level.value;
          return (
            <button
              key={level.value}
              onClick={() => onLevelChange(level.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {level.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
