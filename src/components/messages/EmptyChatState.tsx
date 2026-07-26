"use client";

import { MessageSquare } from "lucide-react";

export default function EmptyChatState() {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-muted/20">
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
