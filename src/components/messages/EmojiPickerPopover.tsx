"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  ThumbsUp,
  Code2,
  BookOpen,
  Smile,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface EmojiItem {
  emoji: string;
  name: string;
  category: "reaction" | "code" | "study" | "faces";
  keywords: string[];
}

export const EMOJI_CATEGORIES = [
  { id: "all", label: "Tất cả", icon: Sparkles },
  { id: "reaction", label: "Phản hồi", icon: ThumbsUp },
  { id: "code", label: "Lập trình", icon: Code2 },
  { id: "study", label: "Học tập", icon: BookOpen },
  { id: "faces", label: "Cảm xúc", icon: Smile },
] as const;

export const ALL_EMOJIS: EmojiItem[] = [
  // Phản hồi / Reaction
  { emoji: "👍", name: "Thích / Đồng ý", category: "reaction", keywords: ["like", "ok", "dong y", "thich", "good"] },
  { emoji: "❤️", name: "Yêu thích", category: "reaction", keywords: ["love", "heart", "tim", "yeu"] },
  { emoji: "🔥", name: "Bùng cháy", category: "reaction", keywords: ["fire", "hot", "chay", "dinh"] },
  { emoji: "🚀", name: "Tăng tốc / Deploy", category: "reaction", keywords: ["rocket", "deploy", "ship", "nhanh"] },
  { emoji: "👏", name: "Vỗ tay / Hoan hô", category: "reaction", keywords: ["clap", "bravo", "vo tay"] },
  { emoji: "🎉", name: "Chúc mừng / Party", category: "reaction", keywords: ["party", "chuc mung", "chinh phuc"] },
  { emoji: "💯", name: "Điểm tuyệt đối", category: "reaction", keywords: ["100", "tuyet doi", "perfect"] },
  { emoji: "💡", name: "Ý tưởng / Sáng kiến", category: "reaction", keywords: ["idea", "light", "y tuong", "hay"] },
  { emoji: "⭐", name: "Đánh giá 5 sao", category: "reaction", keywords: ["star", "sao", "xuat sac"] },
  { emoji: "🙌", name: "Tuyệt vời", category: "reaction", keywords: ["hands", "hoan ho"] },

  // Lập trình & Công nghệ JavaBuilder
  { emoji: "☕", name: "Java Core / Spring", category: "code", keywords: ["java", "coffee", "cafe", "spring"] },
  { emoji: "💻", name: "Laptop / Dev Work", category: "code", keywords: ["laptop", "pc", "computer", "lap trinh"] },
  { emoji: "🐛", name: "Lỗi Bug / Debug", category: "code", keywords: ["bug", "fix", "debug", "loi"] },
  { emoji: "⚡", name: "Tối ưu Performance", category: "code", keywords: ["zap", "fast", "speed", "performance"] },
  { emoji: "⚙️", name: "Cấu hình / Config", category: "code", keywords: ["settings", "config", "setup"] },
  { emoji: "📦", name: "Package / Maven / Gradle", category: "code", keywords: ["package", "dependency", "build"] },
  { emoji: "🔒", name: "Bảo mật / Spring Security", category: "code", keywords: ["security", "lock", "jwt", "auth"] },
  { emoji: "🛠️", name: "Công cụ / Refactor", category: "code", keywords: ["tools", "refactor", "fix"] },
  { emoji: "📊", name: "Database / SQL", category: "code", keywords: ["db", "database", "sql", "query"] },
  { emoji: "🌐", name: "REST API / Network", category: "code", keywords: ["api", "http", "network", "web"] },
  { emoji: "🤖", name: "AI Assistant / Code", category: "code", keywords: ["ai", "bot", "auto"] },
  { emoji: "🖥️", name: "Backend Server", category: "code", keywords: ["server", "backend", "system"] },

  // Học tập & Bài tập
  { emoji: "📚", name: "Tài liệu học tập", category: "study", keywords: ["book", "read", "tai lieu", "hoc"] },
  { emoji: "📝", name: "Ghi chú / Note", category: "study", keywords: ["note", "write", "ghi chu"] },
  { emoji: "🎯", name: "Mục tiêu bài tập", category: "study", keywords: ["target", "goal", "muc tieu"] },
  { emoji: "📌", name: "Ghim quan trọng", category: "study", keywords: ["pin", "quan trong"] },
  { emoji: "📋", name: "Danh sách yêu cầu", category: "study", keywords: ["checklist", "task"] },
  { emoji: "🎓", name: "Khóa học Java", category: "study", keywords: ["grad", "course", "khoa hoc"] },
  { emoji: "🧠", name: "Tư duy Thuật toán", category: "study", keywords: ["brain", "logic", "thuat toan"] },
  { emoji: "❓", name: "Hỏi đáp / Thắc mắc", category: "study", keywords: ["question", "help", "hoi"] },
  { emoji: "🏆", name: "Bảng xếp hạng / Top", category: "study", keywords: ["trophy", "top", "leaderboard"] },
  { emoji: "✅", name: "Đã hoàn thành / Pass", category: "study", keywords: ["check", "pass", "done", "xong"] },

  // Cảm xúc & Biểu cảm
  { emoji: "😀", name: "Cười vui vẻ", category: "faces", keywords: ["smile", "happy", "cuoi"] },
  { emoji: "😂", name: "Cười ra nước mắt", category: "faces", keywords: ["lol", "laugh", "hai"] },
  { emoji: "😎", name: "Ngầu / Pro Dev", category: "faces", keywords: ["cool", "pro", "ngau"] },
  { emoji: "🤔", name: "Đang suy nghĩ", category: "faces", keywords: ["think", "suy nghi", "phong doan"] },
  { emoji: "🤩", name: "Thích thú / Ấn tượng", category: "faces", keywords: ["wow", "amazed"] },
  { emoji: "🙏", name: "Cảm ơn Mentor", category: "faces", keywords: ["thanks", "please", "cam on"] },
  { emoji: "💪", name: "Cố gắng lên / Quyết tâm", category: "faces", keywords: ["flex", "strong", "co len"] },
  { emoji: "✨", name: "Lấp lánh / Mới mẻ", category: "faces", keywords: ["sparkles", "new", "magic"] },
  { emoji: "🤝", name: "Bắt tay / Hợp tác", category: "faces", keywords: ["shake", "deal", "dong doi"] },
  { emoji: "👀", name: "Đang soi Code / Review", category: "faces", keywords: ["eyes", "review", "soi"] },
];

