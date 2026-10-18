export type ChallengeLevel = 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR';
export type ChallengeStatus = 'ACTIVE' | 'INACTIVE';

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface ChallengeTaskResponse {
  id: string;
  title: string;
  orderIndex: number;
}

export interface ChallengeDayResponse {
  id: string;
  dayNumber: number;
  title: string;
  coreMission?: string;
  content?: string;
  whyLearn?: string;
  keyConcepts?: string[];
  phaseId?: string;
  phaseNumber?: number;
  phaseTitle?: string;
  freePreview?: boolean;
  isFreePreview?: boolean;
  tasks?: ChallengeTaskResponse[];
}

export interface ChallengeDayDetailResponse {
  id: string;
  challengeId: string;
  challengeSlug: string;
  dayNumber: number;
  title: string;
  coreMission: string;
  content: string;
  whyLearn: string;
  keyConcepts: string[];
  phaseId?: string;
  phaseNumber?: number;
  phaseTitle?: string;
  freePreview?: boolean;
  isFreePreview?: boolean;
  tasks: ChallengeTaskResponse[];
}

export interface ChallengePhaseResponse {
  id: string;
  phaseNumber: number;
  title: string;
  startDay?: number;
  endDay?: number;
  days?: ChallengeDayResponse[];
}

export interface ChallengeResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: ChallengeLevel;
  totalDays: number;
  price?: number;
  freePreviewDays: number;
  isFree?: boolean;
  status: ChallengeStatus;
  colorGradient: string;
  category?: CategorySummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChallengeDetailResponse extends ChallengeResponse {
  phases: ChallengePhaseResponse[];
  days: ChallengeDayResponse[];
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  level: ChallengeLevel;
  totalDays: number;
  price?: number;
  freePreviewDays?: number;
  categoryId?: string;
  colorGradient: string;
}

export interface UpdateChallengeRequest {
  title?: string;
  description?: string;
  level?: ChallengeLevel;
  totalDays?: number;
  price?: number;
  freePreviewDays?: number;
  status?: ChallengeStatus;
  categoryId?: string;
  colorGradient?: string;
}

export interface CreateChallengePhaseRequest {
  challengeId: string;
  phaseNumber: number;
  title: string;
}

export interface UpdateChallengePhaseRequest {
  phaseNumber?: number;
  title?: string;
}

export interface CreateChallengeDayRequest {
  challengeId: string;
  challengePhaseId?: string;
  dayNumber: number;
  title: string;
  coreMission: string;
  content: string;
  whyLearn: string;
  keyConcepts?: string[];
  tasks?: string[];
  isFreePreview?: boolean;
}

export interface UpdateChallengeDayRequest {
  challengePhaseId?: string;
  dayNumber?: number;
  title?: string;
  coreMission?: string;
  content?: string;
  whyLearn?: string;
  keyConcepts?: string[];
  isFreePreview?: boolean;
}

export interface CreateChallengeTaskRequest {
  challengeDayId: string;
  title: string;
  orderIndex?: number;
}

export interface UpdateChallengeTaskRequest {
  title?: string;
  orderIndex?: number;
}

export interface ChallengeProgressResponse {
  challengeId: string;
  challengeSlug: string;
  completedTaskIds: string[];
  completedDayNumbers: number[];
  completedDaysCount: number;
  totalDaysCount: number;
  progressPercent: number;
}
