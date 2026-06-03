interface SelectOption {
  value: string;
  label: string;
  meta?: string;
}

interface LearnerFiltersPanelProps {
  exerciseOptions: SelectOption[];
  difficultyOptions: SelectOption[];
  selectedExercise: string;
  selectedDifficulty: string;
  onExerciseChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onReset: () => void;
}

export const LearnerFiltersPanel = ({
  exerciseOptions,
  difficultyOptions,
  selectedExercise,
  selectedDifficulty,
  onExerciseChange,
  onDifficultyChange,
  onReset,
}: LearnerFiltersPanelProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Bộ lọc báo cáo</h2>
          <p className="mt-1 text-sm text-gray-500">Chọn phạm vi dữ liệu để rà soát tiến độ học viên.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2A8.003 8.003 0 0020 15" />
            </svg>
            Đặt lại
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
            </svg>
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Bài tập</label>
          <div className="relative">
            <select
              value={selectedExercise}
              onChange={(event) => onExerciseChange(event.target.value)}
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {exerciseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {option.meta ? ` • ${option.meta}` : ""}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 mr-3 flex items-center text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Độ khó</label>
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(event) => onDifficultyChange(event.target.value)}
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 mr-3 flex items-center text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
