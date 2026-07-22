"use client";

import { useState } from "react";
import { AdminUserStreak } from "@/types/user-streak";
import { Button } from "@/components/ui/button";
import { Send, X, Zap } from "lucide-react";

interface UserStreakReminderModalProps {
  isOpen: boolean;
  targetUser: AdminUserStreak | null;
  isSending: boolean;
  onClose: () => void;
  onSend: (data: { userIds?: string[]; title: string; body: string }) => void;
}

export const UserStreakReminderModal = ({
  isOpen,
  targetUser,
  isSending,
  onClose,
  onSend,
}: UserStreakReminderModalProps) => {
  const [title, setTitle] = useState("🔥 Nhắc nhở giữ chuỗi Streak học tập!");
  const [body, setBody] = useState(
    "Bạn còn ít giờ nữa để làm bài tập và duy trì chuỗi học tập hôm nay. Đừng bỏ lỡ nhé!"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl shadow-xl max-w-lg w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Send className="w-4 h-4 text-orange-500" />
            Gửi Push Notification Giữ Chuỗi
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {targetUser ? (
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs flex items-center justify-between">
            <span className="text-orange-700 dark:text-orange-300">
              Gửi riêng tới: <strong>{targetUser.username || targetUser.userId}</strong> ({targetUser.email})
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <Zap className="w-4 h-4 shrink-0" />
            Gửi thông báo giữ chuỗi đến toàn bộ những người dùng có nguy cơ đứt chuỗi hôm nay!
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-foreground mb-1">Tiêu đề thông báo:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-orange-500/40"
            />
          </div>

          <div>
            <label className="block font-medium text-foreground mb-1">Nội dung thông báo:</label>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-input bg-background text-xs focus:ring-1 focus:ring-orange-500/40"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl h-9 text-xs px-4"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={() => onSend({ userIds: targetUser ? [targetUser.userId] : undefined, title, body })}
            disabled={isSending}
            className="rounded-xl h-9 text-xs px-4 bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSending ? "Đang gửi..." : "Gửi ngay FCM"}
          </Button>
        </div>
      </div>
    </div>
  );
};
