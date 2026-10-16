import { useState, useRef } from "react";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import {
  Bold,
  Italic,
  Strikethrough,
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

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  height?: number;
  readOnly?: boolean;
}

type ViewMode = "edit" | "preview" | "split";

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Viết nội dung bài viết của bạn bằng Markdown...",
  error,
  height = 500,
  readOnly = false,
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(readOnly ? "preview" : "split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        <div className="flex items-center px-1 pt-1 space-x-1 border-b border-gray-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${viewMode === "edit"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-x border-t border-gray-300 dark:border-gray-600 -mb-px relative z-10"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Viết
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${viewMode === "preview"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-x border-t border-gray-300 dark:border-gray-600 -mb-px relative z-10"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Xem trước
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${viewMode === "split"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-x border-t border-gray-300 dark:border-gray-600 -mb-px relative z-10"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Chia đôi
          </button>
        </div>

        {/* Toolbar - Only show in Edit/Split modes and if not readOnly */}
        {viewMode !== "preview" && !readOnly && (
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
                icon={<Bold className="w-4 h-4" />}
                tooltip="In đậm (Bold)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("*", "*")}
                icon={<Italic className="w-4 h-4" />}
                tooltip="In nghiêng (Italic)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("~~", "~~")}
                icon={<Strikethrough className="w-4 h-4" />}
                tooltip="Gạch ngang (Strikethrough)"
              />
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
              <ToolbarButton
                onClick={() => insertMarkdown("- ", "")}
                icon={<List className="w-4 h-4" />}
                tooltip="Danh sách (Bullet List)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("1. ", "")}
                icon={<ListOrdered className="w-4 h-4" />}
                tooltip="Danh sách số (Ordered List)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("- [ ] ", "")}
                icon={<CheckSquare className="w-4 h-4" />}
                tooltip="Check list"
              />
            </div>

            {/* Blocks */}
            <div className="flex items-center space-x-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
              <ToolbarButton
                onClick={() => insertMarkdown("> ", "")}
                icon={<Quote className="w-4 h-4" />}
                tooltip="Trích dẫn (Quote)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("```\n", "\n```")}
                icon={<FileCode className="w-4 h-4" />}
                tooltip="Code Block"
              />
              <ToolbarButton
                onClick={() =>
                  insertMarkdown(
                    "```mermaid\ngraph TD\n    A[Bắt đầu] --> B[Xử lý]\n    B --> C[Kết thúc]\n```\n",
                    ""
                  )
                }
                icon={<Workflow className="w-4 h-4" />}
                tooltip="Sơ đồ Mermaid"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("---\n", "")}
                icon={<Minus className="w-4 h-4" />}
                tooltip="Divider"
              />
            </div>

            {/* Links & Media */}
            <div className="flex items-center space-x-0.5">
              <ToolbarButton
                onClick={() => insertMarkdown("[Link text](url)", "")}
                icon={<Link className="w-4 h-4" />}
                tooltip="Link"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("![Alt text](url)", "")}
                icon={<ImageIcon className="w-4 h-4" />}
                tooltip="Hình ảnh (Image)"
              />
              <ToolbarButton
                onClick={() => insertMarkdown("| Header | Header |\n| --- | --- |\n| Cell | Cell |", "")}
                icon={<Table className="w-4 h-4" />}
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
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            spellCheck={false}
            readOnly={readOnly}
          />
        )}

        {viewMode === "preview" && (
          <div className="h-full overflow-y-auto p-6 bg-white dark:bg-gray-900">
            {value ? (
              <PublicMarkdownRenderer content={value} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-300 italic">
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
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              spellCheck={false}
              readOnly={readOnly}
            />
            <div className="h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
              {value ? (
                <PublicMarkdownRenderer content={value} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-300 italic text-sm">
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
