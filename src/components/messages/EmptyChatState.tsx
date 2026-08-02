"use client";

import { MessageSquare, PanelLeftOpen } from "lucide-react";

interface EmptyChatStateProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export default function EmptyChatState({
  onToggleSidebar,
  isSidebarCollapsed,
}: EmptyChatStateProps) {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-muted/20 relative">
      {onToggleSidebar && isSidebarCollapsed && (
        <button
          type="button"
          onClick={onToggleSidebar}
          className="absolute top-4 left-4 p-2 rounded-xl bg-card border border-border text-foreground hover:text-accent hover:border-accent/40 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
          title="Mở danh sách trò chuyện"
        >
          <PanelLeftOpen className="w-5 h-5 text-accent shrink-0" />
        </button>
      )}

      <div className="p-4 rounded-3xl bg-accent/10 text-accent mb-4">
        <MessageSquare className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-bold text-foreground">
        Hệ thống tin nhắn học tập JavaBuilder
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
        Chọn một nhóm học tập hoặc trao đổi 1-1 với Mentor để bắt đầu thảo luận bài tập & kiến thức lập trình!
      </p>
    </div>
  );
}
