import { WeakPoint, Task } from "../types";

export const weakPoints: WeakPoint[] = [
  {
    title: "Thiết kế REST API chưa nhất quán",
    description:
      "Cần luyện thêm cách chia resource, status code, validation và error response.",
    priority: "Ưu tiên cao",
    tone: "rose",
  },
  {
    title: "JPA query và transaction còn mỏng",
    description:
      "Dễ nhầm lazy loading, N+1 query và phạm vi transaction trong service layer.",
    priority: "Cần củng cố",
    tone: "amber",
  },
  {
    title: "Chưa có nhịp luyện bài đều",
    description: "Nên có lịch bài tập ngắn mỗi ngày thay vì học dồn vào cuối tuần.",
    priority: "Thói quen",
    tone: "blue",
  },
];

export const todayTasks: Task[] = [
  { title: "Ôn lại OOP: inheritance vs composition", time: "25 phút", type: "Lý thuyết" },
  { title: "Làm bài Collections: gom nhóm dữ liệu", time: "35 phút", type: "Coding" },
  {
    title: "Viết note 5 lỗi hay gặp khi xử lý exception",
    time: "15 phút",
    type: "Reflection",
  },
];
