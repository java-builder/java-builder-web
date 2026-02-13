import Link from "next/link";

const recentActivities = [
  { id: 1, user: "Nguyễn Văn A", action: "đã đăng ký khóa học", target: "React Fundamentals", time: "2 phút trước", avatar: "A" },
  { id: 2, user: "Trần Thị B", action: "đã hoàn thành bài học", target: "JavaScript Basics - Lesson 5", time: "15 phút trước", avatar: "B" },
  { id: 3, user: "Lê Văn C", action: "đã tạo khóa học mới", target: "Advanced Node.js", time: "1 giờ trước", avatar: "C" },
  { id: 4, user: "Phạm Thị D", action: "đã đánh giá khóa học", target: "Python for Beginners", time: "2 giờ trước", avatar: "D" },
];

export const RecentActivities = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
        <p className="text-sm text-gray-600">Các sự kiện mới nhất trong hệ thống</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{activity.avatar}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/admin/activities" className="text-sm text-accent-600 hover:text-accent-700 font-medium">
            Xem tất cả hoạt động →
          </Link>
        </div>
      </div>
    </div>
  );
};
