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
  default: "text-foreground",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  gray: "text-muted-foreground",
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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:divide-border lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.name} className="px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.name}
            </p>
            <p
              className={`mt-2 text-2xl font-bold tabular-nums ${ACCENT_CLASSES[item.accent ?? "default"]}`}
            >
              {item.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
