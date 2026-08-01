"use client";

import { useState, useEffect, useRef } from "react";
import { X, Edit3, AlertCircle, CheckCircle2, ChevronDown, Check, Tag as TagIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postService } from "@/services/post.service";
import { categoryService } from "@/services/category.service";
import { tagService } from "@/services/tag.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { Tag as TagType } from "@/types/tag";
import { PostDetail } from "@/types/post";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";

interface UpdateQnAModalProps {
  post: PostDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateQnAModal({ post, isOpen, onClose, onSuccess }: UpdateQnAModalProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Category Dropdown State
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tag Selection State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<TagType[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(() => {
    if (!isOpen || !post) return;
    setTitle(post.title || "");
    setCategoryId(post.category?.id || "");
    setContent(post.content || "");
    setIsSolved(!!post.isSolved);
    setTags(post.tags || []);
    setTagInput("");
    setTagSuggestions([]);
    setError(null);

    let mounted = true;
    (async () => {
      setIsLoadingCategories(true);
      try {
        const resp = await categoryService.getAll(CategoryType.POST);
        const cats = resp?.data ?? [];
        if (mounted) {
          setCategories(cats);
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
  }, [isOpen, post]);

  // Click outside listener for category dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, post]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tagInput.trim()) {
        searchTags(tagInput);
      } else {
        setTagSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [tagInput]);

  const searchTags = async (query: string) => {
    setIsLoadingTags(true);
    try {
      const response = await tagService.search(query, 1, 10);
      setTagSuggestions(response.data?.data || []);
    } catch (err) {
      console.error("Error searching tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleAddTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  if (!isOpen || !post) return null;

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
      await postService.update(post.id, {
        title: title.trim(),
        categoryId,
        content: content.trim(),
        isSolved,
        tags,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Update Q&A post error", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr?.response?.data?.message || "Không thể cập nhật bài viết. Vui lòng thử lại!");
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
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Chỉnh Sửa Bài Viết Q&A</h2>
              <p className="text-xs text-muted-foreground">ID: {post.id}</p>
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

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
              <TagIcon className="w-4 h-4 mr-1.5 text-accent" />
              Tags bài viết
            </label>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                placeholder="Nhập tag kỹ thuật (ví dụ: java, spring-boot, microservices) và nhấn Enter..."
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm shadow-sm transition-colors"
              />
              {isLoadingTags && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="animate-spin w-4 h-4 text-accent" />
                </div>
              )}
              {tagSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1.5 bg-card border border-border rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {tagSuggestions.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleAddTag(t.name)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-left text-foreground hover:bg-muted transition-colors"
                    >
                      <TagIcon className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Thêm các tag liên quan giúp bài viết dễ dàng tìm kiếm (nhấn Enter để chọn)
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-3 py-1 bg-accent/15 border border-accent/20 text-accent rounded-lg text-xs font-semibold shadow-sm"
                  >
                    <TagIcon className="w-3 h-3 mr-1.5" />
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="ml-2 text-accent/80 hover:text-accent hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Solved Status Switch */}
          <div className="p-4 rounded-lg border border-border bg-background flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isSolved ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Trạng thái giải quyết (Solved Status)</p>
                <p className="text-xs text-muted-foreground">
                  Đánh dấu bài viết đã được trả lời hoặc giải quyết xong
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSolved}
                onChange={(e) => setIsSolved(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
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
                <span>Đang lưu...</span>
              </div>
            ) : (
              <span>Lưu Thay Đổi</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
