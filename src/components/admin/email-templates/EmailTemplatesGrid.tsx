"use client";

import { Eye, Edit3, Trash2, FileCode, Inbox } from "lucide-react";
import { EmailTemplateResponse } from "@/types/email-template";
import { Button } from "@/components/ui/button";

interface EmailTemplatesGridProps {
  templates: EmailTemplateResponse[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (tpl: EmailTemplateResponse) => void;
  onDelete: (name: string) => void;
  onPreview: (tpl: EmailTemplateResponse) => void;
  onClearFilter: () => void;
  onCreateNew: () => void;
}

export default function EmailTemplatesGrid({
  templates,
  isLoading,
  searchQuery,
  onEdit,
  onDelete,
  onPreview,
  onClearFilter,
  onCreateNew,
}: EmailTemplatesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-muted rounded w-1/3"></div>
              <div className="h-6 bg-muted rounded-full w-12"></div>
            </div>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted/80 rounded w-full"></div>
              <div className="h-4 bg-muted/80 rounded w-5/6"></div>
            </div>
            <div className="h-[1px] bg-border"></div>
            <div className="flex justify-end gap-3 pt-2">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto mt-6">
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Không tìm thấy mẫu email nào</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          {searchQuery 
            ? "Không tìm thấy kết quả phù hợp với từ khóa của bạn. Vui lòng thử từ khóa khác."
            : "Hệ thống chưa có mẫu email nào. Hãy tạo mẫu đầu tiên để bắt đầu gửi email tự động."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {searchQuery ? (
            <Button
              onClick={onClearFilter}
              variant="outline"
              size="sm"
            >
              Xóa bộ lọc
            </Button>
          ) : (
            <Button
              onClick={onCreateNew}
              variant="accent"
              size="sm"
            >
              Tạo mẫu mới
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((tpl) => (
        <div
          key={tpl.templateName}
          className="bg-card border border-border hover:border-accent/40 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col group overflow-hidden"
        >
          {/* Header card info */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg border border-accent/20">
                <FileCode className="w-3.5 h-3.5" />
                {tpl.templateName}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => onPreview(tpl)}
                  title="Xem trước"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => onEdit(tpl)}
                  title="Chỉnh sửa"
                  className="text-muted-foreground hover:text-accent"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => onDelete(tpl.templateName)}
                  title="Xóa mẫu"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-bold text-foreground text-[15px] line-clamp-1 mb-2">
              {tpl.subject}
            </h3>
            
            <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed mt-auto">
              {tpl.textContent || "Không có bản văn bản thuần."}
            </p>
          </div>

          {/* Bottom quick actions */}
          <div className="px-5 py-3 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono text-[10px] text-muted-foreground/60">AWS SES Template</span>
            <div className="flex gap-4">
              <button
                onClick={() => onPreview(tpl)}
                className="flex items-center gap-1 text-accent hover:underline font-semibold transition"
              >
                Xem mẫu
              </button>
              <button
                onClick={() => onEdit(tpl)}
                className="flex items-center gap-1 hover:text-foreground font-semibold transition"
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
