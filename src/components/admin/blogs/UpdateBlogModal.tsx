"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  BlogType,
  BlogTypeDisplayNames,
  Blog,
} from "@/types/blog";
import { blogService } from "@/services/blog.service";
import { categoryService } from "@/services/category.service";
import { tagService } from "@/services/tag.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { Tag } from "@/types/tag";
import MarkdownEditor from "./MarkdownEditor";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  X,
  Upload,
  Loader2,
  FolderOpen,
  Tag as TagIcon,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface UpdateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blogSlug: string | null;
}

interface UpdateBlogFormData {
  title: string;
  content: string;
  summary?: string;
  key?: string;
  blogType: BlogType;
  categoryId?: string;
  tags?: string[];
  isPremium?: boolean;
}

export default function UpdateBlogModal({
  isOpen,
  onClose,
  onSuccess,
  blogSlug,
}: UpdateBlogModalProps) {
  const [formData, setFormData] = useState<UpdateBlogFormData>({
    title: "",
    content: "",
    summary: "",
    key: "",
    blogType: BlogType.TUTORIAL,
    categoryId: undefined,
    tags: [],
    isPremium: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll(CategoryType.BLOG);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

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
    } catch (error) {
      console.error("Error searching tags:", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const loadBlogDetails = useCallback(async () => {
    if (!blogSlug) return;
    
    setIsLoadingBlog(true);
    try {
      const fullBlog = await blogService.getBlogBySlug(blogSlug);
      
      if (!fullBlog) {
        throw new Error("Blog not found");
      }
      
      setCurrentBlog(fullBlog);
      setFormData({
        title: fullBlog.title,
        content: fullBlog.content || "",
        summary: fullBlog.summary || "",
        key: "",
        blogType: fullBlog.blogType,
        categoryId: fullBlog.category?.id,
        tags: fullBlog.tags?.map(t => typeof t === 'string' ? t : t.name) || [],
        isPremium: fullBlog.isPremium || false,
      });
      setImagePreview(fullBlog.thumbnailUrl || "");
    } catch (error) {
      console.error("Error loading blog details:", error);
      toast.error("Không thể tải nội dung bài viết");
    } finally {
      setIsLoadingBlog(false);
    }
  }, [blogSlug]);

  useEffect(() => {
    if (blogSlug && isOpen) {
      loadBlogDetails();
    }
  }, [blogSlug, isOpen, loadBlogDetails]);

  const handleInputChange = (
    field: keyof UpdateBlogFormData,
    value: string | BlogType | string[] | boolean | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = (tagName: string) => {
    const trimmedTag = tagName.trim();
    if (!trimmedTag) return;
    
    const currentTags = formData.tags || [];
    if (!currentTags.includes(trimmedTag)) {
      handleInputChange("tags", [...currentTags, trimmedTag]);
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.tags || [];
    handleInputChange("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        key: "Vui lòng chọn file ảnh hợp lệ",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        key: "Kích thước ảnh không được vượt quá 5MB",
      }));
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setErrors((prev) => ({ ...prev, key: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung không được để trống";
    }

    if (!formData.blogType) {
      newErrors.blogType = "Vui lòng chọn loại bài viết";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentBlog) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let finalImageKey: string | undefined = undefined;

      // Upload new image if selected
      if (selectedFile) {
        setIsUploadingImage(true);
        try {
          const uploadResult = await blogService.uploadFeaturedImage(selectedFile);
          finalImageKey = uploadResult.key;
        } catch (uploadError: unknown) {
          setErrors((prev) => ({
            ...prev,
            key: (uploadError as Error)?.message || "Lỗi khi tải ảnh lên",
          }));
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Update blog - only include key if it was changed
      const updatePayload: Partial<UpdateBlogFormData> & { key?: string } = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        blogType: formData.blogType,
        categoryId: formData.categoryId,
        isPremium: formData.isPremium || false,
      };

      // Only include key if a new image was uploaded
      if (finalImageKey !== undefined) {
        updatePayload.key = finalImageKey;
      }

      // Only include tags if they were changed
      const originalTags = currentBlog.tags?.map(t => typeof t === 'string' ? t : t.name).sort() || [];
      const currentTags = (formData.tags || []).sort();
      const tagsChanged = JSON.stringify(originalTags) !== JSON.stringify(currentTags);
      
      if (tagsChanged) {
        updatePayload.tags = formData.tags;
      }

      await blogService.updateBlog(currentBlog.id, updatePayload);

      toast.success("Cập nhật bài viết thành công!");
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      console.error("Error updating blog:", error);
      setErrors((prev) => ({
        ...prev,
        submit: (error as Error)?.message || "Có lỗi xảy ra khi cập nhật bài viết",
      }));
      toast.error("Cập nhật bài viết thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData({
      title: "",
      content: "",
      summary: "",
      key: "",
      blogType: BlogType.TUTORIAL,
      categoryId: undefined,
      tags: [],
    });
    setErrors({});
    setImagePreview("");
    setSelectedFile(null);
    setTagInput("");
    setTagSuggestions([]);
    setCurrentBlog(null);
    onClose();
  };

  if (!isOpen || !blogSlug) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        <div className="relative w-full max-w-7xl bg-card border border-border text-foreground rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Cập nhật bài viết
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Chỉnh sửa nội dung bài viết của bạn
              </p>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon-sm"
              className="hover:bg-muted text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {isLoadingBlog ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="animate-spin h-8 w-8 text-accent mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Đang tải nội dung bài viết...</p>
                </div>
              </div>
            ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tiêu đề bài viết <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                    className={`w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm transition-colors duration-200 ${errors.title ? "border-destructive bg-destructive/10" : "border-input"
                      }`}
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Loại bài viết <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.blogType}
                    onChange={(e) =>
                      handleInputChange("blogType", e.target.value as BlogType)
                    }
                    className={`w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm transition-colors duration-200 ${errors.blogType ? "border-destructive bg-destructive/10" : "border-input"
                      }`}
                  >
                    {Object.entries(BlogTypeDisplayNames).map(
                      ([key, displayName]) => (
                        <option key={key} value={key}>
                          {displayName}
                        </option>
                      ),
                    )}
                  </select>
                  {errors.blogType && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.blogType}</p>
                  )}
                </div>
              </div>

              {/* Category and Tags Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
                    <FolderOpen className="w-4 h-4 mr-1.5 text-accent" />
                    Danh mục
                  </label>
                  <div className="relative">
                    <select
                      value={formData.categoryId || ""}
                      onChange={(e) =>
                        handleInputChange("categoryId", e.target.value || undefined)
                      }
                      className="w-full px-4 py-3 pr-10 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm appearance-none cursor-pointer hover:border-accent/50"
                    >
                      <option value="" className="text-muted-foreground">-- Chọn danh mục --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="text-foreground">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Chọn danh mục phù hợp cho bài viết
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
                    <TagIcon className="w-4 h-4 mr-1.5 text-accent" />
                    Tags
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
                      placeholder="Nhập tag và nhấn Enter..."
                      className="w-full px-4 py-3 pr-10 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm"
                    />
                    {isLoadingTags && (
                      <div className="absolute right-3 top-3.5">
                        <Loader2 className="animate-spin w-4 h-4 text-accent" />
                      </div>
                    )}
                    {tagSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {tagSuggestions.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleAddTag(tag.name)}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted text-foreground transition-colors duration-200 flex items-center space-x-2 border-b border-border last:border-b-0"
                          >
                            <TagIcon className="w-4 h-4 text-accent" />
                            <span>{tag.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Thêm tags để dễ tìm kiếm (nhấn Enter để thêm)
                  </p>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 bg-accent/15 border border-accent/20 text-accent rounded-lg text-xs font-semibold shadow-sm hover:bg-accent/20 transition-colors duration-200"
                        >
                          <TagIcon className="w-3 h-3 mr-1.5" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-accent/80 hover:text-accent hover:bg-accent/20 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary and Featured Image Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tóm tắt
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    placeholder="Viết tóm tắt ngắn gọn về nội dung bài viết..."
                    className="w-full h-[200px] px-4 py-3 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm resize-none"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-1.5 text-accent" />
                    Ảnh đại diện
                  </label>
                  
                  <div
                    onClick={() => !isUploadingImage && !isLoading && fileInputRef.current?.click()}
                    className={`relative w-full h-[200px] rounded-lg border-2 border-dashed transition-all duration-200 overflow-hidden bg-muted/30 ${
                      isUploadingImage || isLoading
                        ? 'border-border cursor-not-allowed opacity-50'
                        : 'border-border hover:border-accent hover:bg-accent/5 cursor-pointer'
                    }`}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        sizes="100vw"
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">Click để chọn ảnh</span>
                        <span className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF tối đa 5MB</span>
                      </div>
                    )}
                    
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin w-8 h-8 text-accent mb-2" />
                        <span className="text-sm text-accent">Đang tải ảnh lên...</span>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                  />

                  {errors.key && (
                    <p className="mt-2 text-sm text-destructive flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.key}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nội dung bài viết <span className="text-destructive">*</span>
                </label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange("content", value)}
                  placeholder="Viết nội dung chi tiết của bài viết bằng Markdown..."
                  error={errors.content}
                  height={500}
                />
              </div>

              {errors.submit && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center text-destructive">
                    <X className="w-5 h-5 mr-2" />
                    <span className="text-sm">{errors.submit}</span>
                  </div>
                </div>
              )}

              {/* Premium Checkbox */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={formData.isPremium || false}
                  onChange={(e) =>
                    handleInputChange("isPremium", e.target.checked)
                  }
                  className="w-4 h-4 text-accent border-input rounded focus:ring-accent bg-background"
                  disabled={isLoading}
                />
                <label htmlFor="isPremium" className="text-sm text-foreground">
                  Chỉ dành cho Premium (yêu cầu subscription để đọc)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  disabled={isLoading}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="accent"
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      {isUploadingImage ? "Đang tải ảnh..." : "Đang cập nhật..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Cập nhật
                    </>
                  )}
                </Button>
              </div>
            </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );

}
