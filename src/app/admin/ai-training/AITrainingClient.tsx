"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { aiTrainingApi } from "@/services/ai-training.service";
import { useI18n } from "@/contexts/I18nContext";

export default function AITrainingClient() {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".md") || file.name.endsWith(".markdown")) {
        setSelectedFile(file);
      } else {
        toast.error("Vui lòng chọn file markdown (.md hoặc .markdown)");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".md") || file.name.endsWith(".markdown")) {
        setSelectedFile(file);
      } else {
        toast.error("Vui lòng chọn file markdown (.md hoặc .markdown)");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file markdown");
      return;
    }

    setIsUploading(true);
    try {
      const response = await aiTrainingApi.ingestMarkdown(selectedFile);
      toast.success(response.message || t("admin.common.success"));
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch {
      toast.error(t("admin.common.error"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="p-6 text-foreground">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {t("admin.aiTraining.pageTitle")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("admin.aiTraining.pageSubtitle")}
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                dragActive
                  ? "border-accent bg-accent/5 dark:bg-accent/10"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <input
                id="file-input"
                type="file"
                accept=".md,.markdown"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20">
                  <svg
                    className="w-8 h-8 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Kéo thả file markdown vào đây
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  hoặc
                </p>
                
                <button
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
                >
                  Chọn file
                </button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Hỗ trợ: .md, .markdown
                </p>
              </div>
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="bg-muted rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-accent/10 dark:bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-accent"
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
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="ml-4 p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleRemoveFile}
                disabled={!selectedFile || isUploading}
                className="px-6 py-2.5 border border-input text-foreground rounded-lg font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang upload...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                Lưu ý
              </h4>
              <ul className="text-sm text-blue-600/90 dark:text-blue-400/90 space-y-1">
                <li>• File markdown sẽ được xử lý và lưu vào vector store</li>
                <li>• AI Chatbot sẽ sử dụng dữ liệu này để trả lời câu hỏi</li>
                <li>• Nội dung file nên có cấu trúc rõ ràng và chính xác</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
