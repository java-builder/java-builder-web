"use client";

import {
  AlertTriangle,
  BookOpen,
  Cloud,
  FileText,
  Gift,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { TEMPLATE_LIST, type TemplateId } from "@/components/admin/notifications/emailTemplates";
import StepCard from "./StepCard";
import StepFooter from "./StepFooter";
import { ICON_TONE, type IconTone } from "./helpers";

interface ContentStepProps {
  selectedTemplate: TemplateId;
  content: string;
  onTemplateChange: (id: TemplateId) => void;
  onContentChange: (value: string) => void;
  onInsertTag: (tag: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const TEMPLATE_ICON: Record<TemplateId, LucideIcon> = {
  empty: FileText,
  "thank-you": Heart,
  promotion: Gift,
  "system-alert": AlertTriangle,
  "re-engage": BookOpen,
  "new-course": Sparkles,
};

const TEMPLATE_TONE: Record<TemplateId, IconTone> = {
  empty: "gray",
  "thank-you": "rose",
  promotion: "amber",
  "system-alert": "orange",
  "re-engage": "blue",
  "new-course": "violet",
};

export default function ContentStep({
  selectedTemplate,
  content,
  onTemplateChange,
  onContentChange,
  onInsertTag,
  onBack,
  onNext,
}: ContentStepProps) {
  return (
    <div className="space-y-5">
      <StepCard
        title="Mẫu email"
        description="Chọn template để tự động điền nội dung HTML"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {TEMPLATE_LIST.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            const Icon = TEMPLATE_ICON[tpl.id] ?? FileText;
            const toneClass = TEMPLATE_TONE[tpl.id] ?? "gray";
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onTemplateChange(tpl.id)}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                  isSelected
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                    : "border-border bg-card hover:border-accent/50 hover:bg-muted"
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
                    isSelected ? "bg-accent/10 text-accent" : ICON_TONE[toneClass]
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-xs font-semibold ${
                      isSelected ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {tpl.name}
                  </div>
                  {tpl.customVars.length > 0 && (
                    <div className="truncate text-[10px] text-muted-foreground">
                      {tpl.customVars.length} biến tuỳ chỉnh
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </StepCard>

      {selectedTemplate === "empty" ? (
        <StepCard
          title="Soạn nội dung"
          description="HTML hỗ trợ inline styles. Dùng tag để cá nhân hoá email."
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Chèn nhanh
            </span>
            <button
              type="button"
              onClick={() => onInsertTag("{username}")}
              className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              {"{username}"}
            </button>
            <button
              type="button"
              onClick={() => onInsertTag("{email}")}
              className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              {"{email}"}
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Viết mã HTML hoặc văn bản của email tại đây..."
            rows={14}
            className="block w-full resize-y rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        </StepCard>
      ) : (
        <StepCard
          title="Mẫu được quản lý trên AWS"
          description="Template này được host và rendering bởi AWS, bạn không cần soạn nội dung HTML"
        >
          <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 p-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Cloud className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold text-foreground">
                Nội dung email lấy trực tiếp từ AWS
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Hệ thống sẽ tự động dùng template AWS tương ứng khi gửi. Bạn chỉ cần điền các biến tuỳ chỉnh ở khung Preview bên phải (nếu có) rồi tiếp tục.
              </p>
            </div>
          </div>
        </StepCard>
      )}

      <StepFooter onBack={onBack} onNext={onNext} nextLabel="Chọn người nhận" />
    </div>
  );
}
