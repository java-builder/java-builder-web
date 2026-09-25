"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Code,
} from "lucide-react";
import type { CampaignMode, CampaignTemplateConfig } from "../useEmailCampaign";
import StepCard from "./StepCard";
import StepFooter from "./StepFooter";
import { ICON_TONE, SUBJECT_PRESETS } from "./helpers";

interface ContentStepProps {
  campaignMode: CampaignMode | null;
  currentTemplateCfg: CampaignTemplateConfig;
  subject: string;
  preheader: string;
  senderName: string;
  senderEmail: string;
  replyTo: string;
  content: string;
  customVarValues: Record<string, string>;
  onSubjectChange: (value: string) => void;
  onPreheaderChange: (value: string) => void;
  onSenderNameChange: (value: string) => void;
  onSenderEmailChange: (value: string) => void;
  onReplyToChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCustomVarChange: (varName: string, value: string) => void;
  onInsertTag: (tag: string) => void;
  onChangeModeClick: () => void;
  onBack: () => void;
  onNext: () => void;
}

const fmt = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const now = () => new Date();
const plus = (h: number) => new Date(Date.now() + h * 3600_000);
const tomorrowAt = (hh: number) => {
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(hh, 0, 0, 0); return d;
};

const CUSTOM_VAR_META: Record<string, { label: string; placeholder: string; suggestions?: (() => string)[] }> = {
  discountPercent: {
    label: "Phần trăm giảm giá (%)",
    placeholder: "VD: 40",
    suggestions: [() => "20", () => "30", () => "40", () => "50", () => "70"],
  },
  startTime: {
    label: "Thời gian bắt đầu bảo trì",
    placeholder: "HH:mm, DD/MM/YYYY",
    suggestions: [
      () => fmt(now()),
      () => fmt(plus(1)),
      () => fmt(tomorrowAt(1)),
      () => fmt(tomorrowAt(2)),
    ],
  },
  endTime: {
    label: "Thời gian kết thúc bảo trì",
    placeholder: "HH:mm, DD/MM/YYYY",
    suggestions: [
      () => fmt(plus(1)),
      () => fmt(plus(2)),
      () => fmt(plus(3)),
      () => fmt(tomorrowAt(3)),
      () => fmt(tomorrowAt(5)),
    ],
  },
  courseName: {
    label: "Tên khóa học",
    placeholder: "VD: Spring Boot Microservices",
    suggestions: [
      () => "Spring Boot Microservices từ Zero đến Production",
      () => "Java Core & Cấu trúc Dữ liệu Chuyên sâu",
      () => "DevOps & Docker cho Java Developer",
    ],
  },
  courseSlug: {
    label: "Đường dẫn (Slug) khóa học",
    placeholder: "VD: spring-boot-microservices",
    suggestions: [
      () => "spring-boot-microservices",
      () => "java-core-fundamentals",
      () => "devops-for-java",
    ],
  },
};

