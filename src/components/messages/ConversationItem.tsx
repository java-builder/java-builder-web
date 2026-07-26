import { RefObject } from "react";
import Image from "next/image";
import { Conversation } from "./types";
import { EnrolledUserResponse } from "@/services/enrollment.service";
import {
  Pin,
  Bell,
  BellOff,
  MoreHorizontal,
  MailOpen,
  Mail,
  Trash2,
} from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  currentUser: EnrolledUserResponse;
  isActive: boolean;
  isMuted: boolean;
  menuOpenConvId: string | null;
  onSelectConversation: (conv: Conversation) => void;
  onToggleMenu: (convId: string, e: React.MouseEvent) => void;
  onToggleMute: (convId: string) => void;
  onTogglePin: (conv: Conversation) => void;
  onToggleUnread: (conv: Conversation) => void;
  onDeleteConversation: (convId: string) => void;
  menuRef: RefObject<HTMLDivElement | null>;
}

export default function ConversationItem({
  conversation: conv,
  currentUser,
  isActive,
  isMuted,
  menuOpenConvId,
  onSelectConversation,
  onToggleMenu,
  onToggleMute,
  onTogglePin,
  onToggleUnread,
  onDeleteConversation,
  menuRef,
}: ConversationItemProps) {
  const otherUser =
    conv.type === "PRIVATE"
      ? conv.members.find((p) => p.id !== currentUser.id)
      : null;

  const isOnline =
    conv.type === "PRIVATE"
      ? otherUser?.status === "online"
      : conv.members.some((p) => p.id !== currentUser.id && p.status === "online");

  const isMenuOpen = menuOpenConvId === conv.id;

  return (
    <div
      onClick={() => onSelectConversation(conv)}
      className={`p-3 flex items-start gap-3 transition-all cursor-pointer group relative ${
        isActive ? "bg-accent/10 border-l-4 border-accent text-foreground" : "hover:bg-muted/60"
      }`}
    >
      <div className="relative shrink-0">
        <Image
          src={
            conv.avatar ||
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80"
          }
          alt={conv.name}
          width={44}
          height={44}
          unoptimized
          className="w-11 h-11 rounded-full object-cover border border-border shadow-2xs"
        />
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-xs" />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h3 className="text-xs font-bold text-foreground truncate flex items-center gap-1.5 min-w-0">
            <span className="truncate">{conv.name}</span>
            {conv.isPinned && (
              <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
            )}
          </h3>

          {conv.lastMessage && (
            <span
              className={`text-[10px] font-medium shrink-0 transition-opacity duration-150 ${
                conv.unreadCount > 0 ? "text-accent font-bold" : "text-muted-foreground"
              } ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
            >
              {conv.lastMessage.timestamp}
            </span>
          )}
        </div>

        {conv.courseTag && (
          <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.2 rounded-md mb-1 inline-block">
            {conv.courseTag}
          </span>
        )}

        <div className="flex items-center justify-between gap-1.5 mt-0.5">
          <p className="text-xs text-muted-foreground truncate font-normal flex-1 min-w-0">
            {conv.lastMessage ? (
              conv.lastMessage.type === "code" ? (
                "💻 Đoạn code Java"
              ) : conv.lastMessage.type === "exercise" ? (
                "📝 Bài tập thực hành Java"
              ) : (
                conv.lastMessage.content
              )
            ) : (
              "Chưa có tin nhắn"
            )}
          </p>

          <div className="shrink-0 flex items-center gap-1">
            {isMuted && (
              <span title="Đã tắt thông báo" className="inline-flex items-center text-muted-foreground/60">
                <BellOff className="w-3.5 h-3.5" />
              </span>
            )}
            {conv.unreadCount > 0 && (
              <span className="shrink-0 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none select-none">
                {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        ref={isMenuOpen ? menuRef : null}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => onToggleMenu(conv.id, e)}
          className={`w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted bg-card border border-border/60 shadow-md transition-all cursor-pointer ${
            isMenuOpen ? "opacity-100 bg-muted text-foreground z-20 scale-105" : "opacity-0 group-hover:opacity-100 z-10"
          }`}
          title="Tùy chọn cuộc trò chuyện"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 w-48 p-1.5 rounded-2xl bg-card border border-border shadow-2xl text-xs font-medium space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => onToggleMute(conv.id)}
              className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {isMuted ? (
                <Bell className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <BellOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
              <span>{isMuted ? "Bật thông báo" : "Tắt thông báo"}</span>
            </button>

            <button
              type="button"
              onClick={() => onTogglePin(conv)}
              className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{conv.isPinned ? "Bỏ ghim nhóm" : "Ghim lên đầu"}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleUnread(conv)}
              className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {conv.unreadCount > 0 ? (
                <MailOpen className="w-3.5 h-3.5 text-accent shrink-0" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
              )}
              <span>{conv.unreadCount > 0 ? "Đánh dấu đã đọc" : "Đánh dấu chưa đọc"}</span>
            </button>

            <div className="my-1 border-t border-border/60" />

            <button
              type="button"
              onClick={() => onDeleteConversation(conv.id)}
              className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Xóa trò chuyện</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
