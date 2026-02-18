"use client";

import { useState, useRef, useEffect } from "react";
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

interface UpdateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog: Blog | null;
}

interface UpdateBlogFormData {
  title: string;
  content: string;
  summary?: string;
  key?: string;
  blogType: BlogType;
  categoryId?: string;
  tags?: string[];
}

export default function UpdateBlogModal({
  isOpen,
  onClose,
  onSuccess,
  blog,
}: UpdateBlogModalProps) {
  const [formData, setFormData] = useState<UpdateBlogFormData>({
    title: "",
    content: "",
    summary: "",
    key: "",
    blogType: BlogType.TUTORIAL,
    categoryId: undefined,
    tags: [],
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

  useEffect(() => {
    if (blog && isOpen) {
      setFormData({
        title: blog.title,
        content: blog.content,
        summary: blog.summary || "",
        key: "",
        blogType: blog.blogType,
        categoryId: blog.category?.id,
        tags: blog.tags?.map(t => typeof t === 'string' ? t : t.name) || [],
      });
      setImagePreview(blog.thumbnailUrl || "");
    }
  }, [blog, isOpen]);

  const handleInputChange = (
    field: keyof UpdateBlogFormData,
    value: string | BlogType | string[] | undefined,
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

    if (!blog) return;
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
      };

      // Only include key if a new image was uploaded
      if (finalImageKey !== undefined) {
        updatePayload.key = finalImageKey;
      }

      // Only include tags if they were changed
      const originalTags = blog.tags?.map(t => typeof t === 'string' ? t : t.name).sort() || [];
      const currentTags = (formData.tags || []).sort();
      const tagsChanged = JSON.stringify(originalTags) !== JSON.stringify(currentTags);
      
      if (tagsChanged) {
        updatePayload.tags = formData.tags;
      }

      await blogService.updateBlog(blog.id, updatePayload);

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
    onClose();
  };

  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Cập nhật bài viết
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Chỉnh sửa nội dung bài viết của bạn
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 text-gray-400"
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

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài viết <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bài viết <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.blogType}
                    onChange={(e) =>
                      handleInputChange("blogType", e.target.value as BlogType)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.blogType ? "border-red-300 bg-red-50" : "border-gray-300"
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
                    <p className="mt-1 text-sm text-red-600">{errors.blogType}</p>
                  )}
                </div>
              </div>

              {/* Category and Tags Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 inline mr-1.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Danh mục
                  </label>
                  <div className="relative">
                    <select
                      value={formData.categoryId || ""}
                      onChange={(e) =>
                        handleInputChange("categoryId", e.target.value || undefined)
                      }
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 bg-white appearance-none cursor-pointer hover:border-purple-400"
                    >
                      <option value="" className="text-gray-400">-- Chọn danh mục --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="text-gray-900">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Chọn danh mục phù hợp cho bài viết
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 inline mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
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
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    {isLoadingTags && (
                      <div className="absolute right-3 top-3.5">
                        <svg className="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    {tagSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {tagSuggestions.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleAddTag(tag.name)}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
                          >
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            <span className="text-gray-700">{tag.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Thêm tags để dễ tìm kiếm (nhấn Enter để thêm)
                  </p>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-blue-500 hover:text-blue-700 hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tóm tắt
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    placeholder="Viết tóm tắt ngắn gọn về nội dung bài viết..."
                    className="w-full h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 inline mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ảnh đại diện
                  </label>
                  
                  <div
                    onClick={() => !isUploadingImage && !isLoading && fileInputRef.current?.click()}
                    className={`relative w-full h-[200px] rounded-lg border-2 border-dashed transition-all duration-200 overflow-hidden bg-gray-50 ${
                      isUploadingImage || isLoading
                        ? 'border-gray-300 cursor-not-allowed opacity-50'
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50 cursor-pointer'
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
                        <svg
                          className="w-12 h-12 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">Click để chọn ảnh</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF tối đa 5MB</span>
                      </div>
                    )}
                    
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
                        <svg
                          className="animate-spin w-8 h-8 text-green-500 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-sm text-green-600">Đang tải ảnh lên...</span>
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
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.key}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung bài viết <span className="text-red-500">*</span>
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

            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-red-700">{errors.submit}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isUploadingImage ? "Đang tải ảnh..." : "Đang cập nhật..."}
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Cập nhật
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
