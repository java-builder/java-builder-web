export enum ActivityType {
  VIEW_LESSON = "VIEW_LESSON",
  READ_BLOG = "READ_BLOG",
  READ_INTERVIEW = "READ_INTERVIEW",
  SUBMIT_EXERCISE = "SUBMIT_EXERCISE",
}

export const ActivityTypeDisplayNames: Record<ActivityType, string> = {
  [ActivityType.VIEW_LESSON]: "Xem bài học",
  [ActivityType.READ_BLOG]: "Đọc bài viết",
  [ActivityType.READ_INTERVIEW]: "Đọc câu hỏi phỏng vấn",
  [ActivityType.SUBMIT_EXERCISE]: "Nộp bài tập",
};

export const ActivityTypeColors: Record<ActivityType, string> = {
  [ActivityType.VIEW_LESSON]: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  [ActivityType.READ_BLOG]: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  [ActivityType.READ_INTERVIEW]: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  [ActivityType.SUBMIT_EXERCISE]: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
};

export interface UserDailyActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  resourceTitle: string;
  activityDateTime: string;
}
