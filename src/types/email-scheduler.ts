export type RecipientType = "ALL" | "PREMIUM" | "INACTIVE" | "CUSTOM";

export type EmailEventType =
  | "PROMOTION"
  | "MAINTENANCE_ALERT"
  | "RE_ENGAGEMENT"
  | "NEW_COURSE_ANNOUNCEMENT"
  | "APPRECIATION"
  | "BROADCAST";        // free-form HTML, no SES template

export interface ScheduleEmailRequest {
  jobLabel: string;
  subject: string;
  /**
   * Determines email rendering at Lambda:
   * - PROMOTION / MAINTENANCE_ALERT / RE_ENGAGEMENT / NEW_COURSE_ANNOUNCEMENT → SES Template
   * - BROADCAST → free-form htmlBody
   */
  type: EmailEventType;
  htmlBody?: string;          // required when type = BROADCAST
  summary: string;
  nameSender: string;
  emailSender: string;
  recipientType: RecipientType;
  variables?: Record<string, string>;
  recipients?: string[];      // chỉ dùng khi recipientType = CUSTOM
  sendImmediately: boolean;
  scheduledTime?: string;     // ISO-8601, chỉ dùng khi sendImmediately = false
}
