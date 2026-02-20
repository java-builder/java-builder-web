"use client";

import { RefObject } from "react";
import Image from "next/image";
import { CourseLevel, CourseFormat } from "@/types/course";

interface CourseInfoTabProps {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: CourseLevel;
  courseFormat: CourseFormat;
  imagePreview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onLevelChange: (value: CourseLevel) => void;
  onCourseFormatChange: (value: CourseFormat) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CourseInfoTab({
  title,
  description,
  price,
  duration,
  level,
  courseFormat,
  imagePreview,
  fileInputRef,
  onTitleChange,
  onDescriptionChange,
  onPriceChange,
  onDurationChange,
  onLevelChange,
  onCourseFormatChange,
  onImageChange,
}: CourseInfoTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên khóa học</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            placeholder="Nhập tên khóa học"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={8}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-y min-h-[200px]"
            placeholder="Nhập mô tả khóa học"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá (VNĐ)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời lượng (giờ)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => onDurationChange(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cấp độ</label>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value as CourseLevel)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          >
            <option value={CourseLevel.BEGINNER}>Cơ bản</option>
            <option value={CourseLevel.INTERMEDIATE}>Trung cấp</option>
            <option value={CourseLevel.ADVANCED}>Nâng cao</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Định dạng khóa học</label>
          <select
            value={courseFormat}
            onChange={(e) => onCourseFormatChange(e.target.value as CourseFormat)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          >
            <option value={CourseFormat.VIDEO}>Video - Học qua video</option>
            <option value={CourseFormat.TEXT}>Text - Học qua tài liệu</option>
            <option value={CourseFormat.MIXED}>Mixed - Kết hợp cả hai</option>
          </select>
        </div>
      </div>
      {/* Right Column - Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-accent cursor-pointer overflow-hidden transition-colors"
        >
          {imagePreview ? (
            <Image src={imagePreview} alt="Cover" fill className="object-contain" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Nhấn để chọn ảnh</span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} className="hidden" />
      </div>
    </div>
  );
}
