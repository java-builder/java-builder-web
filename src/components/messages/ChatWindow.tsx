"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Conversation, ChatMessage, CodeSnippetData, ExerciseCardData, FileData, MessageType } from "./types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import { chatMessageApi } from "@/services/chatMessage.service";
import ChatMessageItem from "./ChatMessageItem";
import EmojiPickerPopover from "./EmojiPickerPopover";
import {
  Send,
  Code2,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  ImageIcon,
  ArrowLeft,
  PanelLeftOpen,
  PanelLeftClose,
  MoreVertical,
  Bell,
  BellOff,
  Pin,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { MessageAttachmentRequest } from "@/types/chatMessage";

export interface TypingUser {
  userId: string;
  username?: string;
}

interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessage[];
  isMuted?: boolean;
  typingUsers?: TypingUser[];
  onTyping?: (isTyping: boolean) => void;
  onSendMessage: (
    content: string,
    type?: MessageType,
    codeData?: CodeSnippetData,
    exerciseData?: ExerciseCardData,
    fileData?: FileData,
    mediaUrl?: string,
    attachmentObj?: MessageAttachmentRequest
  ) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onOpenCodeModal: () => void;
  onToggleDrawer: () => void;
  onBackToList?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleMute?: (convId: string) => void;
  onTogglePin?: (conv: Conversation) => void;
  onToggleUnread?: (conv: Conversation) => void;
  onDeleteConversation?: (convId: string) => void;
}

