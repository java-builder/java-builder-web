"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "@/styles/markdown-editor.css";

// Import MDEditor dynamically để tránh SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ),
  },
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  height?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Viết nội dung bài viết của bạn...",
  error,
  height = 400,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`border rounded-lg p-4 ${error ? "border-red-300 bg-red-50" : "border-gray-300"}`}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`rounded-lg overflow-hidden ${error ? "border border-red-300" : ""}`}
      >
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          height={height}
          data-color-mode="light"
          preview="edit"
          hideToolbar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
        />
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
