import { formatPrice } from "./reportUtils";

interface ReportStatsCardsProps {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
}

export const ReportStatsCards = ({
  totalRevenue,
  totalUsers,
  totalCourses,
  totalEnrollments,
}: ReportStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* Tổng doanh thu */}
      <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
        <div className="relative">
          <p className="text-sm font-medium text-muted-foreground mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-foreground mb-2">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-xs text-green-500 font-medium">Trong khoảng thời gian đã chọn</p>
        </div>
      </div>

      {/* Tổng người dùng */}
      <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
        <div className="relative">
          <p className="text-sm font-medium text-muted-foreground mb-1">Tổng người dùng</p>
          <p className="text-2xl font-bold text-foreground mb-2">
            {totalUsers.toLocaleString()}
          </p>
          <p className="text-xs text-blue-500 font-medium">Tổng số tài khoản</p>
        </div>
      </div>

      {/* Tổng khóa học */}
      <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
        <div className="relative">
          <p className="text-sm font-medium text-muted-foreground mb-1">Tổng khóa học</p>
          <p className="text-2xl font-bold text-foreground mb-2">{totalCourses}</p>
          <p className="text-xs text-purple-500 font-medium">Tổng số khóa học</p>
        </div>
      </div>

      {/* Tổng đăng ký */}
      <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
        <div className="relative">
          <p className="text-sm font-medium text-muted-foreground mb-1">Tổng đăng ký</p>
          <p className="text-2xl font-bold text-foreground mb-2">
            {totalEnrollments.toLocaleString()}
          </p>
          <p className="text-xs text-orange-500 font-medium">Tổng lượt đăng ký khóa học</p>
        </div>
      </div>
    </div>
  );
};

