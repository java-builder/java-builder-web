"use client";

import { useState, useRef } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  height?: number;
}

type ViewMode = "edit" | "preview" | "split";

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Viết nội dung bài viết của bạn bằng Markdown...",
  error,
  height = 500,
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper function to insert markdown syntax at cursor position
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        selectedText.length ? start + prefix.length + selectedText.length : start + prefix.length
      );
    }, 0);
  };

  const ToolbarButton = ({
    icon,
    onClick,
    tooltip
  }: {
    icon: React.ReactNode;
    onClick: () => void;
    tooltip: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
      title={tooltip}
    >
      {icon}
    </button>
  );

  return (
    <div className="w-full flex flex-col rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-colors duration-200">
      {/* Top Bar: View Modes & Toolbar */}
      <div className="flex flex-col border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">

        {/* View Mode Tabs */}
        <div className="flex items-center px-1 pt-1 space-x-1 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${viewMode === "edit"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-x border-t border-gray-300 dark:border-gray-600 -mb-px relative z-10"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Viết
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${viewMode === "preview"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-x border-t border-gray-300 dark:border-gray-600 -mb-px relative z-10"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Xem trước
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${viewMode === "split"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-x border-t border-gray-300 dark:border-gray-600 -mb-px relative z-10"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Chia đôi
          </button>
        </div>

        {/* Toolbar - Only show in Edit/Split modes */}
        {viewMode !== "preview" && (
          <div className="flex flex-wrap items-center gap-1 p-2">
            {/* Headers */}
            <div className="flex items-center space-x-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
              <ToolbarButton
                onClick={() => insertMarkdown("# ", "")}
                icon={<span className="font-bold text-xs">H1</span>}
                tooltip="Heading 1"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("## ", "")}
                icon={<span className="font-bold text-xs">H2</span>}
                tooltip="Heading 2"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("### ", "")}
                icon={<span className="font-bold text-xs">H3</span>}
                tooltip="Heading 3"
              />
            </div>

            {/* Styling */}
            <div className="flex items-center space-x-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
              <ToolbarButton
                onClick={() => insertMarkdown("**", "**")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>}
                tooltip="In đậm (Bold)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("*", "*")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>}
                tooltip="In nghiêng (Italic)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("~~", "~~")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16" /><path d="M5.5 5.5l13 13" /></svg>}
                tooltip="Gạch ngang (Strikethrough)"
              />
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
              <ToolbarButton
                onClick={() => insertMarkdown("- ", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>}
                tooltip="Danh sách (Bullet List)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("1. ", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /></svg>}
                tooltip="Danh sách số (Ordered List)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("- [ ] ", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>}
                tooltip="Check list"
              />
            </div>

            {/* Blocks */}
            <div className="flex items-center space-x-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
              <ToolbarButton
                onClick={() => insertMarkdown("> ", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></svg>}
                tooltip="Trích dẫn (Quote)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("```\n", "\n```")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>}
                tooltip="Code Block"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("---\n", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>}
                tooltip="Divider"
              />
            </div>

            {/* Links & Media */}
            <div className="flex items-center space-x-0.5">
              <ToolbarButton
                onClick={() => insertMarkdown("[Link text](url)", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
                tooltip="Link"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("![Alt text](url)", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
                tooltip="Hình ảnh (Image)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("| Header | Header |\n| --- | --- |\n| Cell | Cell |", "")}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="12" y1="3" x2="12" y2="21" /></svg>}
                tooltip="Bảng (Table)"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        className={`relative ${error ? "border-2 border-red-300 dark:border-red-700 rounded-b-lg" : ""}`}
        style={{ height: `${height}px`, minHeight: `${height}px` }}
      >
        {viewMode === "edit" && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            spellCheck={false}
          />
        )}

        {viewMode === "preview" && (
          <div className="h-full overflow-y-auto p-6 bg-white dark:bg-gray-900">
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 italic">
                Chưa có nội dung để hiển thị
              </div>
            )}
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full divide-x divide-gray-200 dark:divide-gray-600">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
            <div className="h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
              {value ? (
                <MarkdownRenderer content={value} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 italic text-sm">
                  Preview sẽ hiển thị ở đây...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600 px-1">{error}</p>}
    </div>
  );
}
