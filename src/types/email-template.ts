export interface EmailTemplateContent {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface EmailTemplateResponse {
  templateName: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface CreateEmailTemplateRequest {
  templateName: string;
  content: EmailTemplateContent;
}

export interface UpdateEmailTemplateRequest {
  templateName: string;
  content: EmailTemplateContent;
}
