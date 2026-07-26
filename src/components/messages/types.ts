export * from "@/types/user";
export * from "@/types/chatMessage";
export * from "@/types/conversation";

export type UserPresenceStatus = "online" | "offline" | "away" | "busy";

export interface ChatUser {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  role?: string;
  email?: string;
  status?: string;
  customStatus?: string;
  lastActive?: string;
  course?: string;
}

