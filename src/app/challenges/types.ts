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
  id?: string;
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
  category: string;
  tag: "HOT" | "NEW" | "PRO" | "RECOMMENDED";
  tagVariant: "hot" | "new" | "pro";
  colorGradient: string;
  iconName: string;
  enrolledCount: number;
  price?: number;
  freePreviewDays?: number;
  isFree?: boolean;
  phases: PhaseInfo[];
  days: DayChallenge[];
}
