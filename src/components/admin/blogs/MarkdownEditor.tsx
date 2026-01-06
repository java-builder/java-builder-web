"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MarkdownRenderer from "./MarkdownRenderer";
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
  height = 400,
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

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
      {/* View Mode Tabs */}
      <div className="flex items-center border border-gray-300 rounded-t-lg bg-gray-50">
        <button
          onClick={() => setViewMode("edit")}
          className={`px-4 py-2 text-sm font-medium rounded-tl-lg transition-colors duration-200 ${
            viewMode === "edit"
              ? "bg-white text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-4 h-4 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Viết
        </button>
        <button
          onClick={() => setViewMode("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            viewMode === "preview"
              ? "bg-white text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-4 h-4 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Xem trước
        </button>
        <button
          onClick={() => setViewMode("split")}
          className={`px-4 py-2 text-sm font-medium rounded-tr-lg transition-colors duration-200 ${
            viewMode === "split"
              ? "bg-white text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-4 h-4 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
            />
          </svg>
          Chia đôi
        </button>
      </div>

      {/* Editor Content */}
      <div
        className={`rounded-b-lg overflow-hidden ${error ? "border border-red-300" : ""}`}
      >
        {viewMode === "edit" && (
          <div style={{ height: `${height}px` }}>
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
        )}

        {viewMode === "preview" && (
          <div
            className="bg-white p-6 overflow-y-auto"
            style={{ height: `${height}px` }}
          >
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Chưa có nội dung</p>
                  <p className="text-sm">
                    Hãy viết nội dung ở tab &quot;Viết&quot; để xem preview
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === "split" && (
          <div
            className="grid grid-cols-2 gap-0 border border-gray-300 rounded-lg overflow-hidden"
            style={{ height: `${height}px` }}
          >
            {/* Editor bên trái */}
            <div className="border-r border-gray-300 overflow-hidden">
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
            {/* Preview bên phải */}
            <div className="bg-white overflow-y-auto p-4">
              {value ? (
                <MarkdownRenderer content={value} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p className="text-sm">Preview sẽ hiển thị ở đây...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Hướng dẫn sử dụng Markdown */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="font-medium mb-2">💡 Hướng dẫn sử dụng:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="font-medium text-gray-700 mb-1">📝 Tab Viết:</div>
            <p className="text-xs text-gray-600">
              Chỉnh sửa nội dung Markdown với toolbar đầy đủ
            </p>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">
              👁️ Tab Xem trước:
            </div>
            <p className="text-xs text-gray-600">
              Xem kết quả cuối cùng như khi xuất bản
            </p>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">
              🔄 Tab Chia đôi:
            </div>
            <p className="text-xs text-gray-600">
              Split-screen: Editor bên trái, Preview bên phải
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="font-medium mb-2">🎯 Cách sử dụng các tab:</div>
          <div className="text-xs text-gray-600 space-y-1 mb-3">
            <div>
              • <strong>Tab Viết:</strong> Chỉ hiển thị editor để tập trung viết
            </div>
            <div>
              • <strong>Tab Xem trước:</strong> Chỉ hiển thị kết quả cuối cùng
              để kiểm tra
            </div>
            <div>
              • <strong>Tab Chia đôi:</strong> Hiển thị cả editor và preview
              cùng lúc
            </div>
          </div>
          <div className="font-medium mb-2">📖 Syntax Markdown cơ bản:</div>
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
            <div>
              <code className="bg-white px-1 rounded">[Link](url)</code>
              <span className="ml-2">
                →{" "}
                <a href="#" className="text-blue-600 underline">
                  Link
                </a>
              </span>
            </div>
            <div>
              <code className="bg-white px-1 rounded">![Alt](url)</code>
              <span className="ml-2">→ Hình ảnh</span>
            </div>
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
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="mb-1">
            <strong>Bảng:</strong>
          </div>
          <code className="bg-white px-2 py-1 rounded text-xs block">
            | Cột 1 | Cột 2 |<br />
            |-------|-------|
            <br />| Dữ liệu 1 | Dữ liệu 2 |
          </code>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="mb-1">
            <strong>Blockquote:</strong>
          </div>
          <code className="bg-white px-2 py-1 rounded text-xs block">
            &gt; Đây là một trích dẫn
          </code>
        </div>
      </div>
    </div>
  );
}
