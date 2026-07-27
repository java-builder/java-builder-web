"use client";

import { useState } from "react";
import Image from "next/image";
import { ChatMessage, ChatUser } from "./types";
import { EnrolledUserResponse } from "@/services/enrollment.service";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import EmojiPickerPopover from "./EmojiPickerPopover";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import ImageModal from "./ImageModal";
import FilePreviewModal from "./FilePreviewModal";
import {
  Code2,
  Copy,
  Check,
  Award,
  ExternalLink,
  Smile,
  CheckCheck,
  FileText,
  FileCode2,
  FileSpreadsheet,
  FileImage,
  Archive,
  Music,
  Film,
  Presentation,
  Download,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

interface ChatMessageItemProps {
  message: ChatMessage;
  sender?: EnrolledUserResponse | ChatUser;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const getFileTypeInfo = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  // 1. PDF Documents (Crimson Red Theme)
  if (ext === "pdf") {
    return {
      label: "Tài liệu PDF",
      extUpper: "PDF",
      badgeBg: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
      iconBg: "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-sm shadow-red-500/30",
      isMeIconBg: "bg-red-500 text-white border border-white/40 shadow-xs",
      Icon: FileText,
    };
  }

  // 2. Word Documents (Royal Blue Theme)
  if (["doc", "docx", "txt", "rtf"].includes(ext)) {
    return {
      label: "Văn bản Word",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
      iconBg: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30",
      isMeIconBg: "bg-blue-600 text-white border border-white/40 shadow-xs",
      Icon: FileText,
    };
  }

  // 3. Excel Spreadsheets (Emerald Green Theme)
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) {
    return {
      label: "Bảng tính Excel",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      iconBg: "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/30",
      isMeIconBg: "bg-emerald-600 text-white border border-white/40 shadow-xs",
      Icon: FileSpreadsheet,
    };
  }

  // 4. PowerPoint Presentations (Coral Orange Theme)
  if (["ppt", "pptx", "key"].includes(ext)) {
    return {
      label: "Trình chiếu PPT",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
      iconBg: "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm shadow-orange-500/30",
      isMeIconBg: "bg-orange-500 text-white border border-white/40 shadow-xs",
      Icon: Presentation,
    };
  }

  // 5. Source Code / Dev Files (Sky Blue Theme)
  if (["java", "js", "ts", "jsx", "tsx", "py", "html", "css", "json", "sql", "xml", "cpp", "c", "sh"].includes(ext)) {
    return {
      label: "Mã nguồn",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30",
      iconBg: "bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-sm shadow-sky-500/30",
      isMeIconBg: "bg-sky-500 text-white border border-white/40 shadow-xs",
      Icon: FileCode2,
    };
  }

  // 6. Archives / Compressed (Amber Gold Theme)
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) {
    return {
      label: "Tệp nén Archive",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-sm shadow-amber-500/30",
      isMeIconBg: "bg-amber-500 text-white border border-white/40 shadow-xs",
      Icon: Archive,
    };
  }

  // 7. Audio Files (Purple Theme)
  if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)) {
    return {
      label: "Tệp âm thanh",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
      iconBg: "bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-sm shadow-purple-500/30",
      isMeIconBg: "bg-purple-600 text-white border border-white/40 shadow-xs",
      Icon: Music,
    };
  }

  // 8. Video Files (Rose Theme)
  if (["mp4", "mkv", "mov", "avi", "webm"].includes(ext)) {
    return {
      label: "Tệp Video",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
      iconBg: "bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-sm shadow-rose-500/30",
      isMeIconBg: "bg-rose-600 text-white border border-white/40 shadow-xs",
      Icon: Film,
    };
  }

  // 9. Images (Teal Theme)
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) {
    return {
      label: "Hình ảnh",
      extUpper: ext.toUpperCase(),
      badgeBg: "bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30",
      iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm shadow-teal-500/30",
      isMeIconBg: "bg-teal-500 text-white border border-white/40 shadow-xs",
      Icon: FileImage,
    };
  }

  // Default fallback
  return {
    label: "Tài liệu",
    extUpper: ext.toUpperCase() || "FILE",
    badgeBg: "bg-accent/20 text-accent border-accent/30",
    iconBg: "bg-gradient-to-br from-accent to-blue-600 text-white shadow-sm shadow-accent/30",
    isMeIconBg: "bg-accent text-white border border-white/40 shadow-xs",
    Icon: FileText,
  };
};

