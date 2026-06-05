interface ExerciseSummarySectionProps {
  summary: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
}

interface SummaryItem {
  name: string;
  value: number;
  description: string;
  accent?: "default" | "emerald" | "amber" | "gray";
}

const ACCENT_CLASSES = {
  default: "text-gray-900",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  gray: "text-gray-500",
} as const;

export const ExerciseSummarySection = ({ summary }: ExerciseSummarySectionProps) => {
  const items: SummaryItem[] = [
    {
      name: "Tổng bài tập",
      value: summary.total,
      description: "Số lượng bài tập trong hệ thống",
    },
    {
      name: "Đã xuất bản",
      value: summary.published,
      description: "Sẵn sàng cho học viên",
      accent: "emerald",
    },
    {
      name: "Bản nháp",
      value: summary.draft,
      description: "Đang chờ hoàn thiện",
      accent: "amber",
    },
    {
      name: "Đã lưu trữ",
      value: summary.archived,
      description: "Không hiển thị cho học viên",
      accent: "gray",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.name} className="px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              {item.name}
            </p>
            <p
              className={`mt-2 text-2xl font-bold tabular-nums ${ACCENT_CLASSES[item.accent ?? "default"]}`}
            >
              {item.value}
            </p>
            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
