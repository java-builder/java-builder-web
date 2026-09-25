"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Loader2, Search } from "lucide-react";
import type { CampaignMode, CampaignTemplateConfig } from "../useEmailCampaign";
import StepCard from "./StepCard";

interface ModeStepProps {
  campaignMode: CampaignMode | null;
  onSelectMode: (mode: CampaignMode) => void;
  selectedTemplate: string;
  templates: CampaignTemplateConfig[];
  isLoadingTemplates: boolean;
  onSelectCustom: () => void;
  onSelectTemplate: (templateId: string) => void;
}

interface TemplateDisplayInfo {
  title: string;
  category: string;
}

const TEMPLATE_DISPLAY_MAP: Record<string, TemplateDisplayInfo> = {
  PROMOTION: { title: "Khuyến mãi & Ưu đãi học phí", category: "Marketing" },
  MAINTENANCE_ALERT: { title: "Thông báo bảo trì hệ thống", category: "Hệ thống" },
  NEW_COURSE_ANNOUNCEMENT: { title: "Giới thiệu khóa học mới", category: "Khóa học" },
  NEW_LESSON: { title: "Bài học mới phát hành", category: "Khóa học" },
  NEW_BLOG: { title: "Bài viết Blog kỹ thuật mới", category: "Cộng đồng" },
  NEW_COMMENT: { title: "Thông báo bình luận / phản hồi mới", category: "Tương tác" },
  RE_ENGAGEMENT: { title: "Nhắc nhở tiếp tục lộ trình học", category: "Chăm sóc" },
  APPRECIATION: { title: "Tri ân & Cảm ơn học viên", category: "Chăm sóc" },
  WELCOME: { title: "Chào mừng thành viên gia nhập", category: "Hệ thống" },
  RESET_PASSWORD: { title: "Yêu cầu đặt lại mật khẩu", category: "Bảo mật" },
  SUBSCRIPTION_CONFIRMATION: { title: "Xác nhận đăng ký hội viên", category: "Tài khoản" },
  SUBSCRIPTION: { title: "Thông tin gói học Premium", category: "Tài khoản" },
  CONTRIBUTOR: { title: "Ghi nhận đóng góp cộng đồng", category: "Cộng đồng" },
  QNA_COMMUNITY: { title: "Hỏi đáp & Thảo luận bài học", category: "Cộng đồng" },
  GIVEAWAY_SPECIAL: { title: "Chương trình quà tặng đặc biệt", category: "Marketing" },
  GIVEAWAY: { title: "Sự kiện Giveaway quà tặng", category: "Marketing" },
  PREMIUM_ALERT: { title: "Thông báo đặc quyền Premium", category: "Tài khoản" },
  NGINX_SERIES: { title: "Chuỗi bài giảng Nginx Server", category: "Khóa học" },
  GIT_COURSE: { title: "Khóa học Git & GitHub chuyên sâu", category: "Khóa học" },
  "GIT-COURSE-MASTER": { title: "Khóa học Git & GitHub chuyên sâu", category: "Khóa học" },
  SPRING_AI: { title: "Khóa học Spring AI & Thực chiến", category: "Khóa học" },
  "SPRING-AI-INTRO": { title: "Khóa học Spring AI & Thực chiến", category: "Khóa học" },
};

function getTemplateDisplayInfo(id: string): TemplateDisplayInfo {
  const upper = id.toUpperCase().trim();
  if (TEMPLATE_DISPLAY_MAP[upper]) return TEMPLATE_DISPLAY_MAP[upper];

  for (const [key, val] of Object.entries(TEMPLATE_DISPLAY_MAP)) {
    if (upper.includes(key) || key.includes(upper)) {
      return val;
    }
  }

  const formatted = id
    .replace(/[-_]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: formatted, category: "Khác" };
}

