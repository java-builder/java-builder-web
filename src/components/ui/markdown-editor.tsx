"use client";

import { useState, useRef } from "react";
import { MarkdownViewer } from "./markdown-viewer";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  FileCode,
  Workflow,
  Minus,
  Link,
  Image as ImageIcon,
  Table,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  preview?: "edit" | "preview" | "split";
  className?: string;
  height?: number | string;
  error?: string;
  readOnly?: boolean;
}

type ViewMode = "edit" | "preview" | "split";

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Viết nội dung bài viết bằng Markdown...",
  minHeight = "350px",
  preview,
  className,
  height,
  error,
  readOnly = false,
}: MarkdownEditorProps) {
  const initialMode: ViewMode = readOnly ? "preview" : preview || "split";
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const calculatedHeight = height
    ? typeof height === "number"
      ? `${height}px`
      : height
    : minHeight;

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    if (readOnly) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange?.(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        selectedText.length
          ? start + prefix.length + selectedText.length
          : start + prefix.length
      );
    }, 0);
  };

  const ToolbarButton = ({
    icon,
    onClick,
    tooltip,
  }: {
    icon: React.ReactNode;
    onClick: () => void;
    tooltip: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={readOnly}
      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      title={tooltip}
      aria-label={tooltip}
    >
      {icon}
    </button>
  );

  return (
    <div className={cn("w-full flex flex-col space-y-1.5", className)}>
      <div
        className={cn(
          "w-full flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden transition-colors",
          error && "border-red-500 dark:border-red-500"
        )}
      >
        {/* Top Bar: View Modes & Toolbar */}
        <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          {/* View Mode Tabs */}
          <div className="flex items-center px-2 pt-1.5 space-x-1 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-t-[4px] transition-colors cursor-pointer",
                viewMode === "edit"
                  ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-x border-t border-slate-200 dark:border-slate-800 -mb-px relative z-10"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              Soạn thảo
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-t-[4px] transition-colors cursor-pointer",
                viewMode === "split"
                  ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-x border-t border-slate-200 dark:border-slate-800 -mb-px relative z-10"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              Chia đôi
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-t-[4px] transition-colors cursor-pointer",
                viewMode === "preview"
                  ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-x border-t border-slate-200 dark:border-slate-800 -mb-px relative z-10"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              Xem trước
            </button>
          </div>

          {/* Formatting Toolbar */}
          {!readOnly && viewMode !== "preview" && (
            <div className="flex flex-wrap items-center gap-0.5 p-1.5 overflow-x-auto">
              <ToolbarButton
                icon={<Bold className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("**", "**")}
                tooltip="In đậm (**text**)"
              />
              <ToolbarButton
                icon={<Italic className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("*", "*")}
                tooltip="In nghiêng (*text*)"
              />
              <ToolbarButton
                icon={<Strikethrough className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("~~", "~~")}
                tooltip="Gạch ngang (~~text~~)"
              />
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <ToolbarButton
                icon={<Heading className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("### ")}
                tooltip="Tiêu đề (### Title)"
              />
              <ToolbarButton
                icon={<List className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("- ")}
                tooltip="Danh sách gạch đầu dòng"
              />
              <ToolbarButton
                icon={<ListOrdered className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("1. ")}
                tooltip="Danh sách đánh số"
              />
              <ToolbarButton
                icon={<CheckSquare className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("- [ ] ")}
                tooltip="Danh sách công việc"
              />
              <ToolbarButton
                icon={<Quote className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("> ")}
                tooltip="Trích dẫn"
              />
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <ToolbarButton
                icon={<FileCode className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("```java\n", "\n```")}
                tooltip="Khối mã nguồn"
              />
              <ToolbarButton
                icon={<Workflow className="w-3.5 h-3.5" />}
                onClick={() =>
                  insertMarkdown(
                    "```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```\n"
                  )
                }
                tooltip="Sơ đồ Mermaid"
              />
              <ToolbarButton
                icon={<Table className="w-3.5 h-3.5" />}
                onClick={() =>
                  insertMarkdown(
                    "| Cột 1 | Cột 2 | Cột 3 |\n| :--- | :---: | ---: |\n| Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 |\n"
                  )
                }
                tooltip="Chèn bảng"
              />
              <ToolbarButton
                icon={<Minus className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("\n---\n")}
                tooltip="Đường phân cách"
              />
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <ToolbarButton
                icon={<Link className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("[Tiêu đề liên kết](", ")")}
                tooltip="Chèn liên kết"
              />
              <ToolbarButton
                icon={<ImageIcon className="w-3.5 h-3.5" />}
                onClick={() => insertMarkdown("![Mô tả ảnh](", ")")}
                tooltip="Chèn hình ảnh"
              />
            </div>
          )}
        </div>

        {/* Content Panes */}
        <div
          className={cn(
            "grid transition-all",
            viewMode === "split"
              ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800"
              : "grid-cols-1"
          )}
          style={{ minHeight: calculatedHeight }}
        >
          {/* Editor Pane */}
          {(viewMode === "edit" || viewMode === "split") && (
            <div className="relative flex flex-col h-full bg-white dark:bg-slate-950">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                readOnly={readOnly}
                style={{ minHeight: calculatedHeight }}
                className="w-full flex-1 p-4 font-mono text-sm leading-relaxed text-slate-900 dark:text-slate-100 bg-transparent resize-y outline-none focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div
              className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950"
              style={{ minHeight: calculatedHeight }}
            >
              {value && value.trim() ? (
                <MarkdownViewer content={value} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 italic text-sm py-8">
                  Chưa có nội dung để hiển thị...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default MarkdownEditor;
