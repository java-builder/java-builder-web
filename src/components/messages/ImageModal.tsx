"use client";

import { useEffect } from "react";
import { X, Download, ExternalLink, ZoomIn } from "lucide-react";
import toast from "react-hot-toast";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  title?: string;
}

export default function ImageModal({
  isOpen,
  imageUrl,
  onClose,
  title = "Hình ảnh đính kèm",
}: ImageModalProps) {
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

  if (!isOpen || !imageUrl) return null;

  const handleDownload = async () => {
    try {
      toast.loading("Đang tải ảnh...", { id: "img-download" });
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = title || "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Tải ảnh thành công!", { id: "img-download" });
    } catch {
      window.open(imageUrl, "_blank");
      toast.dismiss("img-download");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-6 select-none"
      onClick={onClose}
    >
      {/* Top Bar Controls */}
      <div
        className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-white/90 min-w-0">
          <ZoomIn className="w-5 h-5 text-accent shrink-0" />
          <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Tải ảnh về máy"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Open in New Tab Button */}
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Mở trong tab mới"
          >
            <ExternalLink className="w-5 h-5" />
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer ml-1"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Image */}
      <div
        className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
        />
      </div>
    </div>
  );
}