export default function ChatMessageItem({
  message,
  sender,
  onAddReaction,
}: ChatMessageItemProps) {
  const currentUser = useChatCurrentUser();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const isMe = message.senderId === currentUser?.id;
  const isAutoFileText =
    message.content?.startsWith("Đã chia sẻ tệp tài liệu:") ||
    message.content?.startsWith("Đã đính kèm file:");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success("Đã sao chép mã nguồn");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className={`group flex items-start gap-2.5 my-3 px-1 transition-all ${
        isMe ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Sender Avatar */}
      {!isMe && (
        <div className="relative shrink-0 mt-0.5">
          <Image
            src={
              sender?.avatar ||
              message.senderAvatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            }
            alt={message.senderName || "User"}
            width={32}
            height={32}
            unoptimized
            className="w-8 h-8 rounded-full object-cover border border-border/80 shadow-2xs"
          />
        </div>
      )}

      {/* Message Content Area */}
      <div className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
        {/* Sender Name (Only for incoming messages) */}
        {!isMe && (
          <span className="text-[11px] font-bold text-muted-foreground mb-1 ml-1 truncate max-w-full">
            {message.senderName || (sender as EnrolledUserResponse)?.username || (sender as ChatUser)?.name || "Thành viên"}
          </span>
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
            {message.content && !isAutoFileText && (
              <div className={`text-left text-sm w-full [&_.my-6]:my-2 [&_p]:mb-1.5 [&_p:last-child]:mb-0 ${isMe ? "[&_p]:text-white" : ""}`}>
                <PublicMarkdownRenderer
                  content={message.content}
                  className="prose dark:prose-invert max-w-none text-left text-sm"
                />
              </div>
            )}

            {/* Legacy Code Snippet Card */}
            {message.type === "code" && message.codeData && !message.content?.includes("```") && (
              <div className="mt-2.5 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden text-left shadow-lg max-w-full">
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
                <div className="p-3 text-xs overflow-x-auto">
                  <PublicMarkdownRenderer
                    content={`\`\`\`${message.codeData.language}\n${message.codeData.code}\n\`\`\``}
                  />
                </div>
              </div>
            )}

            {/* Image Message */}
            {message.type === "image" && message.mediaUrl && (
              <>
                <div className="mt-2 rounded-xl overflow-hidden border border-border max-w-sm">
                  <Image
                    src={message.mediaUrl}
                    alt="Attachment"
                    width={400}
                    height={300}
                    unoptimized
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                </div>
                <ImageModal
                  isOpen={isImageModalOpen}
                  imageUrl={message.mediaUrl}
                  onClose={() => setIsImageModalOpen(false)}
                  title={message.content || "Hình ảnh đính kèm"}
                />
              </>
            )}

            {/* Document File Message */}
            {message.type === "file" && (
              <div className={message.content && !isAutoFileText ? "mt-2.5" : ""}>
                {(() => {
                  const fileName = message.fileData?.name || message.attachments?.[0]?.attachmentName || "Tài liệu đính kèm";
                  const fileUrl = message.mediaUrl || message.attachments?.[0]?.attachmentUrl || message.fileData?.url || "#";
                  const fileSize = message.fileData?.size || (message.attachments?.[0] ? (message.attachments[0].attachmentSize / (1024 * 1024)).toFixed(1) + " MB" : "");
                  const { label, extUpper, badgeBg, iconBg, isMeIconBg, Icon } = getFileTypeInfo(fileName);

                  return (
                    <>
                      <div
                        onClick={() => setIsFileModalOpen(true)}
                        className={`p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3.5 shadow-xs cursor-pointer min-w-[260px] sm:min-w-[320px] group/filecard ${
                          isMe
                            ? "bg-white/10 dark:bg-white/10 border-white/20 hover:border-white/40 text-white backdrop-blur-md"
                            : "bg-card/95 border-border/80 text-foreground hover:border-accent/40 shadow-2xs"
                        }`}
                      >
                        {/* Left Icon Badge Box */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm transition-transform group-hover/filecard:scale-105 ${
                              isMe ? isMeIconBg : iconBg
                            }`}
                          >
                            <Icon className="w-4.5 h-4.5" />
                            <span className="text-[7.5px] font-black uppercase tracking-tighter opacity-95 leading-none mt-0.5">
                              {extUpper}
                            </span>
                          </div>

                          {/* Title & Metadata Line */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <h5 className={`text-xs font-bold truncate leading-snug group-hover/filecard:underline ${isMe ? "text-white" : "text-foreground"}`}>
                              {fileName}
                            </h5>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${isMe ? "bg-white/20 text-white border-white/30" : badgeBg}`}>
                                {extUpper}
                              </span>
                              <span className={`text-[10px] font-medium ${isMe ? "text-white/80" : "text-muted-foreground"}`}>
                                {fileSize ? `${fileSize} • ` : ""}{label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setIsFileModalOpen(true)}
                            style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", borderRadius: "9999px", padding: 0 }}
                            className={`p-0 rounded-full shrink-0 flex items-center justify-center transition-transform cursor-pointer overflow-hidden border-0 outline-none hover:scale-105 active:scale-95 ${
                              isMe
                                ? "bg-white/20 hover:bg-white/30 text-white"
                                : "bg-accent/10 hover:bg-accent/20 text-accent"
                            }`}
                            title="Xem trước nội dung tệp"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                          </button>
                          <a
                            href={fileUrl}
                            style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", borderRadius: "9999px", padding: 0 }}
                            onClick={async (e) => {
                              if (fileUrl && fileUrl !== "#") {
                                e.preventDefault();
                                toast.loading(`Đang tải tệp ${fileName}...`, { id: "file-down" });
                                try {
                                  const res = await fetch(fileUrl);
                                  const blob = await res.blob();
                                  const bUrl = window.URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = bUrl;
                                  a.download = fileName;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  window.URL.revokeObjectURL(bUrl);
                                  toast.success("Tải tệp thành công!", { id: "file-down" });
                                } catch {
                                  window.open(fileUrl, "_blank");
                                  toast.dismiss("file-down");
                                }
                              }
                            }}
                            className={`p-0 rounded-full shrink-0 flex items-center justify-center transition-transform cursor-pointer overflow-hidden border-0 outline-none hover:scale-105 active:scale-95 ${
                              isMe
                                ? "bg-white text-accent hover:bg-white/90 font-bold"
                                : "bg-accent text-white hover:bg-accent/90"
                            }`}
                            title="Tải tệp về máy"
                          >
                            <Download className="w-4 h-4 shrink-0" />
                          </a>
                        </div>
                      </div>

                      <FilePreviewModal
                        isOpen={isFileModalOpen}
                        fileName={fileName}
                        fileUrl={fileUrl}
                        fileSize={fileSize}
                        onClose={() => setIsFileModalOpen(false)}
                      />
                    </>
                  );
                })()}
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
