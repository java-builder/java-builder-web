"use client";

import { useState } from "react";

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  height?: number;
}

export default function SimpleMarkdownEditor({
  value,
  onChange,
  placeholder = "Viết nội dung bài viết của bạn...",
  error,
  height = 400,
}: SimpleMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Simple markdown to HTML converter (basic)
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/`([^`]*)`/gim, "<code>$1</code>")
      .replace(/```([^```]*)```/gim, "<pre><code>$1</code></pre>")
      .replace(/\n/gim, "<br>");
  };

  return (
    <div className="space-y-2">
      <div
        className={`border rounded-lg overflow-hidden ${error ? "border-red-300" : "border-gray-300"}`}
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === "write"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ✏️ Viết
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === "preview"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            👁️ Xem trước
          </button>
        </div>

        {/* Content */}
        <div style={{ height: height }}>
          {activeTab === "write" ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full p-4 border-0 resize-none focus:outline-none focus:ring-0"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
            />
          ) : (
            <div
              className="w-full h-full p-4 overflow-y-auto prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: value
                  ? markdownToHtml(value)
                  : '<p class="text-gray-400">Không có nội dung để xem trước</p>',
              }}
            />
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Hướng dẫn sử dụng */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="font-medium mb-2">💡 Hướng dẫn sử dụng Markdown:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <code className="bg-white px-1 rounded"># Tiêu đề 1</code>
            <span className="ml-2">→ Tiêu đề lớn</span>
          </div>
          <div>
            <code className="bg-white px-1 rounded">## Tiêu đề 2</code>
            <span className="ml-2">→ Tiêu đề nhỏ</span>
          </div>
          <div>
            <code className="bg-white px-1 rounded">**in đậm**</code>
            <span className="ml-2">
              → <strong>in đậm</strong>
            </span>
          </div>
          <div>
            <code className="bg-white px-1 rounded">*in nghiêng*</code>
            <span className="ml-2">
              → <em>in nghiêng</em>
            </span>
          </div>
          <div>
            <code className="bg-white px-1 rounded">`code`</code>
            <span className="ml-2">
              → <code className="bg-gray-100 px-1 rounded">code</code>
            </span>
          </div>
          <div>
            <code className="bg-white px-1 rounded">- Danh sách</code>
            <span className="ml-2">→ • Danh sách</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="mb-1">
            <strong>Code block:</strong>
          </div>
          <code className="bg-white px-2 py-1 rounded text-xs block">
            ```javascript
            <br />
            console.log(&#39;Hello World!&#39;);
            <br />
            ```
          </code>
        </div>
      </div>
    </div>
  );
}
