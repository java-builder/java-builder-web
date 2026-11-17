export type LevelId = "intern" | "fresher" | "junior" | "middle" | "senior";

export type Importance = "must-have" | "recommended" | "bonus";

export interface ResourceLink {
  label: string;
  href: string;
}

export interface RoadmapCheckpoint {
  id: string;
  title: string;
  desc: string;
  importance: Importance;
  skills: string[];
  interviewQuestions?: string[];
  pitfalls?: string[];
  resourceLink?: ResourceLink;
}

export interface RoadmapPillar {
  id: string;
  title: string;
  description: string;
  iconName:
    | "code"
    | "layers"
    | "database"
    | "cpu"
    | "cloud"
    | "shield"
    | "users"
    | "git"
    | "terminal";
  checkpoints: RoadmapCheckpoint[];
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  techStack: string[];
  architectureHighlight: string;
  difficulty: "Dễ" | "Trung bình" | "Khá" | "Nâng cao" | "Chuyên gia";
}

export interface LevelColorTheme {
  primary: string;
  bgLight: string;
  textLight: string;
  badgeBg: string;
  borderLight: string;
  gradient: string;
  accentHex: string;
}

export interface RoadmapLevel {
  id: LevelId;
  title: string;
  vietnameseTitle: string;
  badge: string;
  experience: string;
  mindset: string;
  summary: string;
  colorTheme: LevelColorTheme;
  responsibilities: string[];
  pillars: RoadmapPillar[];
  projects: ProjectRecommendation[];
  typicalInterviewTopics: string[];
}

export interface CareerMatrixRow {
  dimension: string;
  description: string;
  intern: string;
  fresher: string;
  junior: string;
  middle: string;
  senior: string;
}
