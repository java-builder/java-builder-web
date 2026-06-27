"use client";

import { useEffect, useState, useRef } from "react";
import { Edit3, X, Mail, Code, Loader2 } from "lucide-react";
import { EmailTemplateResponse } from "@/types/email-template";
import { Button } from "@/components/ui/button";
import { emailTemplateService } from "@/services/email-template.service";
import toast from "react-hot-toast";

interface EmailTemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplateResponse | null;
  isEditMode: boolean;
  onSuccess: () => void;
}

export default function EmailTemplateEditorModal({
  isOpen,
  onClose,
  template,
  isEditMode,
  onSuccess,
}: EmailTemplateEditorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [textContent, setTextContent] = useState("");
  
  const [editorTab, setEditorTab] = useState<"edit" | "preview">("edit");
  const [activeEditorTab, setActiveEditorTab] = useState<"html" | "text">("html");
  const htmlInputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize values
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && template) {
        setTemplateName(template.templateName);
        setSubject(template.subject);
        setHtmlContent(template.htmlContent);
        setTextContent(template.textContent);
      } else {
        setTemplateName("");
        setSubject("");
        setHtmlContent("");
        setTextContent("");
      }
      setEditorTab("edit");
      setActiveEditorTab("html");
    }
  }, [isOpen, isEditMode, template]);

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
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  const insertVariable = (variable: string) => {
    if (!htmlInputRef.current) return;
    const start = htmlInputRef.current.selectionStart;
    const end = htmlInputRef.current.selectionEnd;
    const text = htmlInputRef.current.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const val = before + variable + after;
    setHtmlContent(val);
    
    // Reset cursor position after React update
    setTimeout(() => {
      if (htmlInputRef.current) {
        htmlInputRef.current.focus();
        htmlInputRef.current.selectionStart = start + variable.length;
        htmlInputRef.current.selectionEnd = start + variable.length;
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !subject.trim() || !htmlContent.trim()) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        templateName: templateName.trim(),
        content: {
          subject: subject.trim(),
          htmlContent: htmlContent.trim(),
          textContent: textContent.trim() || subject.trim() // Fallback if plain text is empty
        }
      };

      if (isEditMode) {
        await emailTemplateService.updateEmailTemplate(templateName, payload);
        toast.success("Cập nhật mẫu email thành công!");
      } else {
        await emailTemplateService.createEmailTemplate(payload);
        toast.success("Tạo mẫu email thành công!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      const error = err as { message?: string };
      toast.error(error.message || "Đã xảy ra lỗi khi lưu mẫu email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="relative bg-card rounded-2xl max-w-6xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">
                {isEditMode ? `Cập nhật mẫu email` : "Tạo mẫu email mới"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEditMode 
                  ? "Chỉnh sửa tiêu đề và giao diện HTML của mẫu email." 
                  : "Thiết lập mã định danh và thiết kế mẫu email mới."}
              </p>
            </div>
          </div>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Split layout: Editor on Left | Preview on Right */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border bg-muted/5">
          {/* LEFT SIDE: Input Form */}
          <div className="p-6 space-y-4 bg-card overflow-y-auto max-h-[calc(92vh-140px)]">
            {/* Template name input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Mã Định Danh Template (Template Name) <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isEditMode || isSubmitting}
                placeholder="Ví dụ: verify-otp, course-activation"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value.replace(/\s+/g, "-"))}
                className="w-full px-4 py-2 bg-background disabled:bg-muted/40 disabled:text-muted-foreground border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl text-sm transition outline-none font-mono"
              />
              <p className="text-[11px] text-muted-foreground/85 mt-1">
                Mã định danh duy nhất để gọi API gửi từ backend. Không chứa khoảng trắng (tự động chuyển thành dấu gạch ngang).
              </p>
            </div>

            {/* Subject input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Tiêu Đề Thư (Subject Line) <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                placeholder="Ví dụ: Chào mừng ${username} đã gia nhập hệ thống!"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl text-sm transition outline-none font-medium text-foreground"
              />
            </div>

            {/* Editor Tabs Container */}
            <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
              {/* Tab Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/20 px-4 py-2 gap-2">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab("html")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeEditorTab === "html"
                        ? "bg-accent text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    Nội dung HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab("text")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeEditorTab === "text"
                        ? "bg-accent text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    Văn bản thuần (Fallback)
                  </button>
                </div>

                {/* Quick variables list inside tab header for HTML tab */}
                {activeEditorTab === "html" && (
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase hidden sm:inline">Chèn nhanh:</span>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => insertVariable("${username}")}
                      className="px-2.5 py-1 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-md text-[10px] font-mono text-accent transition flex items-center gap-1 active:scale-95"
                    >
                      username
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => insertVariable("${email}")}
                      className="px-2.5 py-1 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-md text-[10px] font-mono text-accent transition flex items-center gap-1 active:scale-95"
                    >
                      email
                    </button>
                  </div>
                )}
              </div>

              {/* Tab Body */}
              <div>
                {activeEditorTab === "html" ? (
                  <div className="flex flex-col bg-background">
                    <textarea
                      ref={htmlInputRef}
                      required
                      disabled={isSubmitting}
                      placeholder="Nhập mã nguồn HTML ở đây... Hỗ trợ đầy đủ CSS inline và các tag chuẩn."
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border-0 focus:ring-0 rounded-b-xl text-xs font-mono h-[350px] resize-y overflow-y-auto leading-relaxed text-foreground selection:bg-accent/30 outline-none"
                    />
                    {/* Status Bar */}
                    <div className="px-4 py-2 bg-muted/20 border-t border-border text-[10px] text-muted-foreground font-mono flex justify-between items-center rounded-b-xl">
                      <span>HTML CODE MODE</span>
                      <span>{htmlContent.length} ký tự</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col bg-background">
                    <textarea
                      disabled={isSubmitting}
                      placeholder="Bản sao văn bản thuần của email dùng làm fallback nếu hộp thư người nhận không hỗ trợ HTML..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border-0 focus:ring-0 rounded-b-xl text-sm h-[350px] resize-y overflow-y-auto outline-none text-foreground leading-relaxed"
                    />
                    {/* Status Bar */}
                    <div className="px-4 py-2 bg-muted/20 border-t border-border text-[10px] text-muted-foreground font-mono flex justify-between items-center rounded-b-xl">
                      <span>PLAIN TEXT MODE</span>
                      <span>{textContent.length} ký tự</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Realtime Iframe Preview */}
          <div className="p-6 flex flex-col bg-muted/10 overflow-y-auto max-h-[calc(92vh-140px)]">
            {/* Tab selector for preview */}
            <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Code className="w-4 h-4 text-accent" />
                Xem trước thời gian thực
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditorTab("edit")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    editorTab === "edit"
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  HTML Giao Diện
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    editorTab === "preview"
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  Bản Văn Bản
                </button>
              </div>
            </div>

            {/* Email visual browser mockup */}
            <div className="flex-1 flex flex-col justify-start min-h-[300px]">
              {editorTab === "edit" ? (
                <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md w-full max-w-[550px] mx-auto">
                  {/* MacOS controls mockup */}
                  <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-150 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
                    <span className="text-[10px] text-gray-400 font-mono ml-4 truncate">Live Render Screen</span>
                  </div>
                  
                  {/* Simulated email header info */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100 text-xs text-gray-600 space-y-1">
                    <div>
                      <span className="font-semibold text-gray-400">Tiêu đề:</span>{" "}
                      <span className="font-bold text-gray-800">{subject || "(Chưa nhập tiêu đề)"}</span>
                    </div>
                  </div>

                  {htmlContent ? (
                    <iframe
                      srcDoc={htmlContent}
                      className="w-full h-[520px] border-0 bg-white"
                      title="HTML Live Render"
                    />
                  ) : (
                    <div className="w-full h-[520px] bg-white flex flex-col items-center justify-center text-center p-6 text-gray-400 text-sm">
                      <Mail className="w-12 h-12 text-gray-300 mb-3 animate-pulse" />
                      <p>Nhập mã HTML vào khung bên trái để xem giao diện xem thử...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-card p-5 rounded-xl border border-border w-full max-w-[550px] mx-auto shadow-md font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed h-[600px] overflow-y-auto">
                  {textContent || "(Nhập bản văn bản thuần ở ô bên trái)"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal actions footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="sm"
            disabled={isSubmitting}
          >
            Đóng
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="accent"
            size="sm"
            className="gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              isEditMode ? "Cập nhật mẫu" : "Tạo mẫu email"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