interface EmojiPickerPopoverProps {
  onSelectEmoji: (emoji: string) => void;
  onClose?: () => void;
  className?: string;
  compact?: boolean;
}

export default function EmojiPickerPopover({
  onSelectEmoji,
  onClose,
  className = "",
  compact = false,
}: EmojiPickerPopoverProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleScrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -140 : 140;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredEmojis = useMemo(() => {
    let result = ALL_EMOJIS;

    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.emoji.includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div
      className={`z-40 rounded-2xl border border-border bg-popover/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-popover-foreground max-w-[calc(100vw-2rem)] ${
        compact ? "w-80" : "w-92 sm:w-96"
      } ${className}`}
    >
      {/* Header Bar */}
      <div className="p-2.5 border-b border-border/80 flex items-center justify-between gap-2 bg-muted/30">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm icon / emoji (ví dụ: java, bug, thích)..."
            className="w-full pl-8 pr-7 py-1 text-xs bg-background/80 border border-border/70 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs with Scroll Controls */}
      {!searchQuery && (
        <div className="relative flex items-center border-b border-border/50 bg-muted/10 px-1 py-1">
          <button
            type="button"
            onClick={() => handleScrollTabs("left")}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0 cursor-pointer"
            title="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={tabsRef}
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5 px-1 scroll-smooth flex-1"
          >
            {EMOJI_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  title={cat.label}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-white shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleScrollTabs("right")}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0 cursor-pointer"
            title="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Grid Container */}
      <div className="p-2 max-h-56 overflow-y-auto custom-scrollbar">
        {filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-6 gap-1">
            {filteredEmojis.map((item) => (
              <button
                key={item.emoji + item.name}
                type="button"
                onClick={() => {
                  onSelectEmoji(item.emoji);
                  if (onClose) onClose();
                }}
                title={`${item.name} (${item.emoji})`}
                className="group relative flex items-center justify-center p-1.5 rounded-xl hover:bg-accent/15 hover:scale-125 active:scale-95 transition-all text-xl cursor-pointer"
              >
                <span>{item.emoji}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Không tìm thấy icon nào khớp với từ khóa &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 border-t border-border/50 bg-muted/20 text-[10px] text-muted-foreground flex justify-between items-center">
        <span>JavaBuilder Developer Emoji Set</span>
        <span className="font-semibold text-accent">{filteredEmojis.length} icons</span>
      </div>
    </div>
  );
}
