import { ChallengeLevel } from "@/types/challenge";

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
  whyLearn: string;
  coreMission: string;
  content?: string;
  isFreePreview?: boolean;
  tasks: TaskItem[];
  keyConcepts: string[];
  mentorTip?: string;
  resources?: ResourceLink[];
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

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  totalDays: number;
  estimatedMinutesPerDay: number;
  level: ChallengeLevel;
  category: "Spring Boot" | "Java Core" | "Security" | "Database & JPA" | "DevOps & Cloud";
  tag: "HOT" | "NEW" | "PRO" | "RECOMMENDED";
  tagVariant: "hot" | "new" | "pro";
  colorGradient: string;
  iconName: string;
  enrolledCount: number;
  price?: number;
  freePreviewDays?: number;
  phases: PhaseInfo[];
  days: DayChallenge[];
}
