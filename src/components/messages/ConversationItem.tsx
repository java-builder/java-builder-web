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

  const hasUnread = conv.unreadCount > 0;

  return (
    <div
      onClick={() => onSelectConversation(conv)}
      className={`p-3 flex items-start gap-3 transition-all cursor-pointer group relative ${isActive
        ? "bg-accent/10 border-l-4 border-accent text-foreground"
        : hasUnread
          ? "bg-accent/5 dark:bg-accent/10 hover:bg-muted/60"
          : "hover:bg-muted/60"
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

      <div className="flex-1 min-w-0 pr-1">
        <h3 className={`text-xs truncate flex items-center gap-1.5 min-w-0 mb-0.5 ${hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground/90"}`}>
          <span className="truncate">{conv.name}</span>
          {conv.isPinned && (
            <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
          )}
        </h3>

        {conv.courseTag && conv.courseTag !== "Thành viên" && (
          <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.2 rounded-md mb-0.5 inline-block">
            {conv.courseTag}
          </span>
        )}

        <div className="flex items-center gap-1 text-xs min-w-0 mt-0.5">
          <span className={`truncate shrink min-w-0 ${hasUnread ? "font-bold text-foreground dark:text-gray-100" : "font-normal text-muted-foreground"}`}>
            {conv.lastMessage ? (
              conv.lastMessage.type === "code"
                ? "💻 Đoạn code Java"
                : conv.lastMessage.type === "exercise"
                  ? "📝 Bài tập Java"
                  : conv.lastMessage.type === "image"
                    ? "📷 Hình ảnh"
                    : conv.lastMessage.type === "file"
                      ? "📎 Tài liệu đính kèm"
                      : conv.lastMessage.type === "video"
                        ? "🎥 Video"
                        : conv.lastMessage.content || "Chưa có tin nhắn"
            ) : (
              "Chưa có tin nhắn"
            )}
          </span>

          {conv.lastMessage && (
            <>
              <span className="text-muted-foreground/40 text-[10px] shrink-0 font-bold">•</span>
              <span className={`text-[11px] shrink-0 ${hasUnread ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                {conv.lastMessage.timestamp}
              </span>
            </>
          )}
        </div>
      </div>

      <div
        ref={isMenuOpen ? menuRef : null}
        className="shrink-0 flex items-center gap-1.5 relative z-10"
      >
        <div onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => onToggleMenu(conv.id, e)}
            className={`w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted bg-card/90 border border-border/60 shadow-xs transition-all cursor-pointer ${isMenuOpen
              ? "opacity-100 bg-muted text-foreground scale-105"
              : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
              }`}
            title="Tùy chọn cuộc trò chuyện"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {isMuted && (
          <span title="Đã tắt thông báo" className="inline-flex items-center text-muted-foreground/60">
            <BellOff className="w-3.5 h-3.5" />
          </span>
        )}

        {/* Facebook Messenger Blue Unread Dot */}
        {hasUnread && (
          <span
            className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0 shadow-xs animate-in fade-in zoom-in-95 duration-200"
            title={`${conv.unreadCount} tin nhắn chưa đọc`}
          />
        )}

        {isMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full mt-1 z-50 w-48 p-1.5 rounded-2xl bg-card border border-border shadow-2xl text-xs font-medium space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute(conv.id);
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(conv);
              }}
              className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{conv.isPinned ? "Bỏ ghim nhóm" : "Ghim lên đầu"}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleUnread(conv);
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
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
