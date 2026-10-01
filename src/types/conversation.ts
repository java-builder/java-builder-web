import { ChatMessage } from "./chatMessage";

export interface MessagingContactResponse {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role?: string;
  courseName?: string;
  status?: string;
  lastActive?: string;
}

export type ConversationType = "PRIVATE" | "GROUP";

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar?: string;
  members: MessagingContactResponse[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  isPinned?: boolean;
  isMuted?: boolean;
  courseTag?: string;
  topic?: string;
}

export interface CreateConversationRequest {
  name?: string;
  conversationAvatar?: string;
  conversationType: ConversationType;
  memberIds: string[];
}

export interface CreateConversationResponse {
  id: string;
  name?: string;
  conversationType: ConversationType;
  conversationAvatar?: string;
  createdAt?: string;
}

export interface ConversationDetailResponse {
  id: string;
  name: string;
  conversationType: ConversationType;
  conversationAvatar?: string;
  lastMessage?: string;
  lastMessageSender?: string;
  lastMessageTime?: string;
  createdAt?: string;
  unreadCount?: number;
}

