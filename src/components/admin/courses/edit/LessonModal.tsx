"use client";

import { useRef } from "react";
import { LessonFormat } from "@/types/lesson";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";
import VideoPlayer from "@/components/common/VideoPlayer";
import { X, Loader2, UploadCloud, Film, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-black/40 dark:bg-black/60 transition-opacity" 
        onClick={() => !isSubmitting && !isUploading && onClose()} 
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal content */}
        <div className="relative bg-card text-card-foreground border border-border rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col mx-4 z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent dark:text-accent-on-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {editId ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
                </h3>
              </div>
            </div>
            <button
              onClick={() => !isSubmitting && !isUploading && onClose()}
              disabled={isSubmitting || isUploading}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 p-1.5 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Tên bài học <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  value={lessonName}
                  onChange={(e) => onLessonNameChange(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  placeholder="Nhập tên bài học"
                  autoFocus
                  disabled={isSubmitting || isUploading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Định dạng bài học <span className="text-destructive">*</span></label>
                <select
                  value={lessonFormat}
                  onChange={(e) => onFormatChange(e.target.value as LessonFormat)}
                  className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  disabled={isSubmitting || isUploading}
                >
                  <option value={LessonFormat.VIDEO}>Video - Học qua video</option>
                  <option value={LessonFormat.TEXT}>Văn bản - Học qua tài liệu</option>
                  <option value={LessonFormat.MIXED}>Hỗn hợp - Kết hợp cả hai</option>
                </select>
              </div>
            </div>

            {/* VIDEO format fields */}
            {lessonFormat === LessonFormat.VIDEO && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="flex-1 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
                    placeholder="Nhập mô tả chi tiết của bài học (tùy chọn)"
                    disabled={isSubmitting || isUploading}
                    style={{ minHeight: '220px' }}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Video bài giảng <span className="text-destructive">*</span>
                  </label>
                  {videoFileName ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                        <Film className="w-8 h-8 text-accent dark:text-accent-on-dark flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{videoFileName}</p>
                          {isUploading && (
                            <div className="mt-1">
                              <div className="h-1.5 bg-muted border border-border rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Đang tải lên... {uploadProgress}%</p>
                            </div>
                          )}
                        </div>
                        {!isUploading && (
                          <button
                            onClick={onVideoRemove}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40"
                            title="Xóa video"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      {editId && videoUrl && !isUploading && (
                        <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">
                          <VideoPlayer src={videoUrl} className="w-full h-full" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => !isSubmitting && videoInputRef.current?.click()}
                      className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg hover:border-accent/40 hover:bg-accent/5 cursor-pointer transition-all duration-200 bg-muted/30"
                      style={{ minHeight: '220px' }}
                    >
                      <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                      <p className="text-sm font-semibold text-foreground">Nhấn để tải lên video</p>
                      <p className="text-xs text-muted-foreground mt-1">Hỗ trợ các định dạng video phổ biến. Tối đa 2GB.</p>
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

            {/* TEXT and MIXED formats fields */}
            {(lessonFormat === LessonFormat.TEXT || lessonFormat === LessonFormat.MIXED) && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
                    placeholder="Nhập mô tả bài học (tùy chọn)"
                    rows={3}
                    disabled={isSubmitting || isUploading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Nội dung bài học (Markdown) <span className="text-destructive">*</span>
                  </label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <MarkdownEditor
                      value={content}
                      onChange={onContentChange}
                      placeholder="Nhập nội dung bài giảng..."
                      height={400}
                    />
                  </div>
                </div>

                {/* Additional Video field for MIXED format */}
                {lessonFormat === LessonFormat.MIXED && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">
                      Video bài giảng kèm theo
                    </label>
                    {videoFileName ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                          <Film className="w-8 h-8 text-accent dark:text-accent-on-dark flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{videoFileName}</p>
                            {isUploading && (
                              <div className="mt-1">
                                <div className="h-1.5 bg-muted border border-border rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-accent transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Đang tải lên... {uploadProgress}%</p>
                              </div>
                            )}
                          </div>
                          {!isUploading && (
                            <button
                              onClick={onVideoRemove}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {editId && videoUrl && !isUploading && (
                          <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">
                            <VideoPlayer src={videoUrl} className="w-full h-full" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => !isSubmitting && videoInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg hover:border-accent/40 hover:bg-accent/5 cursor-pointer transition-all duration-200 bg-muted/30"
                      >
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-semibold text-foreground">Nhấn để tải lên video</p>
                        <p className="text-xs text-muted-foreground mt-1">Tối đa 2GB</p>
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

            {/* Free Preview Option */}
            <div className="flex items-center space-x-3 bg-muted/20 border border-border p-4 rounded-lg">
              <input
                type="checkbox"
                id="isFreePreview"
                checked={isFreePreview}
                onChange={(e) => onFreePreviewChange(e.target.checked)}
                className="w-4.5 h-4.5 text-accent border-input rounded bg-transparent focus:ring-ring focus:ring-1 cursor-pointer"
                disabled={isSubmitting || isUploading}
              />
              <label htmlFor="isFreePreview" className="text-sm font-semibold text-foreground cursor-pointer select-none">
                Cho phép xem thử miễn phí (không cần đăng ký khóa học)
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-4 border-t border-border bg-muted/40 rounded-b-xl">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
            >
              Hủy
            </Button>
            <Button
              variant="accent"
              onClick={onSave}
              disabled={isSubmitting || isUploading}
              className="gap-2 font-medium"
            >
              {(isSubmitting || isUploading) && (
                <Loader2 className="animate-spin w-4 h-4" />
              )}
              {isUploading ? "Đang tải video..." : editId ? "Cập nhật" : "Thêm bài học"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
