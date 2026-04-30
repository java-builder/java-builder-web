// Mock data cho các trang - sẽ thay bằng API thực tế

export const mockLeaderboard = [
  { id: 1, rank: 1, username: "codewizard", avatar: null, points: 15420, courses: 12, exercises: 245 },
  { id: 2, rank: 2, username: "javamaster", avatar: null, points: 14850, courses: 11, exercises: 230 },
  { id: 3, rank: 3, username: "devpro", avatar: null, points: 13920, courses: 10, exercises: 215 },
  { id: 4, rank: 4, username: "techguru", avatar: null, points: 12500, courses: 9, exercises: 198 },
  { id: 5, rank: 5, username: "codegeek", avatar: null, points: 11800, courses: 8, exercises: 185 },
  { id: 6, rank: 6, username: "springdev", avatar: null, points: 10950, courses: 8, exercises: 172 },
  { id: 7, rank: 7, username: "fullstacker", avatar: null, points: 9870, courses: 7, exercises: 160 },
  { id: 8, rank: 8, username: "backendpro", avatar: null, points: 8920, courses: 6, exercises: 145 },
  { id: 9, rank: 9, username: "javacoder", avatar: null, points: 7850, courses: 6, exercises: 132 },
  { id: 10, rank: 10, username: "webdev", avatar: null, points: 6920, courses: 5, exercises: 118 },
];

export const timeRanges = [
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm này" },
  { value: "all", label: "Tất cả" },
];

export const mockStreakData = {
  currentStreak: 15,
  longestStreak: 45,
  totalDays: 120,
  thisWeek: [
    { date: "2024-03-18", completed: true, points: 50 },
    { date: "2024-03-19", completed: true, points: 75 },
    { date: "2024-03-20", completed: true, points: 60 },
    { date: "2024-03-21", completed: true, points: 80 },
    { date: "2024-03-22", completed: true, points: 55 },
    { date: "2024-03-23", completed: false, points: 0 },
    { date: "2024-03-24", completed: false, points: 0 },
  ],
  monthlyCalendar: generateMonthlyCalendar(),
  milestones: [
    { days: 7, title: "Streak 7 ngày", unlocked: true, reward: "50 điểm" },
    { days: 14, title: "Streak 14 ngày", unlocked: true, reward: "100 điểm" },
    { days: 30, title: "Streak 30 ngày", unlocked: false, reward: "300 điểm" },
    { days: 60, title: "Streak 60 ngày", unlocked: false, reward: "600 điểm" },
    { days: 100, title: "Streak 100 ngày", unlocked: false, reward: "1000 điểm" },
  ],
};

function generateMonthlyCalendar() {
  const calendar = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isPast = date < today;
    const isToday = date.toDateString() === today.toDateString();
    
    calendar.push({
      date: date.toISOString().split('T')[0],
      day: day,
      completed: isPast ? Math.random() > 0.3 : false, // 70% chance completed for past days
      isToday: isToday,
      isPast: isPast,
    });
  }
  
  return calendar;
}

export const mockPointsHistory = [
  { id: 1, action: "Hoàn thành khóa học Java Cơ bản", points: 500, date: "2024-03-15T10:30:00", type: "earn" },
  { id: 2, action: "Hoàn thành 10 bài tập", points: 200, date: "2024-03-14T15:20:00", type: "earn" },
  { id: 3, action: "Đóng góp câu hỏi phỏng vấn", points: 100, date: "2024-03-13T09:15:00", type: "earn" },
  { id: 4, action: "Streak 7 ngày liên tiếp", points: 150, date: "2024-03-12T08:00:00", type: "earn" },
  { id: 5, action: "Đổi voucher giảm giá 10%", points: -300, date: "2024-03-11T14:45:00", type: "spend" },
  { id: 6, action: "Hoàn thành bài tập khó", points: 50, date: "2024-03-10T16:30:00", type: "earn" },
  { id: 7, action: "Tham gia thảo luận", points: 30, date: "2024-03-09T11:20:00", type: "earn" },
  { id: 8, action: "Hoàn thành khóa học Spring Boot", points: 600, date: "2024-03-08T13:00:00", type: "earn" },
];

export const pointsBreakdown = [
  { category: "Khóa học", points: 2500, icon: "📚", color: "blue" },
  { category: "Bài tập", points: 1200, icon: "📝", color: "green" },
  { category: "Đóng góp", points: 800, icon: "🤝", color: "purple" },
  { category: "Streak", points: 450, icon: "🔥", color: "orange" },
  { category: "Thảo luận", points: 320, icon: "💬", color: "pink" },
];

export const rewards = [
  { id: 1, title: "Voucher giảm 10%", points: 300, icon: "🎟️", available: true },
  { id: 2, title: "Voucher giảm 20%", points: 500, icon: "🎫", available: true },
  { id: 3, title: "Voucher giảm 30%", points: 800, icon: "🎁", available: false },
  { id: 4, title: "1 tháng Premium miễn phí", points: 1500, icon: "⭐", available: false },
];
