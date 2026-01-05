export enum DocumentType {
  BOOK = "BOOK",
  PDF = "PDF",
  ARTICLE = "ARTICLE",
  VIDEO = "VIDEO",
  TUTORIAL = "TUTORIAL",
  OTHER = "OTHER",
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  type: DocumentType;
  url?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentRequest {
  title: string;
  description?: string;
  type: DocumentType;
  url?: string;
  coverImage?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  type?: DocumentType;
  url?: string;
  coverImage?: string;
}