export default function ModeStep({
  campaignMode,
  onSelectMode,
  selectedTemplate,
  templates,
  isLoadingTemplates,
  onSelectCustom,
  onSelectTemplate,
}: ModeStepProps) {
  const isTemplateMode = campaignMode === "template";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const validTemplates = useMemo(
    () => templates.filter((tpl) => tpl.id !== "empty"),
    [templates]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    validTemplates.forEach((t) => {
      set.add(getTemplateDisplayInfo(t.id).category);
    });
    return ["all", ...Array.from(set)];
  }, [validTemplates]);

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return validTemplates.filter((tpl) => {
      const info = getTemplateDisplayInfo(tpl.id);
      const matchesCategory =
        selectedCategory === "all" || info.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;
      return (
        info.title.toLowerCase().includes(query) ||
        tpl.id.toLowerCase().includes(query) ||
        (tpl.subject && tpl.subject.toLowerCase().includes(query))
      );
    });
  }, [validTemplates, searchQuery, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* 2 Primary Mode Choice Cards - Clean, professional, no childish icons */}
      <StepCard
        title="Bước 1: Chọn hình thức gửi chiến dịch"
        description="Lựa chọn một trong hai phương thức bên dưới để bắt đầu ngay"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* OPTION 1: Template có sẵn */}
          <div
            onClick={() => onSelectMode("template")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelectMode("template")}
            className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 ${
              isTemplateMode
                ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-xs"
                : "border-border bg-card hover:border-accent/40 hover:bg-muted/30"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Mẫu hệ thống
                </span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                  {validTemplates.length} mẫu có sẵn
                </span>
              </div>
              <h4 className="mt-2 text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors">
                Gửi theo template có sẵn
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Sử dụng các mẫu email chuẩn hóa từ AWS SES (Khuyến mãi, Bảo trì, Khóa học mới...). Bố cục HTML đã được định dạng sẵn.
              </p>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>{isTemplateMode ? "Đang mở danh sách mẫu bên dưới" : "Click chọn mẫu trong danh sách"}</span>
              <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isTemplateMode ? "rotate-90 text-accent" : "group-hover:translate-x-1"}`} />
            </div>
          </div>

          {/* OPTION 2: Email mới chưa có -> Bấm là qua ngay! */}
          <div
            onClick={onSelectCustom}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelectCustom()}
            className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-border bg-card p-4 text-left transition-all duration-150 hover:border-accent/50 hover:bg-muted/30 hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Email độc lập
                </span>
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                  Tự do sáng tạo
                </span>
              </div>
              <h4 className="mt-2 text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors">
                Gửi 1 email mới chưa có
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Tạo một chiến dịch email hoàn toàn mới từ trang trắng. Bạn tự do soạn tiêu đề và thiết kế nội dung mã HTML.
              </p>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <span>Click để vào soạn thư ngay</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </StepCard>

      {/* DYNAMIC TEMPLATE SELECTION: Clean enterprise list, no emojis, instant advance */}
      {isTemplateMode && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3.5 animate-in fade-in duration-150">
          {/* Header row with search and title */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Chọn mẫu email
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Hiển thị {filteredTemplates.length} / {validTemplates.length} mẫu email khả dụng
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên hoặc mã mẫu..."
                className="w-full rounded-lg border border-input bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Category filter tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-accent text-white"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </button>
              ))}
            </div>
          )}

          {isLoadingTemplates ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
              <span className="text-xs font-medium">Đang tải danh sách mẫu email từ AWS SES...</span>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              Không tìm thấy mẫu email nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {filteredTemplates.map((tpl) => {
                const info = getTemplateDisplayInfo(tpl.id);
                const isSelected = selectedTemplate === tpl.id;

                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onSelectTemplate(tpl.id)}
                    className={`group flex flex-col justify-between rounded-xl border p-3 text-left transition-all overflow-hidden cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-xs"
                        : "border-border bg-background hover:border-accent/40 hover:bg-muted/30 hover:shadow-xs"
                    }`}
                  >
                    <div className="min-w-0 w-full">
                      {/* Line 1: Title (Full width, never wraps awkwardly) */}
                      <div className="text-xs sm:text-sm font-bold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-1">
                        {info.title}
                      </div>

                      {/* Line 2: Code badge + variable count */}
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground min-w-0">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground truncate max-w-[180px]">
                          {tpl.id}
                        </code>
                        <span>•</span>
                        <span className="truncate">
                          {tpl.customVars.length > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              {tpl.customVars.length} biến tuỳ chỉnh
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Mẫu chuẩn hoá
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Line 3: Subject Preview */}
                      <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-1">
                        {tpl.subject || "Chưa thiết lập tiêu đề mặc định"}
                      </p>
                    </div>

                    {/* Bottom row: Direct action */}
                    <div className="mt-2.5 flex items-center justify-end border-t border-border/40 pt-1.5 text-[11px]">
                      <div className="flex items-center gap-1 font-semibold text-accent transition-transform group-hover:translate-x-0.5">
                        <span>Chọn mẫu</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
