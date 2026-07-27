"use client";

import { useState, useEffect } from "react";
import { X, Download, ExternalLink, Copy, Check, FileText, Loader2, Code2 } from "lucide-react";
import toast from "react-hot-toast";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface FilePreviewModalProps {
  isOpen: boolean;
  fileName: string;
  fileUrl: string | null;
  fileSize?: string;
  onClose: () => void;
}

export default function FilePreviewModal({
  isOpen,
  fileName,
  fileUrl,
  fileSize,
  onClose,
}: FilePreviewModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const isCodeOrText = [
    "java",
    "js",
    "ts",
    "jsx",
    "tsx",
    "py",
    "html",
    "css",
    "json",
    "sql",
    "xml",
    "cpp",
    "c",
    "sh",
    "txt",
    "md",
    "csv",
  ].includes(ext);

  const isPdf = ext === "pdf";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !fileUrl || !isCodeOrText) {
      setContent(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch(fileUrl)
      .then((res) => res.text())
      .then((text) => {
        if (isMounted) {
          setContent(text);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải nội dung tệp:", err);
        if (isMounted) setContent("// Không thể tải nội dung xem trước tệp.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, fileUrl, isCodeOrText]);

  if (!isOpen || !fileUrl) return null;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Đã sao chép nội dung tệp!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      toast.loading(`Đang tải tệp ${fileName}...`, { id: "file-preview-down" });
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Tải tệp thành công!", { id: "file-preview-down" });
    } catch {
      window.open(fileUrl, "_blank");
      toast.dismiss("file-preview-down");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-accent/15 text-accent shrink-0">
              {isCodeOrText ? <Code2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-100 truncate">{fileName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {ext}
                </span>
                {fileSize && <span className="text-xs text-slate-400 font-medium">{fileSize}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCodeOrText && content && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Sao chép toàn bộ code"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline text-emerald-400">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Tải tệp về máy"
            >
              <Download className="w-4 h-4" />
            </button>

            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Mở trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/80 text-slate-200 transition-colors cursor-pointer ml-1"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-950 text-slate-100">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="text-xs font-semibold">Đang tải nội dung tệp...</span>
            </div>
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              className="w-full h-[70vh] rounded-xl border border-slate-800"
              title={fileName}
            />
          ) : isCodeOrText && content !== null ? (
            <div className="text-xs font-mono overflow-x-auto text-left">
              <PublicMarkdownRenderer
                content={`\`\`\`${ext}\n${content}\n\`\`\``}
              />
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs font-medium space-y-3">
              <p>Định dạng tệp này không hỗ trợ xem trực tiếp.</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent/90 transition-colors cursor-pointer"
              >
                Tải tệp {fileName} về máy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
