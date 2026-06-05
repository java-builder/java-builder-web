"use client";

import { useState } from "react";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface MarkdownTabsProps {
  label: string;
  content: string;
  markdownLabel: string;
  previewLabel: string;
  maxHeight?: string;
}

export default function MarkdownTabs({
  label,
  content,
  markdownLabel,
  previewLabel,
  maxHeight = "max-h-[400px]",
}: MarkdownTabsProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("preview");

  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
        <div className="flex border-b border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-700/40">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-4 py-2 text-xs font-semibold transition ${
              activeTab === "write"
                ? "border-b-2 border-accent bg-white text-accent dark:bg-slate-800"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {markdownLabel}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-xs font-semibold transition ${
              activeTab === "preview"
                ? "border-b-2 border-accent bg-white text-accent dark:bg-slate-800"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {previewLabel}
          </button>
        </div>
        {activeTab === "write" ? (
          <pre
            className={`whitespace-pre-wrap bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:bg-slate-900/40 dark:text-white ${maxHeight} overflow-y-auto`}
          >
            {content}
          </pre>
        ) : (
          <div
            className={`bg-white px-4 py-4 dark:bg-slate-800 ${maxHeight} overflow-y-auto`}
          >
            <div className="prose prose-sm max-w-none dark:prose-invert sm:prose">
              <PublicMarkdownRenderer content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
