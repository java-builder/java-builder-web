"use client";

import { useState } from "react";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

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

  return (
    <div className="space-y-2">
      <div
        className={`border rounded-lg overflow-hidden ${error ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-800`}
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === "write"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            ✏️ Viết
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === "preview"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
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
              className="w-full h-full p-4 border-0 resize-none focus:outline-none focus:ring-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
            />
          ) : (
            <div className="w-full h-full p-4 overflow-y-auto bg-white dark:bg-gray-800">
              {value ? (
                <PublicMarkdownRenderer content={value} />
              ) : (
                <p className="text-gray-400 dark:text-gray-500">Không có nội dung để xem trước</p>
              )}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {/* Hướng dẫn sử dụng */}
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="font-medium mb-2">💡 Hướng dẫn sử dụng Markdown:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <code className="bg-white dark:bg-gray-700 px-1 rounded"># Tiêu đề 1</code>
            <span className="ml-2">→ Tiêu đề lớn</span>
          </div>
          <div>
            <code className="bg-white dark:bg-gray-700 px-1 rounded">## Tiêu đề 2</code>
            <span className="ml-2">→ Tiêu đề nhỏ</span>
          </div>
          <div>
            <code className="bg-white dark:bg-gray-700 px-1 rounded">**in đậm**</code>
            <span className="ml-2">
              → <strong>in đậm</strong>
            </span>
          </div>
          <div>
            <code className="bg-white dark:bg-gray-700 px-1 rounded">*in nghiêng*</code>
            <span className="ml-2">
              → <em>in nghiêng</em>
            </span>
          </div>
          <div>
            <code className="bg-white dark:bg-gray-700 px-1 rounded">`code`</code>
            <span className="ml-2">
              → <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">code</code>
            </span>
          </div>
          <div>
            <code className="bg-white dark:bg-gray-700 px-1 rounded">- Danh sách</code>
            <span className="ml-2">→ • Danh sách</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="mb-1">
            <strong>Code block:</strong>
          </div>
          <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs block">
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
