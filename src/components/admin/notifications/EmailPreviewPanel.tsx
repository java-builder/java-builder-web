"use client";

import type { PreviewMode, TargetSegment } from "./useEmailCampaign";
import TemplateVariablesPanel from "./TemplateVariablesPanel";
import type { TemplateConfig } from "./emailTemplates";

interface Props {
  previewMode: PreviewMode;
  setPreviewMode: (m: PreviewMode) => void;
  previewHtml: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  targetSegment: TargetSegment;
  selectedUsersCount: number;
  // Variable panel
  currentTemplateCfg: TemplateConfig;
  systemVarsDetected: string[];
  customVarValues: Record<string, string>;
  onCustomVarChange: (varName: string, value: string) => void;
}

export default function EmailPreviewPanel({
  previewMode, setPreviewMode,
  previewHtml,
  senderName, senderEmail, subject,
  targetSegment, selectedUsersCount,
  currentTemplateCfg, systemVarsDetected,
  customVarValues, onCustomVarChange,
}: Props) {
  const toLabel = targetSegment === "custom"
    ? `${selectedUsersCount} tài khoản đã chọn`
    : targetSegment === "premium" ? "Tất cả học viên Premium"
    : targetSegment === "inactive" ? "Tất cả tài khoản chưa kích hoạt"
    : "Toàn bộ thành viên JavaBuilder";

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
          <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
          Xem Trước Email (Live Preview)
        </h3>
        <div className="flex bg-gray-200 dark:bg-slate-700/60 p-0.5 rounded-lg border border-gray-300/40 dark:border-slate-600/50">
          <button
            onClick={() => setPreviewMode("desktop")}
            title="Giao diện máy tính"
            className={`p-1.5 rounded-md transition-all ${previewMode === "desktop" ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            title="Giao diện di động"
            className={`p-1.5 rounded-md transition-all ${previewMode === "mobile" ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Variable panel: custom (admin fills) + system (backend injects) */}
      <TemplateVariablesPanel
        customVars={currentTemplateCfg.customVars}
        systemVarsDetected={systemVarsDetected}
        customVarValues={customVarValues}
        onChange={onCustomVarChange}
      />

      {/* Email client simulation header */}
      <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 text-xs space-y-2">
        <div className="flex border-b border-gray-100/50 dark:border-slate-800/50 pb-2">
          <span className="text-gray-400 font-medium w-14 flex-shrink-0">Từ:</span>
          <span className="text-gray-700 dark:text-gray-300 font-bold truncate">
            {senderName || "JavaBuilder"} &lt;{senderEmail || "noreply@javabuilder.online"}&gt;
          </span>
        </div>
        <div className="flex border-b border-gray-100/50 dark:border-slate-800/50 pb-2">
          <span className="text-gray-400 font-medium w-14 flex-shrink-0">Đến:</span>
          <span className="text-gray-700 dark:text-gray-300 truncate">{toLabel}</span>
        </div>
        <div className="flex pb-1">
          <span className="text-gray-400 font-medium w-14 flex-shrink-0">Tiêu đề:</span>
          <span className="text-gray-900 dark:text-white font-extrabold truncate">
            {subject || "(Chưa nhập tiêu đề)"}
          </span>
        </div>
      </div>

      {/* Rendered preview */}
      <div className="p-4 bg-gray-100 dark:bg-slate-950 flex justify-center items-start overflow-x-hidden min-h-[460px] max-h-[600px] overflow-y-auto">
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden transition-all duration-300 ${previewMode === "mobile" ? "w-[360px]" : "w-full"}`}>
          <div
            className="p-4 overflow-auto prose prose-sm dark:prose-invert max-w-none text-xs leading-normal"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  );
}
