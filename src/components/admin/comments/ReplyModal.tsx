import { useState } from "react";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  commentAuthor: string;
  commentContent: string;
}

export default function ReplyModal({
  isOpen,
  onClose,
  onSubmit,
  commentAuthor,
  commentContent,
}: ReplyModalProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(replyContent);
      setReplyContent("");
      onClose();
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReplyContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop - Blur effect */}
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal - Clean & Professional */}
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Trả lời bình luận</h3>
              <p className="text-sm text-gray-600 mt-1">
                Phản hồi cho <span className="font-medium">{commentAuthor}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
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

          {/* Original Comment */}
          <div className="px-6 py-4 bg-gray-50">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Bình luận gốc
            </p>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">{commentContent}</p>
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung phản hồi <span className="text-red-500">*</span>
              </label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Nhập nội dung phản hồi..."
                rows={5}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {replyContent.length} ký tự
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !replyContent.trim()}
                className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
