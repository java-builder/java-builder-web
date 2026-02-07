"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  BlogType,
  BlogTypeDisplayNames,
  CreateBlogRequest,
} from "@/types/blog";
import { blogService } from "@/services/blog.service";
import MarkdownEditor from "./MarkdownEditor";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

import toast from "react-hot-toast";

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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof CreateBlogRequest,
    value: string | BlogType,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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
      const finalFormData: CreateBlogRequest = { ...formData };

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
      toast.success("Tạo bài viết thành công!");
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
    });
    setErrors({});
    setImagePreview("");
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tạo bài viết mới
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Chia sẻ kiến thức và kinh nghiệm của bạn
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Top Row - Title and Blog Type */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài viết <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.title
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                      }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Blog Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bài viết <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.blogType}
                    onChange={(e) =>
                      handleInputChange("blogType", e.target.value as BlogType)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${errors.blogType
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.blogType}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tóm tắt
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  placeholder="Viết tóm tắt ngắn gọn về nội dung bài viết..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                />
              </div>

              {/* Content - Full Width */}
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

              {/* Featured Image - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative w-full max-w-md h-64">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      sizes="100vw"
                      className="object-cover rounded-lg border border-gray-200"
                      unoptimized
                    />
                  </div>
                )}

                {/* Upload Button */}
                <div className="max-w-md">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage || isLoading}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex flex-col items-center">
                      {isUploadingImage ? (
                        <>
                          <svg
                            className="animate-spin w-8 h-8 text-blue-500 mb-2"
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
                          <span className="text-sm text-blue-600">
                            Đang tải ảnh lên...
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-8 h-8 text-gray-400 mb-2"
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
                          <span className="text-sm text-gray-600">
                            {selectedFile
                              ? "Thay đổi ảnh"
                              : "Chọn ảnh đại diện"}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            PNG, JPG, GIF tối đa 5MB
                          </span>
                        </>
                      )}
                    </div>
                  </button>

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
                </div>

                {errors.key && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.key}
                  </p>
                )}
              </div>

              {/* Blog Type Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      {BlogTypeDisplayNames[formData.blogType]}
                    </h4>
                    <p className="text-xs text-blue-700">
                      {formData.blogType === BlogType.EXPERIENCE &&
                        "Chia sẻ những trải nghiệm thực tế trong công việc và học tập"}
                      {formData.blogType === BlogType.TUTORIAL &&
                        "Hướng dẫn chi tiết từng bước thực hiện"}
                      {formData.blogType === BlogType.QUESTION &&
                        "Đặt câu hỏi để nhận được sự hỗ trợ từ cộng đồng"}
                      {formData.blogType === BlogType.DISCUSSION &&
                        "Thảo luận về các chủ đề công nghệ và xu hướng"}
                      {formData.blogType === BlogType.TIPS &&
                        "Chia sẻ các mẹo và thủ thuật hữu ích"}
                      {formData.blogType === BlogType.REVIEW &&
                        "Đánh giá sản phẩm, công cụ, khóa học"}
                      {formData.blogType === BlogType.NEWS &&
                        "Cập nhật tin tức mới nhất trong ngành"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
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

            {/* Actions */}
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
                    {isUploadingImage
                      ? "Đang tải ảnh..."
                      : "Đang tạo bài viết..."}
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Tạo bài viết
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
