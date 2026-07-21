"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, Check, Globe, Flame, BookOpen, Gem, User, X, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscribedUser } from "./SubscribedUsersTable";

export interface PushPreset {
  name: string;
  title: string;
  body: string;
  url: string;
  audience: string;
}

const PRESETS: PushPreset[] = [
  {
    name: "💡 Mẹo Java Backend",
    title: "💡 Mẹo tối ưu HashMap & ConcurrentHashMap trong Java!",
    body: "Xem ngay cách sử dụng ConcurrentHashMap chuẩn chuyên nghiệp tránh Race Condition.",
    url: "/interview-topics",
    audience: "Tất cả học viên",
  },
  {
    name: "🎯 Bộ câu hỏi phỏng vấn",
    title: "🎯 10 Câu hỏi phỏng vấn Spring Boot Senior hay gặp nhất",
    body: "Tổng hợp các câu hỏi phỏng vấn thực chiến và câu trả lời ấn tượng cho ứng viên Java.",
    url: "/interview-topics",
    audience: "Tất cả học viên",
  },
  {
    name: "📖 Tiếp tục bài học",
    title: "📖 Tiếp tục học nốt bài giảng dở dang trên JavaBuilder!",
    body: "Bạn đã đi được 70% chặng đường bài học này. Bấm để xem tiếp ngay!",
    url: "/my-courses",
    audience: "Học viên học dở bài",
  },
  {
    name: "🔥 Giữ chuỗi Streak",
    title: "🔥 Đừng quên rèn luyện 10 phút lập trình hôm nay!",
    body: "Bảo vệ chuỗi chăm chỉ của bạn bằng cách thử sức với 1 bài tập ngắn.",
    url: "/study-progress",
    audience: "Học viên chưa vào học hôm nay",
  },
];

const AUDIENCE_OPTIONS = [
  {
    value: "Tất cả học viên",
    label: "Tất cả học viên (Broadcast All)",
    description: "Gửi tới toàn bộ trình duyệt học viên đã đăng ký Push",
    icon: Globe,
  },
  {
    value: "Cá nhân cụ thể",
    label: "Gửi tới 1 học viên cụ thể (Direct Target Push)",
    description: "Chọn đích danh 1 học viên đã bật Push trong hệ thống",
    icon: User,
  },
  {
    value: "Học viên chưa vào học hôm nay",
    label: "Học viên chưa vào học trong ngày",
    description: "Gửi thông báo cập nhật kiến thức cho nhóm học viên chưa mở web",
    icon: Flame,
  },
  {
    value: "Học viên học dở bài",
    label: "Học viên dừng bài học dở dang",
    description: "Gửi tới học viên đang xem dở bài giảng",
    icon: BookOpen,
  },
  {
    value: "Thành viên Premium",
    label: "Học viên gói Premium",
    description: "Gửi tài liệu & đặc quyền cho tài khoản Premium",
    icon: Gem,
  },
];

interface CreatePushFormProps {
  title: string;
  setTitle: (val: string) => void;
  body: string;
  setBody: (val: string) => void;
  url: string;
  setUrl: (val: string) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  selectedUser: SubscribedUser | null;
  setSelectedUser: (user: SubscribedUser | null) => void;
  subscribedUsersList: SubscribedUser[];
  onSubmit: (e: React.FormEvent) => void;
  onApplyPreset: (preset: PushPreset) => void;
}

export default function CreatePushForm({
  title,
  setTitle,
  body,
  setBody,
  url,
  setUrl,
  targetAudience,
  setTargetAudience,
  selectedUser,
  setSelectedUser,
  subscribedUsersList,
  onSubmit,
  onApplyPreset,
}: CreatePushFormProps) {
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAudienceDropdownOpen(false);
      }
      if (userSearchRef.current && !userSearchRef.current.contains(event.target as Node)) {
        setIsUserSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = AUDIENCE_OPTIONS.find((opt) => opt.value === targetAudience) || AUDIENCE_OPTIONS[0];
  const SelectedIcon = selectedOption.icon;

  const filteredSubscribedUsers = subscribedUsersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">Soạn Push Notification (Tips & Kiến Thức Java)</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gửi thông báo đẩy tới toàn bộ học viên hoặc đích danh cá nhân cụ thể.
          </p>
        </div>

        {/* Presets Bar */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">
            Chọn kịch bản mẫu điền nhanh:
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:border-accent hover:bg-accent/10 hover:text-accent dark:hover:text-accent-on-dark text-foreground transition-all cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Custom Styled Audience Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Đối tượng nhận thông báo:
            </label>
            <button
              type="button"
              onClick={() => setIsAudienceDropdownOpen(!isAudienceDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <SelectedIcon className="w-4 h-4 shrink-0 text-accent" />
                <span className="truncate font-medium">{selectedOption.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isAudienceDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Custom Dropdown Menu Panel */}
            {isAudienceDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-card border border-border rounded-xl shadow-xl z-30 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                {AUDIENCE_OPTIONS.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = targetAudience === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setTargetAudience(opt.value);
                        if (opt.value !== "Cá nhân cụ thể") {
                          setSelectedUser(null);
                        }
                        setIsAudienceDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent/10 text-accent dark:text-accent-on-dark font-semibold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-xs leading-snug">{opt.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-normal">{opt.description}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-accent dark:text-accent-on-dark shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Specific User Search Selector (when "Cá nhân cụ thể" is selected or selectedUser exists) */}
          {(targetAudience === "Cá nhân cụ thể" || selectedUser) && (
            <div className="relative space-y-2 p-3 bg-muted/40 border border-border rounded-xl" ref={userSearchRef}>
              <label className="block text-xs font-semibold text-foreground">
                Chọn người dùng nhận Push trực tiếp:
              </label>

              {selectedUser ? (
                <div className="flex items-center justify-between p-2.5 bg-card border border-accent/30 rounded-lg text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs shrink-0">
                      {selectedUser.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{selectedUser.fullName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc email học viên đã bật Push..."
                    value={userSearchQuery}
                    onFocus={() => setIsUserSearchOpen(true)}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setIsUserSearchOpen(true);
                    }}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  {isUserSearchOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto p-1 space-y-1">
                      {filteredSubscribedUsers.length === 0 ? (
                        <p className="p-3 text-xs text-muted-foreground text-center">Không tìm thấy học viên nào</p>
                      ) : (
                        filteredSubscribedUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setTargetAudience("Cá nhân cụ thể");
                              setIsUserSearchOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs hover:bg-muted transition-colors cursor-pointer"
                          >
                            <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-[10px] shrink-0">
                              {user.fullName.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-foreground truncate">{user.fullName}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-foreground">
                Tiêu đề Push Notification *
              </label>
              <span className="text-xs text-muted-foreground">{title.length}/65</span>
            </div>
            <input
              type="text"
              maxLength={65}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: 💡 Mẹo tối ưu HashMap trong Java Backend"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-foreground">
                Nội dung ngắn *
              </label>
              <span className="text-xs text-muted-foreground">{body.length}/150</span>
            </div>
            <textarea
              rows={3}
              maxLength={150}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Xem ngay hướng dẫn sử dụng ConcurrentHashMap chuẩn chuyên nghiệp tránh Race Condition..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Đường dẫn khi học viên bấm vào (Click URL):
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/interview-topics hoặc /my-courses"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="accent" className="gap-2">
              <Send className="w-4 h-4" /> Bắn Push Notification Ngay
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
