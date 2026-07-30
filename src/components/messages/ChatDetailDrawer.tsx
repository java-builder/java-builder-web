"use client";

import { useState } from "react";
import Image from "next/image";
import { Conversation } from "./types";
import {
  X,
  Users,
  Code2,
  FileText,
  Search,
  Activity,
  ChevronRight,
  FileCode,
  Download,
  FolderArchive,
  Film,
  ImageIcon,
  Bell,
  BellOff,
  Pin,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface ChatDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  isMuted?: boolean;
  onToggleMute?: (convId: string) => void;
  onTogglePin?: (conv: Conversation) => void;
  onDeleteConversation?: (convId: string) => void;
}

export default function ChatDetailDrawer({
  isOpen,
  onClose,
  conversation,
  isMuted = false,
  onToggleMute,
  onTogglePin,
  onDeleteConversation,
}: ChatDetailDrawerProps) {
  const [filterOnline, setFilterOnline] = useState<"all" | "online" | "offline">("all");
  const [memberSearch, setMemberSearch] = useState("");
  const [viewingResource, setViewingResource] = useState<"code" | "files" | null>(null);
  const [fileCategoryFilter, setFileCategoryFilter] = useState<"all" | "document" | "media" | "archive">("all");
  const [codeLangFilter, setCodeLangFilter] = useState<string>("all");
  const [resourceSearchQuery, setResourceSearchQuery] = useState<string>("");
  const [selectedCodeId, setSelectedCodeId] = useState<string>("");

  if (!isOpen) return null;

  const onlineMembers = conversation.members.filter((p) => p.status === "online");
  const offlineMembers = conversation.members.filter((p) => p.status !== "online");

  const filteredMembers = conversation.members.filter((p) => {
    const matchesName =
      (p.username || "").toLowerCase().includes(memberSearch.toLowerCase()) ||
      (p.role || "").toLowerCase().includes(memberSearch.toLowerCase());
    if (!matchesName) return false;
    if (filterOnline === "online") return p.status === "online";
    if (filterOnline === "offline") return p.status !== "offline";
    return true;
  });

  return (
    <div className="fixed md:relative inset-y-0 right-0 z-40 md:z-20 w-full sm:w-80 h-full border-l border-border bg-card text-card-foreground flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 shadow-2xl md:shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          Chi tiết cuộc trò chuyện
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 border-b border-border text-center flex flex-col items-center">
        <div className="relative mb-3">
          <Image
            src={
              conversation.avatar ||
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80"
            }
            alt={conversation.name}
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16 rounded-full object-cover border-2 border-accent/40 shadow-md"
          />
          {conversation.type === "PRIVATE" && conversation.members[1]?.status === "online" && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          )}
        </div>

        <h4 className="text-base font-bold text-foreground">{conversation.name}</h4>
        {conversation.courseTag && (
          <span className="mt-1.5 text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-extrabold">
            {conversation.courseTag}
          </span>
        )}

        {conversation.topic && (
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed px-2">
            {conversation.topic}
          </p>
        )}

        {/* Quick Action Buttons for Mute, Pin & Delete */}
        <div className="mt-4 flex items-center justify-center gap-2 w-full pt-3 border-t border-border/60">
          {onToggleMute && (
            <button
              type="button"
              onClick={() => onToggleMute(conversation.id)}
              className={`flex-1 py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isMuted
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "bg-muted/50 border-border text-foreground hover:bg-muted"
              }`}
              title={isMuted ? "Bật thông báo" : "Tắt thông báo"}
            >
              {isMuted ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              <span className="text-[11px] truncate">{isMuted ? "Bật chuông" : "Tắt chuông"}</span>
            </button>
          )}

          {onTogglePin && (
            <button
              type="button"
              onClick={() => onTogglePin(conversation)}
              className={`flex-1 py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                conversation.isPinned
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold"
                  : "bg-muted/50 border-border text-foreground hover:bg-muted"
              }`}
              title={conversation.isPinned ? "Bỏ ghim" : "Ghim trò chuyện"}
            >
              <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[11px] truncate">{conversation.isPinned ? "Đã ghim" : "Ghim"}</span>
            </button>
          )}

          {onDeleteConversation && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onDeleteConversation(conversation.id);
              }}
              className="py-2 px-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Xóa cuộc trò chuyện này"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] truncate">Xóa</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 border-b border-border bg-muted/30">
        <div className="text-xs font-semibold text-foreground mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Trạng thái Trực tuyến
          </span>
          <span className="text-[11px] text-muted-foreground font-bold">
            {conversation.members.length} người
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Online count button */}
          <button
            onClick={() => setFilterOnline(filterOnline === "online" ? "all" : "online")}
            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${filterOnline === "online"
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-xs"
              : "bg-background border-border hover:border-emerald-500/50"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {onlineMembers.length}
              </span>
            </div>
            <p className="text-[11px] font-bold text-foreground mt-1">Đang Online</p>
          </button>

          {/* Offline count button */}
          <button
            onClick={() => setFilterOnline(filterOnline === "offline" ? "all" : "offline")}
            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${filterOnline === "offline"
              ? "bg-muted border-border"
              : "bg-background border-border hover:border-muted-foreground/40"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <span className="text-xs font-extrabold text-muted-foreground">
                {offlineMembers.length}
              </span>
            </div>
            <p className="text-[11px] font-bold text-foreground mt-1">Ngoại tuyến</p>
          </button>
        </div>
      </div>

      {/* MEMBER LIST SECTION */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-accent" /> Thành viên ({filteredMembers.length})
          </h5>
          {filterOnline !== "all" && (
            <button
              onClick={() => setFilterOnline("all")}
              className="text-[10px] text-accent font-bold hover:underline"
            >
              Xem tất cả
            </button>
          )}
        </div>

        {/* Member Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Lọc tên thành viên..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Members List */}
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Image
                    src={member.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={member.username || "User"}
                    width={32}
                    height={32}
                    unoptimized
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background ${member.status === "online"
                      ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                      : member.status === "away"
                        ? "bg-amber-500"
                        : "bg-gray-400"
                      }`}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">{member.username}</span>
                    {(member.role === "ADMIN" || member.role === "ROLE_ADMIN") && (
                      <span className="text-[9px] px-1 py-0.2 rounded-md bg-accent/10 text-accent font-extrabold">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {member.status === "online" ? (
                      <span className="text-emerald-500 font-semibold">Đang Online</span>
                    ) : (
                      "Ngoại tuyến"
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shared Resource Summary */}
        <div className="pt-4 border-t border-border space-y-2">
          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Tài nguyên & File học tập
          </h5>
          <div className="space-y-1.5">
            {/* Code Java chia sẻ */}
            <button
              type="button"
              onClick={() => {
                setViewingResource("code");
                setResourceSearchQuery("");
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-border bg-muted/30 hover:bg-accent/10 hover:border-accent/40 text-xs font-medium text-foreground transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                <span>Code Java chia sẻ</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-accent">0 file</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* File & Tài liệu đã gửi */}
            <button
              type="button"
              onClick={() => {
                setViewingResource("files");
                setFileCategoryFilter("all");
                setResourceSearchQuery("");
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-border bg-muted/30 hover:bg-blue-500/10 hover:border-blue-500/40 text-xs font-medium text-foreground transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>File & Tài liệu đã gửi</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-500">0 file</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Shared Resource Viewer Modal */}
      {viewingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full bg-card text-card-foreground rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col h-[85vh] transition-all ${viewingResource === "code" ? "max-w-4xl" : "max-w-xl"
              }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-2xl ${viewingResource === "code"
                    ? "bg-accent/10 text-accent"
                    : "bg-blue-500/10 text-blue-500"
                    }`}
                >
                  {viewingResource === "code" ? (
                    <FileCode className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {viewingResource === "code"
                      ? "Trình duyệt & Tìm kiếm Code Java chia sẻ"
                      : "File & Tài liệu đã gửi (0 file)"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {viewingResource === "code"
                      ? "Xem danh sách và đọc nội dung từng snippet code được chia sẻ"
                      : "Tất cả tài liệu PDF, hình ảnh, video và file đính kèm"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingResource(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SPLIT VIEW FOR CODE SNIPPETS */}
            {viewingResource === "code" ? (
              <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Compact File List */}
                <div className="w-full md:w-2/5 border-r border-border flex flex-col bg-muted/10 shrink-0">
                  {/* Search & Language Filters */}
                  <div className="p-3 border-b border-border space-y-2 bg-background/50">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={resourceSearchQuery}
                        onChange={(e) => setResourceSearchQuery(e.target.value)}
                        placeholder="Tìm tên file code hoặc người gửi..."
                        className="w-full pl-8.5 pr-3 py-1.5 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs">
                      {["all", "Java", "Spring Boot", "SQL"].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setCodeLangFilter(lang)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${codeLangFilter === lang
                            ? "bg-accent text-white font-bold shadow-xs"
                            : "bg-background border border-border text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          {lang === "all" ? "Tất cả" : lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File List Items */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                    {(() => {
                      const sharedCodes: Array<{ id: string; title: string; lang: string; author: string; date: string; code: string }> = [];
                      const filteredCodes = sharedCodes.filter((item) => {
                        const matchesSearch =
                          item.title.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
                          item.author.toLowerCase().includes(resourceSearchQuery.toLowerCase());
                        if (!matchesSearch) return false;
                        if (codeLangFilter !== "all" && item.lang !== codeLangFilter) return false;
                        return true;
                      });

                      if (filteredCodes.length === 0) {
                        return (
                          <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                            Chưa có snippet code nào được chia sẻ.
                          </div>
                        );
                      }

                      return filteredCodes.map((item) => {
                        const isSelected = selectedCodeId === item.id;
                        const lineCount = item.code.split("\n").length;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedCodeId(item.id)}
                            className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer ${isSelected
                              ? "bg-accent/15 border-accent text-foreground shadow-xs font-bold"
                              : "bg-card border-border hover:border-accent/40 text-foreground"
                              }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Code2 className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                                <span className="text-xs truncate">{item.title}</span>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent/10 text-accent font-extrabold shrink-0">
                                {item.lang}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1.5 font-medium">
                              <span className="truncate">{item.author}</span>
                              <span className="shrink-0">{lineCount} dòng • {item.date}</span>
                            </div>
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Right Column: Full Code Viewer / Inspection Panel */}
                <div className="w-full md:w-3/5 flex flex-col bg-background overflow-hidden">
                  {(() => {
                    const sharedCodes: Array<{ id: string; title: string; lang: string; author: string; date: string; code: string }> = [];
                    const currentCode = sharedCodes.find((c) => c.id === selectedCodeId) || sharedCodes[0];

                    if (!currentCode) {
                      return (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground">
                          <Code2 className="w-8 h-8 mb-2 opacity-30 text-accent" />
                          <p>Chưa có file code nào để hiển thị.</p>
                        </div>
                      );
                    }

                    const lineCount = currentCode.code.split("\n").length;

                    return (
                      <>
                        {/* Header bar for active code file */}
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-accent" />
                                {currentCode.title}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/10 text-accent font-extrabold">
                                {currentCode.lang}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                              Người gửi: <strong>{currentCode.author}</strong> • {currentCode.date} • ({lineCount} dòng)
                            </p>
                          </div>
                        </div>

                        {/* Code Body Viewer */}
                        <div className="p-5 flex-1 overflow-y-auto bg-background">
                          <PublicMarkdownRenderer
                            content={`\`\`\`${currentCode.lang === "SQL"
                              ? "sql"
                              : currentCode.lang.includes("Spring") || currentCode.lang.includes("Java")
                                ? "java"
                                : "javascript"
                              }\n${currentCode.code}\n\`\`\``}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              /* FILES MODAL VIEW */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Category Filter for Files */}
                <div className="p-3 border-b border-border bg-muted/20 space-y-2 shrink-0">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={resourceSearchQuery}
                      onChange={(e) => setResourceSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm tài liệu theo tên hoặc người gửi..."
                      className="w-full pl-8.5 pr-3 py-1.5 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs pt-1">
                    {[
                      { id: "all", label: "Tất cả file" },
                      { id: "document", label: "📄 Tài liệu (PDF, Doc)" },
                      { id: "media", label: "🖼️ Ảnh & Video" },
                      { id: "archive", label: "📦 File nén (ZIP)" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFileCategoryFilter(tab.id as "all" | "document" | "media" | "archive")}
                        className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${fileCategoryFilter === tab.id
                          ? "bg-accent text-white font-bold shadow-xs"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File List Items */}
                <div className="p-6 overflow-y-auto space-y-3 flex-1">
                  {(() => {
                    const sharedFiles: Array<{ id: string; name: string; size: string; fileType: string; category: string; author: string; date: string }> = [];
                    const filteredFiles = sharedFiles.filter((file) => {
                      const matchesSearch =
                        file.name.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
                        file.author.toLowerCase().includes(resourceSearchQuery.toLowerCase());
                      if (!matchesSearch) return false;
                      if (fileCategoryFilter !== "all" && file.category !== fileCategoryFilter) return false;
                      return true;
                    });

                    if (filteredFiles.length === 0) {
                      return (
                        <div className="py-12 text-center text-xs text-muted-foreground font-medium flex flex-col items-center justify-center">
                          <FileText className="w-8 h-8 mb-2 opacity-30 text-blue-500" />
                          <p>Chưa có file hoặc tài liệu nào được gửi.</p>
                        </div>
                      );
                    }

                    return filteredFiles.map((file) => {
                      const isPdfDoc = file.category === "document";
                      const isMedia = file.category === "media";

                      return (
                        <div
                          key={file.id}
                          className="p-3.5 rounded-2xl border border-border bg-muted/20 flex items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-2.5 rounded-xl shrink-0 ${isPdfDoc
                                ? "bg-blue-500/10 text-blue-500"
                                : isMedia
                                  ? "bg-purple-500/10 text-purple-500"
                                  : "bg-amber-500/10 text-amber-500"
                                }`}
                            >
                              {isPdfDoc ? (
                                <FileText className="w-5 h-5" />
                              ) : isMedia ? (
                                file.fileType === "video" ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />
                              ) : (
                                <FolderArchive className="w-5 h-5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-foreground truncate">{file.name}</h5>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 font-medium">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.author}</span>
                                <span>•</span>
                                <span>{file.date}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toast.success(`Đang tải file ${file.name}`)}
                            className="px-3 py-1.5 rounded-xl bg-accent text-white hover:bg-accent/90 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" /> Tải về
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingResource(null)}
                className="px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
