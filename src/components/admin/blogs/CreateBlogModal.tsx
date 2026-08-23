"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  BlogType,
  BlogTypeDisplayNames,
  CreateBlogRequest,
} from "@/types/blog";
import { blogService } from "@/services/blog.service";
import { categoryService } from "@/services/category.service";
import { tagService } from "@/services/tag.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { Tag } from "@/types/tag";
import MarkdownEditor from "./MarkdownEditor";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import BlogTypeIcon from "./BlogTypeIcon";
import {
  X,
  Upload,
  Loader2,
  FolderOpen,
  Tag as TagIcon,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBlogModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBlogModalProps) {
  const [formData, setFormData] = useState<CreateBlogRequest>({
    title: "",
    content: "",
    summary: "",
    key: "",
    blogType: BlogType.TUTORIAL,
    categoryId: undefined,
    tags: [],
    isPremium: false,
    isFeatured: false,
    featuredOrder: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [maxFeaturedOrder, setMaxFeaturedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.isFeatured && isOpen) {
      const fetchMaxOrder = async () => {
        try {
          const res = await blogService.getMaxFeaturedOrder();
          setMaxFeaturedOrder(res.data ?? 0);
        } catch (error) {
          console.error("Error fetching max featured order:", error);
        }
      };
      fetchMaxOrder();
    }
  }, [formData.isFeatured, isOpen]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll(CategoryType.BLOG);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const blogTypeOptions: SelectOption[] = useMemo(() => {
    return Object.entries(BlogTypeDisplayNames).map(([key, displayName]) => ({
      value: key,
      label: displayName,
      icon: (
        <BlogTypeIcon
          blogType={key as BlogType}
          className="w-4 h-4 text-accent"
        />
      ),
    }));
  }, []);

  const categoryOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Chọn danh mục --" },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    ];
  }, [categories]);

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

  const handleInputChange = (
    field: keyof CreateBlogRequest,
    value: string | BlogType | string[] | boolean | number | undefined,
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

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const finalFormData: CreateBlogRequest = {
        ...formData,
        isFeatured: formData.isFeatured || false,
        featuredOrder: formData.isFeatured ? formData.featuredOrder : undefined,
      };

      // Nếu có file được chọn, upload trước
      if (selectedFile) {
        setIsUploadingImage(true);
        try {
          const uploadResult =
            await blogService.uploadFeaturedImage(selectedFile);
          finalFormData.key = uploadResult.key;
        } catch (uploadError: unknown) {
          setErrors((prev) => ({
            ...prev,
            key:
              (uploadError as Error)?.message || "Lỗi khi tải ảnh lên",
          }));
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Tạo blog với dữ liệu đã có URL ảnh
      const result = await blogService.createBlog(finalFormData);
      console.log("✅ Create Blog Success:", result);
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      console.error("Error creating blog:", error);
      setErrors((prev) => ({
        ...prev,
        submit: (error as Error)?.message || "Có lỗi xảy ra khi tạo bài viết",
      }));
      toast.error("Tạo bài viết thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Cleanup preview URL nếu có
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
      isPremium: false,
      isFeatured: false,
      featuredOrder: undefined,
    });
    setErrors({});
    setImagePreview("");
    setSelectedFile(null);
    setTagInput("");
    setTagSuggestions([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-5xl bg-card border border-border text-foreground rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Tạo bài viết mới
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Chia sẻ kiến thức và kinh nghiệm của bạn
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Top Row - Title and Blog Type */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tiêu đề bài viết <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                    className={`w-full px-4 py-3 bg-background border rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm transition-colors duration-200 ${errors.title
                      ? "border-destructive bg-destructive/10"
                      : "border-input"
                      }`}
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Blog Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Loại bài viết <span className="text-destructive">*</span>
                  </label>
                  <CustomSelect
                    value={formData.blogType}
                    onChange={(val) =>
                      handleInputChange("blogType", val as BlogType)
                    }
                    options={blogTypeOptions}
                    placeholder="Chọn loại bài viết"
                    triggerClassName={`h-[46px] rounded-lg text-sm ${errors.blogType
                      ? "border-destructive bg-destructive/10"
                      : ""
                      }`}
                  />
                  {errors.blogType && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {errors.blogType}
                    </p>
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
                  <CustomSelect
                    value={formData.categoryId || ""}
                    onChange={(val) =>
                      handleInputChange("categoryId", val ? String(val) : undefined)
                    }
                    options={categoryOptions}
                    placeholder="-- Chọn danh mục --"
                    searchable={true}
                    searchPlaceholder="Tìm kiếm danh mục..."
                    triggerClassName="h-[46px] rounded-lg text-sm"
                  />
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
                    className={`relative w-full h-[200px] rounded-lg border-2 border-dashed transition-all duration-200 overflow-hidden bg-muted/30 ${isUploadingImage || isLoading
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

              {/* Content - Full Width */}
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
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center text-destructive">
                  <X className="w-5 h-5 mr-2" />
                  <span className="text-sm">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Options Panel (Premium & Featured) */}
            <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-border bg-muted/20 p-4 rounded-xl">
              {/* Premium Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPremiumCreate"
                  checked={formData.isPremium || false}
                  onChange={(e) =>
                    handleInputChange("isPremium", e.target.checked)
                  }
                  className="w-4 h-4 text-accent border-input rounded focus:ring-accent bg-background cursor-pointer"
                  disabled={isLoading}
                />
                <label htmlFor="isPremiumCreate" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Chỉ dành cho Premium (yêu cầu subscription để đọc)
                </label>
              </div>

              {/* Featured Option */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeaturedCreate"
                    checked={formData.isFeatured || false}
                    onChange={(e) =>
                      handleInputChange("isFeatured", e.target.checked)
                    }
                    className="w-4 h-4 text-accent border-input rounded focus:ring-accent bg-background cursor-pointer"
                    disabled={isLoading}
                  />
                  <label htmlFor="isFeaturedCreate" className="text-sm font-medium text-foreground cursor-pointer select-none">
                    Bài viết nổi bật (Hiển thị ở trang chủ)
                  </label>
                </div>

                {formData.isFeatured && (
                  <div className="ml-7 max-w-[240px] animate-in fade-in slide-in-from-top-1 duration-200">
                    <label htmlFor="featuredOrderCreate" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Thứ tự hiển thị (tăng dần)
                    </label>
                    <input
                      type="number"
                      id="featuredOrderCreate"
                      value={formData.featuredOrder !== undefined ? formData.featuredOrder : ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                        handleInputChange("featuredOrder", val);
                      }}
                      placeholder="Ví dụ: 1"
                      className="w-full px-3 py-1.5 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                      disabled={isLoading}
                      min={0}
                    />
                    {maxFeaturedOrder !== null && (
                      <p className="mt-1.5 text-[11px] text-muted-foreground font-medium">
                        Vị trí lớn nhất: <span className="text-accent font-semibold">{maxFeaturedOrder}</span>
                        {` (Gợi ý tiếp theo: `}
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{maxFeaturedOrder + 1}</span>)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
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
                    {isUploadingImage
                      ? "Đang tải ảnh..."
                      : "Đang tạo..."}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Tạo bài viết
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