export default function ContentStep({
  campaignMode,
  currentTemplateCfg,
  subject,
  preheader,
  senderName,
  senderEmail,
  replyTo,
  content,
  customVarValues,
  onSubjectChange,
  onPreheaderChange,
  onSenderNameChange,
  onSenderEmailChange,
  onReplyToChange,
  onContentChange,
  onCustomVarChange,
  onInsertTag,
  onChangeModeClick,
  onBack,
  onNext,
}: ContentStepProps) {
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  const isTemplateMode = campaignMode === "template";

  const handleApplyPreset = (presetSubject: string, presetSummary: string) => {
    onSubjectChange(presetSubject);
    onPreheaderChange(presetSummary);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner showing active mode + Quick switcher */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-foreground truncate">
              {isTemplateMode
                ? `Mẫu template: ${currentTemplateCfg.name}`
                : "Email mới (Broadcast)"}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold flex-shrink-0 ${
                isTemplateMode
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
              }`}
            >
              {isTemplateMode ? "SES Template" : "Custom HTML"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
            {isTemplateMode
              ? "Điền tham số bên dưới, xem trước ở khung bên phải"
              : "Soạn tiêu đề và mã HTML theo ý muốn"}
          </p>
        </div>

        <button
          type="button"
          onClick={onChangeModeClick}
          className="inline-flex items-center gap-1.5 flex-shrink-0 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:border-accent/40 hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isTemplateMode ? "Đổi mẫu khác" : "Chọn mẫu có sẵn"}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: TEMPLATE MODE                                          */}
      {/* ============================================================== */}
      {isTemplateMode && (
        <>
          {/* Card 1: Sender info & Subject */}
          <StepCard
            title="Cấu hình thông tin gửi"
            description="Tiêu đề thư, tóm tắt preheader và thông tin người gửi"
          >
            <div className="space-y-4">
              <Field
                label="Tiêu đề thư (Subject)"
                required
                hint="Đã tự động lấy theo mẫu template, bạn có thể tinh chỉnh nếu muốn"
              >
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  placeholder="Nhập tiêu đề thư gửi tới học viên..."
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
              </Field>

              <Field
                label="Preheader (nội dung tóm tắt inbox)"
                hint="Xuất hiện cạnh dòng tiêu đề trên ứng dụng thư của người nhận"
              >
                <input
                  type="text"
                  value={preheader}
                  onChange={(e) => onPreheaderChange(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn nội dung thư..."
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Tên người gửi">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => onSenderNameChange(e.target.value)}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  />
                </Field>
                <Field label="Email người gửi">
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => onSenderEmailChange(e.target.value)}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  />
                </Field>
              </div>

              <Field
                label="Email phản hồi (Reply-To)"
                hint="Khi người nhận nhấn Trả lời, thư sẽ được gửi tới địa chỉ này"
              >
                <input
                  type="email"
                  value={replyTo}
                  onChange={(e) => onReplyToChange(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
              </Field>
            </div>
          </StepCard>

          {/* Card 2: Custom Variables of the Template - Only show if template actually has custom variables */}
          {currentTemplateCfg.customVars.length > 0 && (
            <StepCard
              title="Điền biến nội dung mẫu"
              description="Các giá trị này sẽ được truyền vào template và cập nhật trực tiếp trên khung xem trước"
            >
              <div className="space-y-3">
                {currentTemplateCfg.customVars.map((varName) => {
                  const meta = CUSTOM_VAR_META[varName] ?? {
                    label: `Biến ${varName}`,
                    placeholder: `Nhập giá trị cho ${varName}`,
                  };
                  const isEmpty = !customVarValues[varName]?.trim();
                  const sugs = meta.suggestions?.map((fn) => fn()) ?? [];

                  return (
                    <div
                      key={varName}
                      className="rounded-xl border border-border bg-card p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <span>{meta.label}</span>
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                            &#123;{varName}&#125;
                          </code>
                          <span className="text-rose-500">*</span>
                        </label>
                        {isEmpty ? (
                          <span className="text-[10px] text-muted-foreground">
                            Chưa điền
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Đã điền
                          </span>
                        )}
                      </div>

                      <input
                        type="text"
                        value={customVarValues[varName] ?? ""}
                        onChange={(e) => onCustomVarChange(varName, e.target.value)}
                        placeholder={meta.placeholder}
                        className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      />

                      {sugs.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-muted-foreground">
                            Gợi ý:
                          </span>
                          {sugs.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => onCustomVarChange(varName, s)}
                              className="rounded border border-border bg-muted/40 hover:bg-muted text-[11px] px-2 py-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition"
                            >
                              {s.length > 25 ? s.slice(0, 23) + "…" : s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </StepCard>
          )}

          {/* Card 3: Optional Collapsible HTML Code Viewer */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHtmlCode(!showHtmlCode)}
              className="flex w-full items-center justify-between p-4 text-left font-semibold text-xs text-muted-foreground hover:bg-muted/40 cursor-pointer transition"
            >
              <span className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Xem mã nguồn HTML của Template (Tùy chọn)</span>
              </span>
              {showHtmlCode ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showHtmlCode && (
              <div className="border-t border-border p-4 bg-muted/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Mã nguồn HTML mẫu:</span>
                  <span>{content.length} ký tự</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* MODE 2: CUSTOM / NEW EMAIL MODE                                */}
      {/* ============================================================== */}
      {!isTemplateMode && (
        <>
          {/* Card 1: Subject Presets */}
          <StepCard
            title="Mẫu tiêu đề nhanh (Gợi ý)"
            description="Bấm để áp dụng nhanh tiêu đề và tóm tắt preheader gợi ý"
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {SUBJECT_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isActive = subject === preset.subject;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.subject, preset.summary)}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                      isActive
                        ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                        : "border-border bg-card hover:border-accent/50 hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                        isActive ? "bg-accent/10 text-accent" : ICON_TONE[preset.tone]
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-xs font-semibold ${
                        isActive ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </StepCard>

          {/* Card 2: Configuration */}
          <StepCard
            title="Cấu hình chiến dịch"
            description="Tiêu đề thư, preheader và thông tin người gửi"
          >
            <div className="space-y-4">
              <Field
                label="Tiêu đề thư (Subject)"
                required
                hint="Hiển thị ở dòng tiêu đề trong hộp thư của người nhận"
              >
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  placeholder="VD: Cập nhật tài khoản Premium của bạn ngay hôm nay..."
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
              </Field>

              <Field
                label="Preheader (nội dung tóm tắt)"
                hint="Xuất hiện cạnh tiêu đề trong inbox preview"
              >
                <input
                  type="text"
                  value={preheader}
                  onChange={(e) => onPreheaderChange(e.target.value)}
                  placeholder="VD: Nhận ưu đãi lớn nhất trong năm từ cộng đồng JavaBuilder"
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Tên người gửi">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => onSenderNameChange(e.target.value)}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  />
                </Field>
                <Field label="Email người gửi">
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => onSenderEmailChange(e.target.value)}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  />
                </Field>
              </div>

              <Field
                label="Email phản hồi (Reply-To)"
                hint="Khi người nhận bấm Trả lời, email sẽ gửi tới địa chỉ này"
              >
                <input
                  type="email"
                  value={replyTo}
                  onChange={(e) => onReplyToChange(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
              </Field>
            </div>
          </StepCard>

          {/* Card 3: HTML Editor */}
          <StepCard
            title="Trình soạn thảo nội dung HTML"
            description="Soạn mã HTML hoặc văn bản cho email của bạn. Xem trước thời gian thực ở khung bên phải."
          >
            <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
              {/* Editor Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/30 px-4 py-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                  <span className="text-[11px] text-muted-foreground font-mono ml-1.5 uppercase tracking-wider font-semibold">
                    email-editor.html
                  </span>
                </div>

                {/* Quick variables list */}
                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase hidden sm:inline">
                    Chèn nhanh:
                  </span>
                  <button
                    type="button"
                    onClick={() => onInsertTag("{{username}}")}
                    className="px-2.5 py-1 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-md text-[10px] font-mono text-accent transition flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    &#123;&#123;username&#125;&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => onInsertTag("{{email}}")}
                    className="px-2.5 py-1 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-md text-[10px] font-mono text-accent transition flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    &#123;&#123;email&#125;&#125;
                  </button>
                </div>
              </div>

              {/* Editor Textarea */}
              <div className="flex flex-col bg-background">
                <textarea
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  placeholder="Viết mã HTML hoặc văn bản của email tại đây... Bạn có thể dùng các thẻ <div>, <span>, <strong>..."
                  className="w-full px-4 py-3 bg-transparent border-0 focus:ring-0 rounded-b-xl text-xs font-mono h-[380px] resize-y overflow-y-auto leading-relaxed text-foreground placeholder:text-muted-foreground outline-none"
                />
                {/* Status Bar */}
                <div className="px-4 py-2 bg-muted/20 border-t border-border text-[10px] text-muted-foreground font-mono flex justify-between items-center rounded-b-xl">
                  <span>HTML BROADCAST MODE</span>
                  <span>{content.length} ký tự</span>
                </div>
              </div>
            </div>
          </StepCard>
        </>
      )}

      {/* Footer Navigation */}
      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextLabel="Tiếp tục: Chọn người nhận"
      />
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        {hint && (
          <span className="text-[11px] text-muted-foreground/60">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}
