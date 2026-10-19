import type { TranslationKey } from '@/contexts/I18nContext';

export type ChallengeLevel = 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR';
export type ChallengeStatus = 'ACTIVE' | 'INACTIVE';

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export type TaskLinkType =
  | 'OFFICIAL'
  | 'ARTICLE'
  | 'DOCUMENTATION'
  | 'YOUTUBE'
  | 'GITHUB';

export interface TaskLinkMeta {
  label: string;
  badgeLabel: string;
  badgeClass: string;
  defaultTitle: string;
}

export const TASK_LINK_TYPE_CONFIG: Record<TaskLinkType, TaskLinkMeta> = {
  OFFICIAL: {
    label: 'Official Documentation',
    badgeLabel: 'Official',
    badgeClass: 'bg-blue-600 text-white',
    defaultTitle: 'Official Documentation',
  },
  ARTICLE: {
    label: 'Article & Guide',
    badgeLabel: 'Article',
    badgeClass: 'bg-amber-400 text-neutral-900',
    defaultTitle: 'Article / Guide',
  },
  DOCUMENTATION: {
    label: 'Technical Documentation',
    badgeLabel: 'Docs',
    badgeClass: 'bg-sky-600 text-white',
    defaultTitle: 'Technical Documentation',
  },
  YOUTUBE: {
    label: 'YouTube Video',
    badgeLabel: 'Video',
    badgeClass: 'bg-rose-600 text-white',
    defaultTitle: 'Video Tutorial',
  },
  GITHUB: {
    label: 'GitHub Repository',
    badgeLabel: 'GitHub',
    badgeClass: 'bg-zinc-800 text-white dark:bg-zinc-700',
    defaultTitle: 'GitHub Repository',
  },
};

export const TASK_LINK_TITLE_PRESET_KEYS = [
  'officialDoc',
  'guide',
  'deepDive',
  'videoTutorial',
  'sourceCode',
  'architecture',
  'cheatSheet',
] as const;

export type TaskLinkPresetKey = (typeof TASK_LINK_TITLE_PRESET_KEYS)[number];

export const TASK_LINK_TITLE_PRESETS = [
  'Official Documentation',
  'Step-by-step Guide',
  'Deep Dive Article',
  'Hands-on Video Tutorial',
  'Source Code (GitHub)',
  'Architecture & Workflow Diagram',
  'Notes & Cheat Sheet',
] as const;

export function getLinkDisplayTitle(
  link: TaskResourceLink,
  t?: (key: TranslationKey) => string
): string {
  if (link.title && link.title.trim()) {
    return link.title.trim();
  }
  if (t) {
    const key = `taskResourceLinks.defaultTitles.${link.type}` as TranslationKey;
    const translated = t(key);
    if (translated && !translated.startsWith('taskResourceLinks.')) {
      return translated;
    }
  }
  const config = TASK_LINK_TYPE_CONFIG[link.type];
  return config ? config.defaultTitle : 'Reference Resource';
}

export interface TaskResourceLink {
  title?: string;
  url: string;
  type: TaskLinkType;
}

export interface ChallengeTaskResponse {
  id: string;
  title: string;
  orderIndex: number;
  resourceLinks?: TaskResourceLink[];
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
  isEnrolled?: boolean;
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

export interface ChallengeDayTaskRequest {
  title: string;
  resourceLinks?: TaskResourceLink[];
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
  tasks?: ChallengeDayTaskRequest[];
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
  tasks?: ChallengeDayTaskRequest[];
  isFreePreview?: boolean;
}

export interface CreateChallengeTaskRequest {
  challengeDayId: string;
  title: string;
  orderIndex?: number;
  resourceLinks?: TaskResourceLink[];
}

export interface UpdateChallengeTaskRequest {
  title?: string;
  orderIndex?: number;
  resourceLinks?: TaskResourceLink[];
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
