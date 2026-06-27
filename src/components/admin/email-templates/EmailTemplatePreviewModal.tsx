"use client";

import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import { EmailTemplateResponse } from "@/types/email-template";
import { Button } from "@/components/ui/button";

interface EmailTemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplateResponse | null;
  onEdit: (tpl: EmailTemplateResponse) => void;
}

export default function EmailTemplatePreviewModal({
  isOpen,
  onClose,
  template,
  onEdit,
}: EmailTemplatePreviewModalProps) {
  const [tab, setTab] = useState<"html" | "text">("html");

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">{template.templateName}</h3>
              <p className="text-xs text-muted-foreground">Xem giao diện gửi thư trên AWS SES</p>
            </div>
          </div>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={onClose}
            aria-label="Đóng"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Email Header Info */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border text-sm space-y-2">
          <div className="flex gap-2">
            <span className="font-medium text-muted-foreground w-16">Tiêu đề:</span>
            <span className="font-bold text-foreground">{template.subject}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-muted-foreground w-16">Kênh gửi:</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              Amazon SES
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-6 border-b border-border flex gap-4 bg-card">
          <button
            onClick={() => setTab("html")}
            className={`py-3 text-sm font-semibold border-b-2 transition ${
              tab === "html"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Giao diện (HTML)
          </button>
          <button
            onClick={() => setTab("text")}
            className={`py-3 text-sm font-semibold border-b-2 transition ${
              tab === "text"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Văn bản thuần (Text Fallback)
          </button>
        </div>

        {/* Preview content area inside Mac-like Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/20 flex flex-col justify-center min-h-[300px]">
          {tab === "html" ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col max-w-[620px] mx-auto w-full">
              {/* MacOS style window controls */}
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-150 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
                <span className="text-[10px] text-gray-400 font-mono ml-4 truncate">Email Preview Renderer</span>
              </div>
              <iframe
                srcDoc={template.htmlContent}
                className="w-full h-[520px] border-0 bg-white"
                title="Email Template Render"
              />
            </div>
          ) : (
            <div className="bg-card p-6 rounded-xl border border-border max-w-[620px] mx-auto w-full shadow-md font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed h-[520px] overflow-y-auto">
              {template.textContent}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            Đóng
          </Button>
          <Button
            onClick={() => {
              onClose();
              onEdit(template);
            }}
            variant="accent"
            size="sm"
          >
            Chỉnh sửa mẫu này
          </Button>
        </div>
      </div>
    </div>
  );
}
