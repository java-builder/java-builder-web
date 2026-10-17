export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

export interface ResourceLink {
  title: string;
  type: "article" | "doc" | "video" | "exercise";
  url?: string;
}

export interface DayChallenge {
  day: number;
  week: number;
  phaseId: number;
  phaseName: string;
  title: string;
  tagline: string;
  estimatedMinutes: number;
  
  // The core orientation for beginners
  whyLearn: string;        // Tại sao cần học phần này trong thực tế?
  coreMission: string;     // Mục tiêu hôm nay cần đạt
  tasks: TaskItem[];       // 3-4 việc cụ thể cần làm hôm nay
  keyConcepts: string[];   // Từ khóa trọng tâm cần hiểu
  mentorTip: string;       // Lời khuyên & cạm bẫy người mới hay gặp
  resources?: ResourceLink[]; // Tài liệu tham khảo gợi ý
  
  // Progress status
  status: "completed" | "in_progress" | "locked";
}

export interface PhaseInfo {
  id: number;
  title: string;
  weekRange: string;
  dayRange: string;
  color: string;
  description: string;
  badge: string;
}
