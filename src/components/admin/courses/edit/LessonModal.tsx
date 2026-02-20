"use client";

import { useRef } from "react";
import { LessonFormat } from "@/types/lesson";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";
import VideoPlayer from "@/components/VideoPlayer";

interface LessonModalProps {
  isOpen: boolean;
  editId?: string;
  lessonName: string;
  description: string;
  content: string;
  lessonFormat: LessonFormat;
  videoUrl?: string;
  videoFileName: string;
  uploadProgress: number;
  isUploading: boolean;
  isFreePreview: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: () => void;
  onLessonNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onFormatChange: (format: LessonFormat) => void;
  onFreePreviewChange: (checked: boolean) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: () => void;
}

export default function LessonModal({
  isOpen,
  editId,
  lessonName,
  description,
  content,
  lessonFormat,
  videoUrl,
  videoFileName,
  uploadProgress,
  isUploading,
  isFreePreview,
  isSubmitting,
  onClose,
  onSave,
  onLessonNameChange,
  onDescriptionChange,
  onContentChange,
  onFormatChange,
  onFreePreviewChange,
  onVideoChange,
  onVideoRemove,
}: LessonModalProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => !isSubmitting && !isUploading && onClose()} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{editId ? "Sửa bài học" : "Thêm bài học mới"}</h3>
          <button
            onClick={() => !isSubmitting && !isUploading && onClose()}
            disabled={isSubmitting || isUploading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên bài học *</label>
                <input
                  type="text"
                  value={lessonName}
                  onChange={(e) => onLessonNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  placeholder="Nhập tên bài học"
                  autoFocus
                  disabled={isSubmitting || isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Định dạng bài học *</label>
                <select
                  value={lessonFormat}
                  onChange={(e) => onFormatChange(e.target.value as LessonFormat)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  disabled={isSubmitting || isUploading}
                >
                  <option value={LessonFormat.VIDEO}>Video - Học qua video</option>
                  <option value={LessonFormat.TEXT}>Text - Học qua tài liệu</option>
                  <option value={LessonFormat.MIXED}>Mixed - Kết hợp cả hai</option>
                </select>
              </div>
            </div>

            {/* For VIDEO format: Description and Video in one row */}
            {lessonFormat === LessonFormat.VIDEO && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="flex-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                    placeholder="Nhập mô tả bài học (tùy chọn)"
                    disabled={isSubmitting || isUploading}
                    style={{ minHeight: '220px' }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Video bài học *
                  </label>
                  {videoFileName ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{videoFileName}</p>
                          {isUploading && (
                            <div className="mt-1">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Đang tải lên... {uploadProgress}%</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {!isUploading && (
                            <button
                              onClick={onVideoRemove}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Xóa video"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {editId && videoUrl && !isUploading && (
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                          <VideoPlayer src={videoUrl} className="w-full" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => !isSubmitting && videoInputRef.current?.click()}
                      className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-accent cursor-pointer transition-colors"
                      style={{ minHeight: '220px' }}
                    >
                      <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600">Nhấn để chọn video</p>
                      <p className="text-xs text-gray-400 mt-1">Tối đa 2GB</p>
                    </div>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={onVideoChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* For TEXT and MIXED formats: Keep original layout */}
            {(lessonFormat === LessonFormat.TEXT || lessonFormat === LessonFormat.MIXED) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                    placeholder="Nhập mô tả bài học (tùy chọn)"
                    rows={3}
                    disabled={isSubmitting || isUploading}
                  />
                </div>

                {/* Content field - show for TEXT and MIXED */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nội dung bài học (Markdown) *
                  </label>
                  <MarkdownEditor
                    value={content}
                    onChange={onContentChange}
                    placeholder="Nhập nội dung bài học (hỗ trợ Markdown)"
                    height={500}
                  />
                </div>

                {/* Video field for MIXED format */}
                {lessonFormat === LessonFormat.MIXED && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Video bài học
                    </label>
                    {videoFileName ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{videoFileName}</p>
                            {isUploading && (
                              <div className="mt-1">
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-accent transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Đang tải lên... {uploadProgress}%</p>
                              </div>
                            )}
                          </div>
                          {!isUploading && (
                            <button
                              onClick={onVideoRemove}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {editId && videoUrl && !isUploading && (
                          <div className="rounded-lg overflow-hidden border border-gray-200">
                            <VideoPlayer src={videoUrl} className="w-full" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => !isSubmitting && videoInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent cursor-pointer transition-colors"
                      >
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">Nhấn để chọn video</p>
                        <p className="text-xs text-gray-400 mt-1">Tối đa 2GB</p>
                      </div>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={onVideoChange}
                      className="hidden"
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFreePreview"
                checked={isFreePreview}
                onChange={(e) => onFreePreviewChange(e.target.checked)}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                disabled={isSubmitting || isUploading}
              />
              <label htmlFor="isFreePreview" className="text-sm text-gray-700">
                Cho phép xem miễn phí (không cần mua khóa học)
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2"
          >
            {(isSubmitting || isUploading) && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isUploading ? "Đang tải video..." : editId ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}
