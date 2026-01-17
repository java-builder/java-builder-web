"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { courseApi, fileApi } from "@/services/course.service";
import { CreateCourseRequest, CourseLevel } from "@/types/course";
import toast from "react-hot-toast";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData extends CreateCourseRequest {
  imageFile?: File;
}

export default function CreateCourseModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCourseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      duration: 0,
      level: CourseLevel.BEGINNER,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      setValue("imageFile", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("imageFile", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      let courseCover = "";

      if (data.imageFile) {
        const uploadResult = await fileApi.uploadSingleMedia(data.imageFile);
        if (uploadResult.code === 200 && uploadResult.result) {
          courseCover = uploadResult.result.url;
        }
      }

      const courseData: CreateCourseRequest = {
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration,
        courseCover: courseCover || undefined,
        level: data.level,
      };

      const result = await courseApi.create(courseData);

      if (result.code === 200) {
        toast.success("Tạo khóa học thành công!");
        reset();
        setImagePreview(null);
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tạo khóa học thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setImagePreview(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop - chỉ blur, không che màu */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/5 transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-accent-50 to-accent-100 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <svg
                className="w-6 h-6 text-accent mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Tạo khóa học mới
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-red-50"
            >
              <svg
                className="w-6 h-6"
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

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khóa học *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Tên khóa học là bắt buộc",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Nhập tên khóa học"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả khóa học *
                </label>
                <textarea
                  {...register("description", {
                    required: "Mô tả khóa học là bắt buộc",
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 resize-none bg-gray-50 hover:bg-white"
                  placeholder="Nhập mô tả khóa học"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá khóa học (VNĐ) *
                  </label>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Giá khóa học là bắt buộc",
                      min: {
                        value: 0,
                        message: "Giá phải lớn hơn hoặc bằng 0",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng (giờ)
                  </label>
                  <input
                    type="number"
                    {...register("duration", {
                      min: {
                        value: 0,
                        message: "Thời lượng phải lớn hơn hoặc bằng 0",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cấp độ
                </label>
                <select
                  {...register("level")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-gray-50 hover:bg-white"
                  disabled={isLoading}
                >
                  <option value={CourseLevel.BEGINNER}>Cơ bản</option>
                  <option value={CourseLevel.INTERMEDIATE}>Trung bình</option>
                  <option value={CourseLevel.ADVANCED}>Nâng cao</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh bìa khóa học
                </label>

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={600}
                        height={300}
                        className="w-full h-auto object-contain rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
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
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-accent-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent-400 hover:bg-accent-50 transition-all duration-200 bg-gray-50"
                  >
                    <svg
                      className="w-12 h-12 text-accent-400 mb-2"
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
                    <p className="text-accent-600 text-sm font-medium">
                      Nhấn để chọn ảnh
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      JPG, PNG, GIF. Tối đa 5MB
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>

          {/* Fixed Actions */}
          <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:border-gray-400 transition-all duration-200 disabled:opacity-50 font-medium text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-accent to-accent-600 text-white rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 font-medium text-sm shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Đang tạo...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
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
                  Tạo khóa học
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
