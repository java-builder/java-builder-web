interface EnrollmentStatusPillProps {
  completed: boolean;
  progress: number;
}

export default function EnrollmentStatusPill({
  completed,
  progress,
}: EnrollmentStatusPillProps) {
  if (completed) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Hoàn thành
      </span>
    );
  }
  if (progress === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 dark:bg-gray-700 dark:text-gray-300">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        Chưa bắt đầu
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      Đang học
    </span>
  );
}