export default function ChatWindow({
  conversation,
  messages,
  isMuted = false,
  typingUsers = [],
  onTyping,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  onOpenCodeModal,
  onToggleDrawer,
  onBackToList,
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleMute,
  onTogglePin,
  onToggleUnread,
  onDeleteConversation,
}: ChatWindowProps) {
  const currentUser = useChatCurrentUser();
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingActiveRef = useRef(false);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      isTypingActiveRef.current = false;
    };
  }, [conversation.id]);

  const handleTextChange = (value: string) => {
    setInputText(value);

    if (onTyping) {
      if (value.trim().length > 0) {
        if (!isTypingActiveRef.current) {
          isTypingActiveRef.current = true;
          onTyping(true);
        }

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          if (isTypingActiveRef.current) {
            isTypingActiveRef.current = false;
            onTyping(false);
          }
        }, 2000);
      } else {
        if (isTypingActiveRef.current) {
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          isTypingActiveRef.current = false;
          onTyping(false);
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target as Node)) {
        setShowHeaderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollToBottom = () => {
      container.scrollTop = container.scrollHeight;
      messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
    };

    scrollToBottom();

    const observer = new ResizeObserver(() => {
      scrollToBottom();
    });

    observer.observe(container);
    Array.from(container.children).forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [conversation.id, messages.length]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isTypingActiveRef.current && onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      isTypingActiveRef.current = false;
      onTyping(false);
    }

    if (!inputText.trim() && !selectedImage) return;

    if (selectedImage) {
      onSendMessage(
        inputText.trim() || "Đã gửi một hình ảnh",
        "image",
        undefined,
        undefined,
        undefined,
        selectedImage
      );
      setSelectedImage(null);
    } else {
      onSendMessage(inputText.trim(), "text");
    }
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error(`Kích thước ảnh (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn tối đa 100MB!`);
      if (imageInputRef.current) imageInputRef.current.value = "";
      return;
    }

    const toastId = toast.loading("Đang tải ảnh lên...");
    try {
      const att = await chatMessageApi.uploadAttachmentWithPresign(file);
      onSendMessage(
        inputText.trim() || `Đã đính kèm ảnh: ${file.name}`,
        "image",
        undefined,
        undefined,
        undefined,
        att.attachmentKey,
        att
      );
      toast.dismiss(toastId);
      setInputText("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tải ảnh thất bại";
      toast.error(msg, { id: toastId });
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error(`Kích thước file (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn tối đa 100MB!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    const toastId = toast.loading("Đang tải tài liệu lên...");
    try {
      const att = await chatMessageApi.uploadAttachmentWithPresign(file);
      onSendMessage(
        `Đã chia sẻ tệp tài liệu: ${file.name}`,
        "file",
        undefined,
        undefined,
        {
          name: file.name,
          size: sizeInMB,
          fileType: ext === "zip" || ext === "rar" ? "zip" : "pdf",
          url: "#",
        },
        att.attachmentKey,
        att
      );
      toast.dismiss(toastId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tải tài liệu thất bại";
      toast.error(msg, { id: toastId });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const otherUser =
    conversation.type === "PRIVATE"
      ? conversation.members.find((p) => p.id !== currentUser?.id)
      : null;

  const onlineMembersCount = conversation.members.filter((p) => p.status === "online").length;

  return (
    <div className="flex-1 h-full flex flex-col bg-background/50 relative overflow-hidden">
      <div className="h-14 sm:h-16 px-3 sm:px-6 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between z-10 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="md:hidden p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
              title="Quay lại danh sách tin nhắn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden md:flex p-2 -ml-1 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Mở danh sách trò chuyện" : "Thu gọn danh sách trò chuyện"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-accent" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          )}

          <div className="relative cursor-pointer" onClick={onToggleDrawer}>
            <Image
              src={
                conversation.avatar ||
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80"
              }
              alt={conversation.name}
              width={40}
              height={40}
              unoptimized
              className="w-10 h-10 rounded-full object-cover border border-border shadow-2xs"
            />
            {conversation.type === "PRIVATE" && otherUser?.status === "online" && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-xs" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5 min-w-0">
              <span className="truncate">{conversation.name}</span>
              {conversation.courseTag && conversation.courseTag !== "Thành viên" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold shrink-0 whitespace-nowrap">
                  {conversation.courseTag}
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">
                {conversation.type === "GROUP"
                  ? `${onlineMembersCount}/${conversation.members.length} thành viên Online`
                  : otherUser?.status === "online"
                    ? "Đang hoạt động"
                    : otherUser?.lastActive || "Offline"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 relative" ref={headerMenuRef}>
          <button
            type="button"
            disabled
            className="hidden sm:flex p-2 rounded-xl text-muted-foreground/40 opacity-40 cursor-not-allowed transition-colors"
            title="Tính năng thoại 1-1 chưa khả dụng"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled
            className="hidden sm:flex p-2 rounded-xl text-muted-foreground/40 opacity-40 cursor-not-allowed transition-colors"
            title="Tính năng gọi Video nhóm chưa khả dụng"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleDrawer}
            className="p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-muted transition-colors cursor-pointer"
            title="Thông tin cuộc trò chuyện & danh sách Online"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Mobile & Header 3-Dots Dropdown Menu */}
          <button
            onClick={() => setShowHeaderMenu(!showHeaderMenu)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Tùy chọn cuộc trò chuyện"
          >
            <MoreVertical className="w-4.5 h-4.5" />
          </button>

          {showHeaderMenu && (
            <div
              className="absolute right-0 top-full mt-2 z-50 w-52 p-1.5 rounded-2xl bg-card border border-border shadow-2xl text-xs font-medium space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
            >
              {onToggleMute && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleMute(conversation.id);
                    setShowHeaderMenu(false);
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
              )}

              {onTogglePin && (
                <button
                  type="button"
                  onClick={() => {
                    onTogglePin(conversation);
                    setShowHeaderMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{conversation.isPinned ? "Bỏ ghim trò chuyện" : "Ghim trò chuyện lên đầu"}</span>
                </button>
              )}

              {onToggleUnread && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleUnread(conversation);
                    setShowHeaderMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  {conversation.unreadCount > 0 ? (
                    <MailOpen className="w-3.5 h-3.5 text-accent shrink-0" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                  )}
                  <span>{conversation.unreadCount > 0 ? "Đánh dấu đã đọc" : "Đánh dấu chưa đọc"}</span>
                </button>
              )}

              {onDeleteConversation && (
                <>
                  <div className="my-1 border-t border-border/60" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowHeaderMenu(false);
                      onDeleteConversation(conversation.id);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Xóa trò chuyện</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        <div className="flex items-center justify-center my-4">
          <span className="text-[11px] font-bold text-muted-foreground px-3.5 py-1 rounded-full bg-muted border border-border">
            Hôm nay
          </span>
        </div>

        {messages.map((msg) => {
          const sender = conversation.members.find((p) => p.id === msg.senderId);
          return (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              sender={sender}
              onAddReaction={onAddReaction}
              onDeleteMessage={onDeleteMessage}
            />
          );
        })}

        <div ref={messagesEndRef} className="h-4 shrink-0" />
      </div>

      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.tar,.gz,.java,.js,.ts,.jsx,.tsx,.py,.html,.css,.json,.sql,.xml,.cpp,.c,.sh,text/plain"
        className="hidden"
      />

      <div className="p-2.5 sm:p-3.5 border-t border-border bg-card/80 backdrop-blur-md shrink-0 shadow-lg relative">
        {typingUsers && typingUsers.length > 0 && (
          <div className="absolute bottom-full mb-2.5 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/95 border border-border/80 text-xs text-muted-foreground backdrop-blur-md shadow-md animate-fade-in">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-medium text-foreground">
              {typingUsers
                .map((u) => {
                  const member = conversation.members.find((m) => m.id === u.userId);
                  return member?.username || u.username || "Ai đó";
                })
                .join(", ")}{" "}
              đang gõ tin nhắn...
            </span>
          </div>
        )}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 left-4 z-30">
            <EmojiPickerPopover
              onSelectEmoji={(emoji) => {
                handleTextChange(inputText + emoji);
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        <form onSubmit={handleSend} className="relative rounded-2xl border border-input bg-background p-2.5 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all shadow-2xs">
          <textarea
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Nhập tin nhắn học tập (gõ @, chèn code, đính kèm file)..."
            className="w-full px-2 py-1 bg-transparent text-foreground text-[16px] sm:text-sm focus:outline-none resize-none min-h-[42px] max-h-[120px] leading-relaxed placeholder:text-muted-foreground"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-1">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-1 text-muted-foreground hover:text-accent text-xs font-semibold transition-colors cursor-pointer"
                title="Chèn Emoji / Icon"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Icon</span>
              </button>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-1 text-muted-foreground hover:text-accent text-xs font-semibold transition-colors cursor-pointer"
                title="Gửi hình ảnh"
              >
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span className="hidden sm:inline">Ảnh</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-muted-foreground hover:text-accent text-xs font-semibold transition-colors cursor-pointer"
                title="Đính kèm File PDF, ZIP, Tài liệu"
              >
                <Paperclip className="w-4 h-4 text-purple-500" />
                <span className="hidden sm:inline">Tài liệu</span>
              </button>

              <button
                type="button"
                onClick={onOpenCodeModal}
                className="flex items-center gap-1 text-muted-foreground hover:text-accent text-xs font-semibold transition-colors cursor-pointer"
                title="Chia sẻ đoạn code Java"
              >
                <Code2 className="w-4 h-4 text-accent" />
                <span className="hidden sm:inline">Code</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground hidden lg:inline font-mono">
                Enter gửi • Shift+Enter xuống dòng
              </span>
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-1.5 text-accent hover:opacity-80 disabled:text-muted-foreground/30 disabled:cursor-not-allowed transition-all cursor-pointer hover:scale-110 active:scale-95 shrink-0"
                title="Gửi tin nhắn"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
