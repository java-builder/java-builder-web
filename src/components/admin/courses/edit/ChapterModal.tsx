"use client";

interface ChapterModalProps {
  isOpen: boolean;
  editId: string;
  chapterName: string;
  description: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: () => void;
  onChapterNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function ChapterModal({
  isOpen,
  editId,
  chapterName,
  description,
  isSubmitting,
  onClose,
  onSave,
  onChapterNameChange,
  onDescriptionChange,
}: ChapterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => !isSubmitting && onClose()} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editId ? "Sửa chương" : "Thêm chương mới"}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên chương *</label>
            <input
              type="text"
              value={chapterName}
              onChange={(e) => onChapterNameChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
              placeholder="Nhập tên chương"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
              placeholder="Nhập mô tả chương (tùy chọn)"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {editId ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}
