// Document types
export interface Document {
  id: string;
  title: string;
  description: string;
  type: DocumentType;
  url?: string; // For external links
  fileUrl?: string; // For uploaded files
  author?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export enum DocumentType {
  BOOK = "BOOK",
  ARTICLE = "ARTICLE",
  VIDEO = "VIDEO",
  COURSE_MATERIAL = "COURSE_MATERIAL",
  TUTORIAL = "TUTORIAL",
  LINK = "LINK",
  PDF = "PDF",
  OTHER = "OTHER",
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface CreateDocumentRequest {
  title: string;
  description: string;
  type: DocumentType;
  url?: string;
  fileUrl?: string;
  author?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {
  id: string;
}
