"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { courseApi, fileApi } from "@/services/course.service";
import { CreateCourseRequest, CourseLevel, CourseFormat } from "@/types/course";
import { formatPriceInput, parsePriceInput } from "@/utils/formatters";
import toast from "react-hot-toast";
import { PlusCircle, X, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData extends CreateCourseRequest {
  imageFile?: File;
}

const levelOptions = [
  { value: CourseLevel.BEGINNER, label: "Cơ bản" },
  { value: CourseLevel.INTERMEDIATE, label: "Trung bình" },
  { value: CourseLevel.ADVANCED, label: "Nâng cao" },
];

const courseFormatOptions = [
  { value: CourseFormat.VIDEO, label: "Video - Học qua video" },
  { value: CourseFormat.TEXT, label: "Văn bản - Học qua tài liệu" },
  { value: CourseFormat.MIXED, label: "Hỗn hợp - Kết hợp cả hai" },
];

export default function CreateCourseModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCourseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [priceDisplay, setPriceDisplay] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      duration: 0,
      level: CourseLevel.BEGINNER,
      courseFormat: CourseFormat.VIDEO,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      setValue("imageFile", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parsePriceInput(e.target.value);
    setValue("price", numValue);
    setPriceDisplay(formatPriceInput(e.target.value));
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

      let key = "";

      // Upload ảnh bằng presigned URL
      if (data.imageFile) {
        const result = await fileApi.uploadPublicImage(data.imageFile);
        key = result.key;
      }

      const courseData: CreateCourseRequest = {
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration,
        key: key || undefined,
        level: data.level,
        courseFormat: data.courseFormat,
      };

      const result = await courseApi.create(courseData);

      if (result.code === 200) {
        toast.success("Tạo khóa học thành công!");
        reset();
        setImagePreview(null);
        setPriceDisplay("");
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
      setPriceDisplay("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/40 dark:bg-black/60 transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal */}
        <div className="relative bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col z-10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40 rounded-t-xl">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-accent dark:text-accent-on-dark" />
              Tạo khóa học mới
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Tên khóa học <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Tên khóa học là bắt buộc",
                  })}
                  className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  placeholder="Nhập tên khóa học"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Mô tả khóa học <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register("description", {
                    required: "Mô tả khóa học là bắt buộc",
                  })}
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground resize-none"
                  placeholder="Nhập mô tả chi tiết về khóa học"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Giá khóa học (VNĐ) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={priceDisplay}
                    onChange={handlePriceChange}
                    className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
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
                    className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.duration && (
                    <p className="text-xs text-destructive">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Level & Course Format Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Cấp độ
                  </label>
                  <CustomSelect
                    value={watch("level")}
                    onChange={(val) => setValue("level", val as CourseLevel)}
                    options={levelOptions}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Định dạng khóa học <span className="text-destructive">*</span>
                  </label>
                  <CustomSelect
                    value={watch("courseFormat")}
                    onChange={(val) => setValue("courseFormat", val as CourseFormat, { shouldValidate: true })}
                    options={courseFormatOptions}
                    disabled={isLoading}
                  />
                  {errors.courseFormat && (
                    <p className="text-xs text-destructive">
                      {errors.courseFormat.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Ảnh bìa khóa học
                </label>

                {imagePreview ? (
                  <div className="relative w-full rounded-lg overflow-hidden border border-border bg-muted/40 p-2">
                    <div className="relative w-full h-48">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain rounded-md"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-destructive text-white rounded-full p-1.5 hover:bg-destructive/95 transition-colors shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 bg-muted/30"
                  >
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-foreground text-sm font-semibold">
                      Nhấn để chọn ảnh bìa
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Chấp nhận JPG, PNG, GIF. Kích thước tối đa 5MB
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

          {/* Fixed Actions Footer */}
          <div className="flex justify-end space-x-3 p-4 border-t border-border bg-muted/40 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="text-sm font-medium"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="accent"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="text-sm font-medium"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : (
                <>
                  Tạo khóa học
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
