export type MessageType = "text" | "code" | "exercise" | "image" | "video" | "file" | "audio" | "system";

export type BEAttachmentType = "IMAGE" | "VIDEO" | "FILE" | "AUDIO";
export type BEMessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "AUDIO" | "SYSTEM";

export interface MessageAttachmentResponse {
  attachmentType: BEAttachmentType;
  attachmentUrl?: string;
  attachmentName: string;
  attachmentSize: number;
  mimeType: string;
}

export interface ChatMessageResponse {
  id: string;
  tempId?: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  messageType: BEMessageType;
  content?: string;
  attachments?: MessageAttachmentResponse[];
  createdAt: string;
}

export interface MessageAttachmentRequest {
  attachmentType: BEAttachmentType;
  attachmentKey: string;
  attachmentName: string;
  attachmentSize: number;
  mimeType: string;
}

export interface ChatMessageRequest {
  tempId?: string;
  conversationId: string;
  content?: string;
  messageType: BEMessageType;
  attachments?: MessageAttachmentRequest[];
}

export interface FileData {
  name: string;
  size: string;
  fileType: "pdf" | "zip" | "doc" | "image" | "video" | "audio";
  url?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface CodeSnippetData {
  language: string;
  code: string;
  title?: string;
}

export interface ExerciseCardData {
  id: string;
  title: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  score?: number;
  slug?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  conversationId: string;
  type: MessageType;
  content: string;
  codeData?: CodeSnippetData;
  exerciseData?: ExerciseCardData;
  fileData?: FileData;
  mediaUrl?: string;
  attachments?: MessageAttachmentResponse[];
  timestamp: string;
  isRead?: boolean;
  reactions?: MessageReaction[];
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
}
