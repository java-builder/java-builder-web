import { StatCard } from "@/components/admin/dashboard/StatCard";

interface ExerciseSummarySectionProps {
  summary: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
}

export const ExerciseSummarySection = ({ summary }: ExerciseSummarySectionProps) => {
  const stats = [
    {
      name: "Tổng bài tập",
      value: `${summary.total}`,
      description: "Số lượng bài tập hiện có trong hệ thống",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      ),
    },
    {
      name: "Đã xuất bản",
      value: `${summary.published}`,
      description: "Sẵn sàng cho học viên trên /exercises",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      name: "Bản nháp",
      value: `${summary.draft}`,
      description: "Đang chờ soạn thảo hoàn chỉnh",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      name: "Đã lưu trữ",
      value: `${summary.archived}`,
      description: "Không còn hiển thị cho học viên",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.name} {...stat} />
      ))}
    </div>
  );
};
