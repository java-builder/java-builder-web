"use client";

import { RefObject } from "react";
import Image from "next/image";
import { CourseLevel, CourseFormat, CourseStatus } from "@/types/course";
import { UploadCloud } from "lucide-react";

interface CourseInfoTabProps {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: CourseLevel;
  courseFormat: CourseFormat;
  courseStatus: CourseStatus;
  imagePreview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onLevelChange: (value: CourseLevel) => void;
  onCourseFormatChange: (value: CourseFormat) => void;
  onCourseStatusChange: (value: CourseStatus) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CourseInfoTab({
  title,
  description,
  price,
  duration,
  level,
  courseFormat,
  courseStatus,
  imagePreview,
  fileInputRef,
  onTitleChange,
  onDescriptionChange,
  onPriceChange,
  onDurationChange,
  onLevelChange,
  onCourseFormatChange,
  onCourseStatusChange,
  onImageChange,
}: CourseInfoTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Tên khóa học</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            placeholder="Nhập tên khóa học"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={8}
            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none min-h-[200px]"
            placeholder="Nhập mô tả khóa học"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Giá (VNĐ)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors text-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Thời lượng (giờ)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => onDurationChange(Number(e.target.value))}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors text-foreground"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Cấp độ</label>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value as CourseLevel)}
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
          >
            <option value={CourseLevel.BEGINNER}>Cơ bản</option>
            <option value={CourseLevel.INTERMEDIATE}>Trung cấp</option>
            <option value={CourseLevel.ADVANCED}>Nâng cao</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Định dạng khóa học</label>
          <select
            value={courseFormat}
            onChange={(e) => onCourseFormatChange(e.target.value as CourseFormat)}
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
          >
            <option value={CourseFormat.VIDEO}>Video - Học qua video</option>
            <option value={CourseFormat.TEXT}>Văn bản - Học qua tài liệu</option>
            <option value={CourseFormat.MIXED}>Hỗn hợp - Kết hợp cả hai</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Trạng thái khóa học</label>
          <select
            value={courseStatus}
            onChange={(e) => onCourseStatusChange(e.target.value as CourseStatus)}
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
          >
            <option value={CourseStatus.ACTIVE}>Hoạt động</option>
            <option value={CourseStatus.INACTIVE}>Không hoạt động</option>
            <option value={CourseStatus.DELETED}>Đã xóa</option>
          </select>
        </div>
      </div>
      {/* Right Column - Image */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">Ảnh bìa</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-video bg-muted/30 rounded-lg border-2 border-dashed border-border hover:border-accent/40 cursor-pointer overflow-hidden transition-all duration-200"
        >
          {imagePreview ? (
            <Image src={imagePreview} alt="Cover" fill className="object-cover" unoptimized />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <UploadCloud className="w-10 h-10 mb-2" />
              <span className="text-sm font-semibold text-foreground">Nhấn để chọn ảnh</span>
              <span className="text-xs mt-1">Kích thước tối đa 5MB</span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} className="hidden" />
      </div>
    </div>
  );
}
