export interface InterviewTopicDetailResponse {
  id: string;
  slug: string;
  thumbnailUrl?: string;
  displayOrder: number;
  active?: boolean;
  totalQuestionSets?: number;
  totalQuestions?: number;
  translations: TopicTranslation[];
  createdAt: string;
  updatedAt?: string;
  questionSets?: QuestionSetResponse[];
}

export interface QuestionSetResponse {
  id: string;
  slug?: string;
  level?: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder: number;
  active: boolean;
  totalQuestions?: number;
  translations: QuestionSetTranslation[];
  questions?: InterviewQuestionItem[];
}

export interface InterviewQuestionItem {
  id: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  displayOrder: number;
  active: boolean;
  translations: InterviewQuestionTranslation[];
  isPremium?: boolean;
  isAccess?: boolean;
}

export type Locale = "VI" | "EN" | "JA" | "KO";

export function toBackendLocale(locale: string): Locale {
  return locale.toUpperCase() as Locale;
}

export interface TopicTranslation {
  id?: string;
  locale: Locale;
  name: string;
  description?: string;
}

export interface QuestionSetTranslation {
  id?: string;
  locale: Locale;
  title: string;
  description?: string;
}

export interface InterviewQuestionTranslation {
  id?: string;
  locale: Locale;
  question: string;
  answer: string;
  tips?: string;
}

export function pickTopicTranslation(
  translations: TopicTranslation[] | undefined,
  locale: string
): TopicTranslation | null {
  if (!translations || translations.length === 0) return null;
  const code = locale.toUpperCase() as Locale;
  return (
    translations.find((t) => t.locale === code) ||
    translations.find((t) => t.locale === "VI") ||
    translations.find((t) => t.locale === "EN") ||
    translations[0]
  );
}

export function pickQuestionSetTranslation(
  translations: QuestionSetTranslation[] | undefined,
  locale: string
): QuestionSetTranslation | null {
  if (!translations || translations.length === 0) return null;
  const code = locale.toUpperCase() as Locale;
  return (
    translations.find((t) => t.locale === code) ||
    translations.find((t) => t.locale === "VI") ||
    translations.find((t) => t.locale === "EN") ||
    translations[0]
  );
}

export function pickInterviewQuestionTranslation(
  translations: InterviewQuestionTranslation[] | undefined,
  locale: string
): InterviewQuestionTranslation | null {
  if (!translations || translations.length === 0) return null;
  const code = locale.toUpperCase() as Locale;
  return (
    translations.find((t) => t.locale === code) ||
    translations.find((t) => t.locale === "VI") ||
    translations.find((t) => t.locale === "EN") ||
    translations[0]
  );
}

export interface CreateInterviewTopicRequest {
  key?: string;
  displayOrder?: number;
  translations: TopicTranslation[];
}

export interface UpdateInterviewTopicRequest {
  key?: string;
  displayOrder?: number;
  active?: boolean;
  translations?: TopicTranslation[];
}

export interface UpdateTopicTranslationRequest {
  name: string;
  description?: string;
}

export interface QuestionContributionRequest {
  question: string;
  answer: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questionSetId: string;
  interviewTopicId: string;
}

export enum ContributionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface QuestionContributionDetail {
  id: string;
  question: string;
  answer: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: ContributionStatus;
  questionSetId: string;
  questionSetTitle: string;
  level: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  contributorId: string;
  contributorEmail: string;
  contributorName: string;
  contributorAvatar?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectReason?: string;
  createdAt: string;
}

export interface QuestionItemRequest {
  question: string;
  answer?: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface CreateQuestionContributionRequest {
  questionSetId?: string;
  interviewTopicId?: string;
  newQuestionSetTitle?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  level?: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  topics?: string;
  questions: QuestionItemRequest[];
}

export interface CreateQuestionContributionResponse {
  questionSetId: string;
  questionSetTitle: string;
  isNewQuestionSet: boolean;
  totalQuestions: number;
  status: string;
  createdAt: string;
}

export interface QuestionContributionDetailResponse {
  id: string;
  question: string;
  answer?: string;
  tips?: string;
  difficulty: string;
  status: string;
  questionSetId?: string;
  questionSetTitle?: string;
  level?: string;
  contributorId: string;
  contributorEmail: string;
  contributorName: string;
  contributorAvatar?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectReason?: string;
  createdAt: string;
}
