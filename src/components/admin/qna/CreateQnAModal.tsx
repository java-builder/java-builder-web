"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Bug, Lightbulb, HelpCircle, AlertCircle, ChevronDown, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postService } from "@/services/post.service";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";

interface CreateQnAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TemplateType = "daily_problem" | "fix_bug" | "solution" | "general";

const TEMPLATES: Record<TemplateType, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  daily_problem: {
    name: "Daily Challenge",
    icon: Sparkles,
  },
  fix_bug: {
    name: "Fix Bug",
    icon: Bug,
  },
  solution: {
    name: "Solution",
    icon: Lightbulb,
  },
  general: {
    name: "Thảo luận / Hỏi đáp",
    icon: HelpCircle,
  },
};

export default function CreateQnAModal({ isOpen, onClose, onSuccess }: CreateQnAModalProps) {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("daily_problem");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Category Dropdown State
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTitle("");
    setContent("");
    setError(null);
    setActiveTemplate("daily_problem");

    let mounted = true;
    (async () => {
      setIsLoadingCategories(true);
      try {
        const resp = await categoryService.getAll(CategoryType.POST);
        const cats = resp?.data ?? [];
        if (mounted) {
          setCategories(cats);
          if (cats.length > 0) {
            setCategoryId((prev) => prev || cats[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        if (mounted) setIsLoadingCategories(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Click outside listener for category dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyTemplate = (tmplKey: TemplateType) => {
    setActiveTemplate(tmplKey);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết");
      return;
    }
    if (!categoryId) {
      setError("Vui lòng chọn danh mục");
      return;
    }
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bài viết");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await postService.create({
        title: title.trim(),
        categoryId,
        content: content.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Create Q&A post error", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr?.response?.data?.message || "Không thể tạo bài viết. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Tạo Thách Thức / Bài Q&A Thủ Công</h2>
              <p className="text-xs text-muted-foreground">
                Nhập thủ công tiêu đề, danh mục và nội dung bài viết theo định dạng Markdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Templates Pill Bar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Phân loại mẫu (Preset)
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(Object.keys(TEMPLATES) as TemplateType[]).map((key) => {
                const tmpl = TEMPLATES[key];
                const Icon = tmpl.icon;
                const isSelected = activeTemplate === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-accent text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tmpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields: Side by Side (Title 70% + Category 30%) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tiêu đề bài viết <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm shadow-sm transition-colors"
              />
            </div>

            {/* Category Custom Dropdown */}
            <div className="sm:col-span-1 relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-foreground mb-2">
                Danh mục <span className="text-destructive">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                disabled={isLoadingCategories}
                className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-foreground flex items-center justify-between text-sm hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm transition-colors"
              >
                <span className="truncate">
                  {isLoadingCategories
                    ? "Đang tải..."
                    : selectedCategoryObj
                    ? selectedCategoryObj.name
                    : "Chọn danh mục"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isCatDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Floating Custom Dropdown Menu */}
              {isCatDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {categories.length === 0 ? (
                    <p className="p-2 text-xs text-muted-foreground text-center">Không có danh mục nào</p>
                  ) : (
                    categories.map((cat) => {
                      const isSelected = cat.id === categoryId;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategoryId(cat.id);
                            setIsCatDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                            isSelected
                              ? "bg-accent/10 text-accent font-semibold"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* System MarkdownEditor */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nội dung bài viết (Markdown) <span className="text-destructive">*</span>
            </label>
            <MarkdownEditor
              value={content}
              onChange={(val) => setContent(val)}
              placeholder="Nhập nội dung bài viết bằng định dạng Markdown..."
              height={400}
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="button" variant="accent" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang đăng bài...</span>
              </div>
            ) : (
              <span>Đăng Bài Viết</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
