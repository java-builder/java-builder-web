"use client";

import { useState } from "react";
import Image from "next/image";
import { ChatMessage, ChatUser } from "./types";
import { EnrolledUserResponse } from "@/services/enrollment.service";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import EmojiPickerPopover from "./EmojiPickerPopover";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import {
  Code2,
  Copy,
  Check,
  Award,
  ExternalLink,
  Smile,
  ShieldCheck,
  CheckCheck,
  FileText,
  Download,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";

interface ChatMessageItemProps {
  message: ChatMessage;
  sender?: EnrolledUserResponse | ChatUser;
  onAddReaction: (messageId: string, emoji: string) => void;
}

export default function ChatMessageItem({
  message,
  sender,
  onAddReaction,
}: ChatMessageItemProps) {
  const currentUser = useChatCurrentUser();
  const isMe = message.senderId === currentUser.id;
  const user = isMe ? currentUser : sender;
  const displayName = message.senderName || (user as EnrolledUserResponse)?.username || (user as ChatUser)?.name || "Thành viên";
  const avatarUrl = (isMe ? currentUser.avatar : message.senderAvatar) || user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

  const [copiedCode, setCopiedCode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success("Đã sao chép đoạn code!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 group px-2 py-1.5 transition-colors ${
        isMe ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Image
          src={avatarUrl}
          alt={displayName}
          width={36}
          height={36}
          unoptimized
          className="w-9 h-9 rounded-full object-cover border border-border shadow-2xs"
        />
        {user?.status === "online" && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-background shadow-xs" />
        )}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-[90%] sm:max-w-[80%] md:max-w-[70%] space-y-1 min-w-0 ${isMe ? "items-end text-right" : "items-start"}`}>
        {/* Sender Name & Role Badge */}
        {!isMe && user && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-bold text-foreground truncate">{displayName}</span>
            {(user.role === "ADMIN" || user.role === "ROLE_ADMIN") && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-accent/10 text-accent font-extrabold flex items-center gap-0.5 shrink-0">
                <ShieldCheck className="w-3 h-3" /> ADMIN
              </span>
            )}
          </div>
        )}

        {/* Message Bubble Container */}
        <div className="relative group/bubble inline-block max-w-full">
          <div
            className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs transition-all max-w-full overflow-hidden ${
              isMe
                ? "bg-accent text-white rounded-tr-xs shadow-md shadow-accent/15"
                : "bg-card text-card-foreground border border-border/80 rounded-tl-xs"
            }`}
          >
            {/* Built-in System PublicMarkdownRenderer */}
            {message.content && (
              <div className={`text-left text-sm w-full [&_.my-6]:my-2 [&_p]:mb-1.5 [&_p:last-child]:mb-0 ${isMe ? "[&_p]:text-white" : ""}`}>
                <PublicMarkdownRenderer
                  content={message.content}
                  className="prose dark:prose-invert max-w-none text-left text-sm"
                />
              </div>
            )}

            {/* Legacy Code Snippet Card (if codeData is present separately) */}
            {message.type === "code" && message.codeData && !message.content?.includes("```") && (
              <div className="mt-2.5 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden text-left shadow-lg max-w-full">
                {/* Code Header Bar */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold">{message.codeData.title || "Code Snippet"}</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {message.codeData.language}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(message.codeData!.code)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body rendered via PublicMarkdownRenderer */}
                <div className="p-3 text-xs overflow-x-auto">
                  <PublicMarkdownRenderer
                    content={`\`\`\`${message.codeData.language}\n${message.codeData.code}\n\`\`\``}
                  />
                </div>
              </div>
            )}

            {/* Image Message */}
            {message.type === "image" && message.mediaUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-border max-w-sm">
                <Image
                  src={message.mediaUrl}
                  alt="Attachment"
                  width={400}
                  height={300}
                  unoptimized
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => window.open(message.mediaUrl, "_blank")}
                />
              </div>
            )}

            {/* Document File Message */}
            {message.type === "file" && message.fileData && (
              <div className="mt-2 p-3 rounded-xl bg-muted/60 border border-border text-left flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-foreground truncate">
                      {message.fileData.name}
                    </h5>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {message.fileData.size} • {message.fileData.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>
                <a
                  href={message.fileData.url || "#"}
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success(`Đang tải file ${message.fileData?.name}`);
                  }}
                  className="p-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors shrink-0 shadow-xs cursor-pointer"
                  title="Tải tài liệu"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Video Message */}
            {message.type === "video" && (
              <div className="mt-2 rounded-xl overflow-hidden border border-border bg-slate-950 p-2 text-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Film className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold truncate">Video Hướng Dẫn Thực Hành.mp4</h5>
                  <span className="text-[10px] text-slate-400">14.2 MB • 02:45</span>
                </div>
              </div>
            )}
            {message.type === "exercise" && message.exerciseData && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-muted/60 border border-border text-left text-foreground shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-accent text-white shadow-xs">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider">
                        Thử thách JavaBuilder
                      </span>
                      <h4 className="text-xs font-bold text-foreground">{message.exerciseData.title}</h4>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      message.exerciseData.difficulty === "Dễ"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : message.exerciseData.difficulty === "Trung bình"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {message.exerciseData.difficulty}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground text-[11px]">
                    Điểm tối đa: <strong className="text-emerald-600 dark:text-emerald-400">{message.exerciseData.score} pts</strong>
                  </span>
                  <a
                    href={`/exercises/${message.exerciseData.slug || ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-accent font-bold hover:underline text-xs"
                  >
                    Giải bài ngay <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Timestamp & Read Status */}
            <div
              className={`flex items-center gap-1 text-[10px] mt-1 ${
                isMe ? "justify-end text-white/80" : "text-muted-foreground"
              }`}
            >
              <span>{message.timestamp}</span>
              {isMe && <CheckCheck className="w-3.5 h-3.5 text-white/90" />}
            </div>
          </div>

          {/* Emoji Reaction Action Trigger */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 ${
              isMe ? "-left-10" : "-right-10"
            }`}
          >
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 rounded-full bg-popover border border-border text-muted-foreground hover:text-accent shadow-xs cursor-pointer"
              title="Thả cảm xúc"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <div
              className={`absolute z-30 top-full mt-1 ${
                isMe ? "right-0" : "left-0"
              }`}
            >
              <EmojiPickerPopover
                compact
                onSelectEmoji={(emoji) => {
                  onAddReaction(message.id, emoji);
                  setShowEmojiPicker(false);
                }}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>

        {/* Reaction Pill Counters */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap items-center gap-1 mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
            {message.reactions.map((r, i) => (
              <span
                key={i}
                onClick={() => onAddReaction(message.id, r.emoji)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-xs shadow-2xs cursor-pointer hover:bg-accent/10 transition-colors"
              >
                <span>{r.emoji}</span>
                <span className="text-[10px] font-bold text-foreground">{r.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
