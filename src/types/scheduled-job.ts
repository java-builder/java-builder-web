import { EmailEventType, RecipientType } from "./email-scheduler";

export type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";

export type JobType = "EMAIL" | "NOTIFICATION" | "REPORT" | "CLEANUP" | "SYNC";

export interface ScheduledJobResponse {
  id: string;
  jobName: string;
  jobGroup: string;
  title: string;
  jobType: JobType;
  jobStatus: JobStatus;
  type?: EmailEventType;
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  recipientType?: RecipientType;
  scheduledTime?: string;     // ISO
  executedAt?: string;
  totalRecipients?: number;
  sentCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ScheduledJobSearchParams {
  page?: number;
  size?: number;
  status?: JobStatus;
  jobType?: JobType;
}
