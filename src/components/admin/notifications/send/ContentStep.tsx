"use client";

import {
  FileText,
  Mail,
  Loader2,
} from "lucide-react";
import { CampaignTemplateConfig } from "../useEmailCampaign";
import StepCard from "./StepCard";
import StepFooter from "./StepFooter";

interface ContentStepProps {
  selectedTemplate: string;
  content: string;
  templates: CampaignTemplateConfig[];
  isLoadingTemplates: boolean;
  onTemplateChange: (id: string) => void;
  onContentChange: (value: string) => void;
  onInsertTag: (tag: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ContentStep({
  selectedTemplate,
  content,
  templates,
  isLoadingTemplates,
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
        {isLoadingTemplates ? (
          <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <span className="text-xs">Đang tải danh sách mẫu email từ AWS SES...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              const isBlank = tpl.id === "empty";
              const Icon = isBlank ? FileText : Mail;
              
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
                      isSelected 
                        ? "bg-accent/10 text-accent" 
                        : isBlank 
                          ? "bg-muted text-muted-foreground" 
                          : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
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
                    {tpl.customVars.length > 0 ? (
                      <div className="truncate text-[10px] text-muted-foreground">
                        {tpl.customVars.length} biến tuỳ chỉnh
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">SES Template</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </StepCard>

      {/* Editor card */}
      <StepCard
        title="Soạn nội dung"
        description="Soạn mã HTML hoặc chỉnh sửa trực tiếp nội dung mẫu thư đã chọn."
      >
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          {/* Editor Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/20 px-4 py-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-400/80 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-yellow-400/80 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-green-400/80 rounded-full"></span>
              <span className="text-[10px] text-muted-foreground font-mono ml-1.5 uppercase tracking-wider font-semibold">
                email-editor.html
              </span>
            </div>

            {/* Quick variables list */}
            <div className="flex gap-1.5 items-center">
              <span className="text-[10px] text-muted-foreground font-bold uppercase hidden sm:inline">Chèn nhanh:</span>
              <button
                type="button"
                onClick={() => onInsertTag("{{username}}")}
                className="px-2.5 py-1 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-md text-[10px] font-mono text-accent transition flex items-center gap-1 active:scale-95"
              >
                username
              </button>
              <button
                type="button"
                onClick={() => onInsertTag("{{email}}")}
                className="px-2.5 py-1 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-md text-[10px] font-mono text-accent transition flex items-center gap-1 active:scale-95"
              >
                email
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
              <span>HTML EDITOR MODE</span>
              <span>{content.length} ký tự</span>
            </div>
          </div>
        </div>
      </StepCard>

      <StepFooter onBack={onBack} onNext={onNext} nextLabel="Chọn người nhận" />
    </div>
  );
}
