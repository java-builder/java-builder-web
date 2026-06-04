export interface Stage {
  week: string;
  title: string;
  status: string;
  progress: number;
  outcome: string;
  topics: string[];
  exercises: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  currentLevel: string;
  dailyHours: string;
  computedTargetMonths: string;
  focusSkills: string[];
  weaknessesInput: string;
  createdAt: string;
  progress: number;
  confidence: number;
  selectedPace: string;
  activeStage: number;
  stages: Stage[];
  completedItems: string[];
}

export interface WeakPoint {
  title: string;
  description: string;
  priority: string;
  tone: "rose" | "amber" | "blue";
}

export interface Task {
  title: string;
  time: string;
  type: string;
}

export interface FocusArea {
  label: string;
  value: number;
  color: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  timeEstimate: string;
  weakPointTitle: string;
  completed: boolean;
}
