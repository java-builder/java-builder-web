"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Send, Smartphone, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { SubscribedUser } from "./SubscribedUsersTable";
import { fcmService } from "@/services/fcm.service";

interface DirectPushModalProps {
  user: SubscribedUser;
  onClose: () => void;
  onSuccess?: () => void;
}

interface DirectPreset {
  id: string;
  name: string;
  title: string;
  body: string;
  url: string;
}

const DIRECT_PRESETS: DirectPreset[] = [
  {
    id: "tip-java",
    name: "💡 Mẹo Java Backend",
    title: "💡 Mẹo tối ưu HashMap & ConcurrentHashMap trong Java!",
    body: "Xem ngay cách sử dụng ConcurrentHashMap chuẩn chuyên nghiệp tránh Race Condition.",
    url: "/interview-topics",
  },
  {
    id: "interview",
    name: "🎯 Bộ câu hỏi phỏng vấn",
    title: "🎯 10 Câu hỏi phỏng vấn Spring Boot Senior hay gặp nhất",
    body: "Tổng hợp các câu hỏi phỏng vấn thực chiến và câu trả lời ấn tượng cho ứng viên Java.",
    url: "/interview-topics",
  },
  {
    id: "reminder",
    name: "📖 Tiếp tục bài học",
    title: "📖 Tiếp tục học nốt bài giảng dở dang trên JavaBuilder!",
    body: "Bạn đã đi được 70% chặng đường bài học này. Bấm để xem tiếp ngay!",
    url: "/my-courses",
  },
  {
    id: "streak",
    name: "🔥 Giữ chuỗi Streak",
    title: "🔥 Đừng quên rèn luyện 10 phút lập trình hôm nay!",
    body: "Bảo vệ chuỗi chăm chỉ của bạn bằng cách thử sức với 1 bài tập ngắn.",
    url: "/study-progress",
  },
];

export default function DirectPushModal({
  user,
  onClose,
  onSuccess,
}: DirectPushModalProps) {
  const [title, setTitle] = useState(
    `💡 Gửi riêng cho ${user.fullName || "bạn"}: Tips Lập Trình Java`
  );
  const [body, setBody] = useState(
    "Nền tảng JavaBuilder vừa cập nhật bộ tài liệu phỏng vấn mới dành riêng cho bạn!"
  );
  const [url, setUrl] = useState("/interview-topics");
  const [isSending, setIsSending] = useState(false);

  const handleApplyPreset = (preset: DirectPreset) => {
    setTitle(preset.title);
    setBody(preset.body);
    setUrl(preset.url);
    toast.success(`Đã áp dụng mẫu "${preset.name}"`);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Vui lòng điền tiêu đề và nội dung thông báo");
      return;
    }

    setIsSending(true);
    try {
      await fcmService.sendFCMPush({
        title,
        body,
        clickUrl: url,
        targetAudience: "Cá nhân cụ thể",
        targetUserIds: [user.id],
      });
      toast.success(`🚀 Đã gửi Push riêng cho ${user.fullName} thành công!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error sending direct push:", error);
      toast.error("Không thể kết nối máy chủ gửi thông báo");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side: Form */}
        <form onSubmit={handleSend} className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-foreground text-base">Gửi Push Riêng</h3>
              <p className="text-xs text-muted-foreground">Tới thiết bị của học viên</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm border border-accent/20 shrink-0">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                user.fullName?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground text-sm truncate">{user.fullName || "Học viên"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" /> {user.deviceType || "WEB"}
            </span>
          </div>

          {/* Quick Presets Section */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent dark:text-accent-on-dark">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chọn kịch bản mẫu điền nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DIRECT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent/10 hover:border-accent hover:text-accent text-xs font-medium transition-all cursor-pointer shadow-sm text-foreground"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Tiêu Đề Thông Báo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
          </div>

          {/* Body Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Nội Dung Thông Báo</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Nhập nội dung thông báo đẩy..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              required
            />
          </div>

          {/* Action Link Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Đường Dẫn Liên Kết (Click URL)</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ví dụ: /interview-topics"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
              className="text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={isSending}
              className="text-xs gap-1.5"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Gửi Push Riêng
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Right Side: Interactive iOS Preview */}
        <div className="hidden md:flex w-72 bg-muted/30 border-l border-border p-6 flex-col justify-center items-center gap-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Xem trước thiết bị</p>
          
          {/* iOS Notification Chassis */}
          <div className="w-full max-w-[240px] bg-black/5 dark:bg-white/5 border border-border/50 rounded-[30px] p-2 aspect-[9/16] flex flex-col justify-start relative shadow-inner">
            {/* Dynamic Island */}
            <div className="w-16 h-4 bg-black rounded-full mx-auto mb-4" />

            {/* iOS Notification Banner */}
            <div className="w-full bg-background/70 dark:bg-black/40 backdrop-blur-md border border-border/80 rounded-2xl p-3 shadow-lg flex flex-col gap-1 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/logos/java-logo.png"
                    alt="JavaBuilder Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                  <span className="text-[10px] font-bold text-foreground/90">JavaBuilder</span>
                </div>
                <span className="text-[9px] text-muted-foreground font-medium">vừa xong</span>
              </div>
              <p className="text-[11px] font-bold text-foreground leading-tight line-clamp-1 mt-0.5">
                {title || "Tiêu đề thông báo..."}
              </p>
              <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                {body || "Nội dung chi tiết của thông báo đẩy..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
