"use client";

import type { PreviewMode, TargetSegment } from "./useEmailCampaign";

interface Props {
  previewMode: PreviewMode;
  setPreviewMode: (m: PreviewMode) => void;
  previewHtml: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  targetSegment: TargetSegment;
  selectedUsersCount: number;
}

export default function EmailPreviewPanel({
  previewMode,
  setPreviewMode,
  previewHtml,
  senderName,
  senderEmail,
  subject,
  targetSegment,
  selectedUsersCount,
}: Props) {
  const toLabel =
    targetSegment === "custom"
      ? `${selectedUsersCount} tài khoản đã chọn`
      : targetSegment === "premium"
      ? "Tất cả học viên Premium"
      : targetSegment === "inactive"
      ? "Tất cả tài khoản chưa kích hoạt"
      : "Toàn bộ thành viên JavaBuilder";

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .dark .email-preview-area .prose {
          color: inherit !important;
        }
        .dark .email-preview-area .prose strong {
          color: inherit !important;
        }
        .dark .email-preview-area .prose code {
          color: inherit !important;
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .dark .email-preview-area .prose a {
          color: #f97316 !important;
        }
        .dark .email-preview-area .prose blockquote {
          border-left-color: #e2e8f0 !important;
          color: inherit !important;
        }
        .dark .email-preview-area .prose th,
        .dark .email-preview-area .prose td {
          border-color: #e2e8f0 !important;
        }
        .dark .email-preview-area .prose th {
          color: inherit !important;
        }
        .dark .email-preview-area .prose hr {
          border-color: #e2e8f0 !important;
        }
      `,
        }}
      />

      {/* Header */}
      <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Xem Trước Email (Live Preview)
        </h3>
        <div className="flex bg-muted p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setPreviewMode("desktop")}
            title="Giao diện máy tính"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              previewMode === "desktop"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            title="Giao diện di động"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              previewMode === "mobile"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Email client simulation header */}
      <div className="p-3.5 bg-muted/20 border-b border-border text-xs space-y-1.5">
        <div className="flex border-b border-border/50 pb-1.5">
          <span className="text-muted-foreground/60 font-medium w-14 flex-shrink-0">
            Từ:
          </span>
          <span className="text-foreground/80 font-bold truncate">
            {senderName || "JavaBuilder"} &lt;
            {senderEmail || "noreply@javabuilder.online"}&gt;
          </span>
        </div>
        <div className="flex border-b border-border/50 pb-1.5">
          <span className="text-muted-foreground/60 font-medium w-14 flex-shrink-0">
            Đến:
          </span>
          <span className="text-foreground/80 truncate">{toLabel}</span>
        </div>
        <div className="flex pb-0.5">
          <span className="text-muted-foreground/60 font-medium w-14 flex-shrink-0">
            Tiêu đề:
          </span>
          <span className="text-foreground font-extrabold truncate">
            {subject || "(Chưa nhập tiêu đề)"}
          </span>
        </div>
      </div>

      {/* Rendered preview */}
      <div className="p-4 bg-muted/40 flex justify-center items-start overflow-x-hidden min-h-[480px] email-preview-area">
        <div
          className={`bg-background rounded-lg shadow-xs border border-border overflow-hidden transition-all duration-300 ${
            previewMode === "mobile" ? "w-[360px]" : "w-full"
          }`}
        >
          <iframe
            srcDoc={previewHtml}
            className="w-full h-[460px] border-0 bg-white"
            title="Campaign Email Live Render"
          />
        </div>
      </div>
    </div>
  );
}
